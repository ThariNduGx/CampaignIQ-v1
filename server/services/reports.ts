import { storage } from "../storage";
import { googleApiService } from "./google";
import { getMetaAdInsights } from "./meta";
import { generateAIInsights } from "./openai";
import puppeteer from 'puppeteer';

export interface ReportData {
  summary: {
    totalSpend: number;
    totalConversions: number;
    totalRevenue: number;
    avgRoas: number;
    avgCtr: number;
    totalClicks: number;
    totalImpressions: number;
  };
  platforms: {
    google: {
      analytics: any;
      searchConsole: any;
    };
    meta: any;
  };
  campaigns: any[];
  aiInsights: any[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export async function generateReportData(
  workspaceId: string,
  startDate: string,
  endDate: string
): Promise<ReportData> {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Initialize data structure
  let totalSpend = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalConversions = 0;
  let totalRevenue = 0;

  const platforms = {
    google: {
      analytics: null as any,
      searchConsole: null as any
    },
    meta: null as any
  };

  // Get Google Analytics and Search Console data
  try {
    const googleConnection = await storage.getConnection(workspaceId, 'google');
    if (googleConnection) {
      googleApiService.setCredentials({
        access_token: googleConnection.accessToken,
        refresh_token: googleConnection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        token_type: 'Bearer',
        expiry_date: googleConnection.expiresAt ? new Date(googleConnection.expiresAt).getTime() : undefined,
      });

      const analyticsData = await googleApiService.getAnalyticsData('415651514', startDate, endDate);
      const searchConsoleData = await googleApiService.getSearchConsoleData('https://www.silvans.com.au/', startDate, endDate);
      
      platforms.google.analytics = analyticsData;
      platforms.google.searchConsole = searchConsoleData;
      
      totalConversions += analyticsData.goalCompletions || 0;
      totalRevenue += analyticsData.revenue || 0;
      totalClicks += searchConsoleData.clicks || 0;
      totalImpressions += searchConsoleData.impressions || 0;
    }
  } catch (error) {
    console.log('Google data not available:', error);
  }

  // Get Meta advertising data
  try {
    const metaConnection = await storage.getConnection(workspaceId, 'meta');
    if (metaConnection) {
      const metaData = await getMetaAdInsights(workspaceId, undefined, startDate, endDate);
      platforms.meta = metaData;
      
      totalSpend += metaData.spend || 0;
      totalClicks += metaData.clicks || 0;
      totalImpressions += metaData.impressions || 0;
    }
  } catch (error) {
    console.log('Meta data not available:', error);
  }

  // Get campaigns
  const campaigns = await storage.getWorkspaceCampaigns(workspaceId);

  // Calculate derived metrics
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const summary = {
    totalSpend,
    totalConversions,
    totalRevenue,
    avgRoas,
    avgCtr,
    totalClicks,
    totalImpressions
  };

  // AI insights will be generated on demand, not during report generation
  const aiInsights: any[] = [];

  return {
    summary,
    platforms,
    campaigns,
    aiInsights,
    dateRange: {
      startDate,
      endDate
    }
  };
}

export function generateCSVReport(data: ReportData): string {
  const { summary, platforms, dateRange } = data;
  
  let csv = 'CampaignIQ Performance Report\n';
  csv += `Report Period,${dateRange.startDate},${dateRange.endDate}\n`;
  csv += `Generated On,${new Date().toISOString()}\n\n`;
  
  // Summary metrics
  csv += 'PERFORMANCE SUMMARY\n';
  csv += 'Metric,Value\n';
  csv += `Total Ad Spend,$${summary.totalSpend.toFixed(2)}\n`;
  csv += `Total Clicks,${summary.totalClicks}\n`;
  csv += `Total Impressions,${summary.totalImpressions}\n`;
  csv += `Total Conversions,${summary.totalConversions}\n`;
  csv += `Total Revenue,$${summary.totalRevenue.toFixed(2)}\n`;
  csv += `Average CTR,${(summary.avgCtr * 100).toFixed(2)}%\n`;
  csv += `Average ROAS,${summary.avgRoas.toFixed(2)}x\n\n`;

  // Platform breakdown
  csv += 'PLATFORM BREAKDOWN\n';
  csv += 'Platform,Metric,Value\n';
  
  if (platforms.google.analytics) {
    const ga = platforms.google.analytics;
    csv += `Google Analytics,Sessions,${ga.sessions}\n`;
    csv += `Google Analytics,Pageviews,${ga.pageviews}\n`;
    csv += `Google Analytics,Conversions,${ga.goalCompletions}\n`;
    csv += `Google Analytics,Revenue,$${ga.revenue.toFixed(2)}\n`;
  }
  
  if (platforms.google.searchConsole) {
    const gsc = platforms.google.searchConsole;
    csv += `Google Search Console,Clicks,${gsc.clicks}\n`;
    csv += `Google Search Console,Impressions,${gsc.impressions}\n`;
    csv += `Google Search Console,CTR,${gsc.ctr.toFixed(2)}%\n`;
    csv += `Google Search Console,Avg Position,${gsc.position.toFixed(1)}\n`;
  }
  
  if (platforms.meta) {
    const meta = platforms.meta;
    csv += `Meta Ads,Impressions,${meta.impressions}\n`;
    csv += `Meta Ads,Clicks,${meta.clicks}\n`;
    csv += `Meta Ads,Spend,$${meta.spend.toFixed(2)}\n`;
    csv += `Meta Ads,Reach,${meta.reach}\n`;
    csv += `Meta Ads,CTR,${meta.ctr.toFixed(2)}%\n`;
  }

  return csv;
}

export function generateHTMLReport(data: ReportData, reportType: string): string {
  const { summary, platforms, aiInsights, dateRange } = data;
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
  
  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CampaignIQ ${reportType} Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #007bff; margin: 0; }
    .period { color: #666; margin: 5px 0; }
    .section { margin: 30px 0; }
    .section h2 { color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
    .metric-value { font-size: 24px; font-weight: bold; color: #007bff; }
    .metric-label { color: #666; margin-top: 5px; }
    .platform-section { background: #f8f9fa; padding: 20px; margin: 15px 0; border-radius: 8px; }
    .insight-item { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #28a745; }
    .insight-title { font-weight: bold; color: #333; }
    .insight-content { margin-top: 8px; color: #666; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CampaignIQ Performance Report</h1>
    <div class="period">Report Period: ${dateRange.startDate} to ${dateRange.endDate}</div>
    <div class="period">Generated: ${new Date().toLocaleString()}</div>
  </div>

  <div class="section">
    <h2>Performance Summary</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${formatCurrency(summary.totalSpend)}</div>
        <div class="metric-label">Total Ad Spend</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${formatNumber(summary.totalClicks)}</div>
        <div class="metric-label">Total Clicks</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${formatNumber(summary.totalImpressions)}</div>
        <div class="metric-label">Total Impressions</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.totalConversions}</div>
        <div class="metric-label">Total Conversions</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${formatCurrency(summary.totalRevenue)}</div>
        <div class="metric-label">Total Revenue</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${(summary.avgCtr * 100).toFixed(2)}%</div>
        <div class="metric-label">Average CTR</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.avgRoas.toFixed(2)}x</div>
        <div class="metric-label">Average ROAS</div>
      </div>
    </div>
  </div>`;

  // Platform sections
  if (platforms.google.analytics || platforms.google.searchConsole) {
    html += `
  <div class="section">
    <h2>Google Performance</h2>`;
    
    if (platforms.google.analytics) {
      const ga = platforms.google.analytics;
      html += `
    <div class="platform-section">
      <h3>Google Analytics</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${formatNumber(ga.sessions)}</div>
          <div class="metric-label">Sessions</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatNumber(ga.pageviews)}</div>
          <div class="metric-label">Pageviews</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${ga.goalCompletions}</div>
          <div class="metric-label">Conversions</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatCurrency(ga.revenue)}</div>
          <div class="metric-label">Revenue</div>
        </div>
      </div>
    </div>`;
    }
    
    if (platforms.google.searchConsole) {
      const gsc = platforms.google.searchConsole;
      html += `
    <div class="platform-section">
      <h3>Google Search Console</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${formatNumber(gsc.clicks)}</div>
          <div class="metric-label">Search Clicks</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatNumber(gsc.impressions)}</div>
          <div class="metric-label">Search Impressions</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${gsc.ctr.toFixed(2)}%</div>
          <div class="metric-label">Search CTR</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${gsc.position.toFixed(1)}</div>
          <div class="metric-label">Avg Position</div>
        </div>
      </div>
    </div>`;
    }
    
    html += `</div>`;
  }

  if (platforms.meta) {
    const meta = platforms.meta;
    html += `
  <div class="section">
    <h2>Meta Ads Performance</h2>
    <div class="platform-section">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${formatNumber(meta.impressions)}</div>
          <div class="metric-label">Impressions</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatNumber(meta.clicks)}</div>
          <div class="metric-label">Clicks</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatCurrency(meta.spend)}</div>
          <div class="metric-label">Ad Spend</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatNumber(meta.reach)}</div>
          <div class="metric-label">Reach</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${meta.ctr.toFixed(2)}%</div>
          <div class="metric-label">CTR</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${formatCurrency(meta.cpc)}</div>
          <div class="metric-label">Cost per Click</div>
        </div>
      </div>
    </div>
  </div>`;
  }

  // AI Insights section
  if (aiInsights && aiInsights.length > 0) {
    html += `
  <div class="section">
    <h2>AI-Powered Insights</h2>`;
    
    aiInsights.forEach((insight: any) => {
      html += `
    <div class="insight-item">
      <div class="insight-title">${insight.title}</div>
      <div class="insight-content">${insight.content}</div>
    </div>`;
    });
    
    html += `</div>`;
  }

  html += `
  <div class="footer">
    Generated by CampaignIQ - Unified Marketing Analytics Dashboard<br>
    Report contains data from connected advertising platforms and analytics services
  </div>
</body>
</html>`;

  return html;
}

export async function generatePDFReport(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}