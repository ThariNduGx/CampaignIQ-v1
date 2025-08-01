import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export interface GoogleAnalyticsData {
  sessions: number;
  pageviews: number;
  bounceRate: number;
  avgSessionDuration: number;
  goalCompletions: number;
  revenue: number;
}

export interface GoogleSearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export interface GoogleMyBusinessData {
  views: number;
  searches: number;
  actions: number;
  callClicks: number;
  directionRequests: number;
  websiteClicks: number;
}

export class GoogleApiService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  setCredentials(tokens: GoogleTokens) {
    this.oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    });
  }

  async getUserProperties(): Promise<string[]> {
    try {
      const analytics = google.analyticsadmin({ version: 'v1beta', auth: this.oauth2Client });
      const response = await analytics.properties.list();
      return response.data.properties?.map(prop => prop.name?.split('/')[1] || '').filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching user properties:', error);
      return [];
    }
  }

  async getAnalyticsData(startDate: string, endDate: string): Promise<GoogleAnalyticsData> {
    try {
      const properties = await this.getUserProperties();
      
      if (properties.length === 0) {
        return {
          sessions: 0,
          pageviews: 0,
          bounceRate: 0,
          avgSessionDuration: 0,
          goalCompletions: 0,
          revenue: 0,
        };
      }

      // Use the first available property
      const propertyId = properties[0];
      const analytics = google.analyticsdata({ version: 'v1beta', auth: this.oauth2Client });
      
      const response = await analytics.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' },
            { name: 'conversions' },
            { name: 'totalRevenue' }
          ],
        },
      });

      const rows = response.data.rows || [];
      const metrics = rows[0]?.metricValues || [];

      return {
        sessions: parseInt(metrics[0]?.value || '0'),
        pageviews: parseInt(metrics[1]?.value || '0'),
        bounceRate: parseFloat(metrics[2]?.value || '0'),
        avgSessionDuration: parseFloat(metrics[3]?.value || '0'),
        goalCompletions: parseInt(metrics[4]?.value || '0'),
        revenue: parseFloat(metrics[5]?.value || '0'),
      };
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      // Return empty data instead of throwing
      return {
        sessions: 0,
        pageviews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        goalCompletions: 0,
        revenue: 0,
      };
    }
  }

  async getUserSites(): Promise<string[]> {
    try {
      const searchconsole = google.searchconsole({ version: 'v1', auth: this.oauth2Client });
      const response = await searchconsole.sites.list();
      return response.data.siteEntry?.map(site => site.siteUrl || '').filter(Boolean) || [];
    } catch (error) {
      console.error('Error fetching user sites:', error);
      return [];
    }
  }

  async getSearchConsoleData(startDate: string, endDate: string): Promise<GoogleSearchConsoleData> {
    try {
      const sites = await this.getUserSites();
      
      if (sites.length === 0) {
        return {
          clicks: 0,
          impressions: 0,
          ctr: 0,
          position: 0,
          queries: [],
        };
      }

      // Use the first available site
      const siteUrl = sites[0];
      const searchconsole = google.searchconsole({ version: 'v1', auth: this.oauth2Client });
      
      const response = await searchconsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 10,
        },
      });

      const rows = response.data.rows || [];
      const totalClicks = rows.reduce((sum, row) => sum + (row.clicks || 0), 0);
      const totalImpressions = rows.reduce((sum, row) => sum + (row.impressions || 0), 0);
      const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const avgPosition = rows.length > 0 
        ? rows.reduce((sum, row) => sum + (row.position || 0), 0) / rows.length 
        : 0;

      return {
        clicks: totalClicks,
        impressions: totalImpressions,
        ctr: avgCtr,
        position: avgPosition,
        queries: rows.map(row => ({
          query: row.keys?.[0] || '',
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: ((row.clicks || 0) / (row.impressions || 1)) * 100,
          position: row.position || 0,
        })),
      };
    } catch (error) {
      console.error('Error fetching Google Search Console data:', error);
      // Return empty data instead of throwing
      return {
        clicks: 0,
        impressions: 0,
        ctr: 0,
        position: 0,
        queries: [],
      };
    }
  }

  async getMyBusinessData(accountId: string, locationId: string, startDate: string, endDate: string): Promise<GoogleMyBusinessData> {
    try {
      const mybusiness = google.mybusinessbusinessinformation({ version: 'v1', auth: this.oauth2Client });
      
      // Note: The My Business API has been deprecated and replaced with Business Profile API
      // This is a simplified implementation - you may need to use the Business Profile API instead
      
      return {
        views: 0,
        searches: 0,
        actions: 0,
        callClicks: 0,
        directionRequests: 0,
        websiteClicks: 0,
      };
    } catch (error) {
      console.error('Error fetching Google My Business data:', error);
      throw new Error('Failed to fetch Google My Business data');
    }
  }

  async refreshTokens(refreshToken: string): Promise<GoogleTokens> {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      return {
        access_token: credentials.access_token!,
        refresh_token: credentials.refresh_token || refreshToken,
        scope: credentials.scope || '',
        token_type: credentials.token_type || 'Bearer',
        expiry_date: credentials.expiry_date || undefined,
      };
    } catch (error) {
      console.error('Error refreshing Google tokens:', error);
      throw new Error('Failed to refresh Google tokens');
    }
  }

  async getAccountInfo(): Promise<{ id: string; email: string; name: string }> {
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const response = await oauth2.userinfo.get();
      
      return {
        id: response.data.id || '',
        email: response.data.email || '',
        name: response.data.name || '',
      };
    } catch (error) {
      console.error('Error fetching Google account info:', error);
      throw new Error('Failed to fetch Google account info');
    }
  }
}

export const googleApiService = new GoogleApiService();