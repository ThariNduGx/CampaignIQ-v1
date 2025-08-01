import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface MetricsSummary {
  totalSpend: number;
  totalConversions: number;
  totalRevenue: number;
  avgRoas: number;
  avgCtr: number;
  totalClicks: number;
  totalImpressions: number;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  priority: 'high' | 'medium' | 'low';
}

export async function generateAIInsights(
  currentMetrics: MetricsSummary,
  previousMetrics?: MetricsSummary,
  campaignData?: any[]
): Promise<AIInsight[]> {
  try {
    // Calculate performance changes if previous metrics are available
    const changes = previousMetrics ? {
      spendChange: ((currentMetrics.totalSpend - previousMetrics.totalSpend) / previousMetrics.totalSpend) * 100,
      roasChange: ((currentMetrics.avgRoas - previousMetrics.avgRoas) / previousMetrics.avgRoas) * 100,
      ctrChange: ((currentMetrics.avgCtr - previousMetrics.avgCtr) / previousMetrics.avgCtr) * 100,
      conversionsChange: ((currentMetrics.totalConversions - previousMetrics.totalConversions) / previousMetrics.totalConversions) * 100,
    } : null;

    const prompt = `
You are a marketing analytics expert. Analyze the following campaign performance data and provide 3-4 actionable insights in plain English.

Current Performance:
- Total Ad Spend: $${currentMetrics.totalSpend.toFixed(2)}
- Total Conversions: ${currentMetrics.totalConversions}
- Total Revenue: $${currentMetrics.totalRevenue.toFixed(2)}
- Average ROAS: ${currentMetrics.avgRoas.toFixed(2)}x
- Average CTR: ${(currentMetrics.avgCtr * 100).toFixed(2)}%
- Total Clicks: ${currentMetrics.totalClicks}
- Total Impressions: ${currentMetrics.totalImpressions}

${changes ? `
Performance Changes vs Previous Period:
- Spend Change: ${changes.spendChange.toFixed(1)}%
- ROAS Change: ${changes.roasChange.toFixed(1)}%
- CTR Change: ${changes.ctrChange.toFixed(1)}%
- Conversions Change: ${changes.conversionsChange.toFixed(1)}%
` : ''}

Provide insights as a JSON array with objects containing:
- title: Brief insight title
- content: 2-3 sentence explanation with specific numbers and actionable advice
- type: "success" (good performance), "warning" (needs attention), "info" (neutral observation), or "alert" (urgent issue)
- priority: "high", "medium", or "low"

Focus on:
1. Overall performance trends and what they mean
2. Anomaly detection (unusual spikes or drops)
3. ROAS and efficiency insights
4. Specific recommendations for improvement

Respond only with valid JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a marketing analytics expert providing actionable insights based on advertising performance data. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    return result.insights || result || [];

  } catch (error) {
    console.error('Error generating AI insights:', error);
    
    // Return fallback insights based on the data
    const insights: AIInsight[] = [];
    
    if (currentMetrics.avgRoas > 3) {
      insights.push({
        title: "Strong ROAS Performance",
        content: `Your Return on Ad Spend of ${currentMetrics.avgRoas.toFixed(2)}x is excellent, generating $${currentMetrics.avgRoas.toFixed(2)} for every $1 spent. This indicates efficient campaign targeting and creative performance.`,
        type: "success",
        priority: "medium"
      });
    } else if (currentMetrics.avgRoas < 2) {
      insights.push({
        title: "ROAS Needs Improvement",
        content: `Your current ROAS of ${currentMetrics.avgRoas.toFixed(2)}x is below optimal levels. Consider reviewing your targeting, ad creative, and landing page conversion rates to improve efficiency.`,
        type: "warning",
        priority: "high"
      });
    }

    if (currentMetrics.avgCtr > 0.03) {
      insights.push({
        title: "High Click-Through Rates",
        content: `Your CTR of ${(currentMetrics.avgCtr * 100).toFixed(2)}% shows strong ad relevance and appeal. Your creative messaging is resonating well with your target audience.`,
        type: "success",
        priority: "low"
      });
    }

    if (currentMetrics.totalSpend > 0 && currentMetrics.totalConversions === 0) {
      insights.push({
        title: "No Conversions Detected",
        content: `Despite spending $${currentMetrics.totalSpend.toFixed(2)}, no conversions were recorded. Check your conversion tracking setup and consider optimizing your landing pages.`,
        type: "alert",
        priority: "high"
      });
    }

    return insights;
  }
}

export async function detectAnomalies(
  currentMetrics: MetricsSummary,
  historicalData: MetricsSummary[]
): Promise<AIInsight[]> {
  const anomalies: AIInsight[] = [];
  
  if (historicalData.length === 0) return anomalies;
  
  const avgSpend = historicalData.reduce((sum, m) => sum + m.totalSpend, 0) / historicalData.length;
  const avgRoas = historicalData.reduce((sum, m) => sum + m.avgRoas, 0) / historicalData.length;
  
  // Detect spending anomalies (>50% increase)
  if (currentMetrics.totalSpend > avgSpend * 1.5) {
    anomalies.push({
      title: "Unusual Spending Spike",
      content: `Your ad spend increased by ${(((currentMetrics.totalSpend - avgSpend) / avgSpend) * 100).toFixed(0)}% compared to your average. Review campaign settings and bid strategies to ensure this is intentional.`,
      type: "alert",
      priority: "high"
    });
  }
  
  // Detect ROAS drops (>30% decrease)
  if (currentMetrics.avgRoas < avgRoas * 0.7) {
    anomalies.push({
      title: "ROAS Performance Drop",
      content: `Your ROAS decreased by ${(((avgRoas - currentMetrics.avgRoas) / avgRoas) * 100).toFixed(0)}% from your average. This may indicate campaign fatigue or increased competition.`,
      type: "warning",
      priority: "high"
    });
  }
  
  return anomalies;
}