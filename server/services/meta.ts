import { storage } from "../storage";

interface MetaTokens {
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}

interface MetaAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
}

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  updated_time: string;
}

interface MetaAdInsights {
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  ctr: string;
  cpc: string;
  cpm: string;
  frequency: string;
  date_start: string;
  date_stop: string;
}

export async function exchangeCodeForTokens(code: string): Promise<MetaTokens> {
  const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
  const redirectUri = domains.length > 0 
    ? `https://${domains[0]}/api/oauth/callback`
    : 'http://localhost:5000/api/oauth/callback';

  const tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    redirect_uri: redirectUri,
    code: code,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for tokens: ${errorText}`);
  }

  const data = await response.json();
  
  // Exchange for long-lived token
  const longLivedTokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
  const longLivedParams = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.META_APP_ID!,
    client_secret: process.env.META_APP_SECRET!,
    fb_exchange_token: data.access_token,
  });

  const longLivedResponse = await fetch(longLivedTokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: longLivedParams,
  });

  if (!longLivedResponse.ok) {
    const errorText = await longLivedResponse.text();
    console.warn(`Failed to get long-lived token: ${errorText}`);
    // Use short-lived token as fallback
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in || 3600,
    };
  }

  const longLivedData = await longLivedResponse.json();
  return {
    accessToken: longLivedData.access_token,
    expiresIn: longLivedData.expires_in || 5184000, // 60 days default
  };
}

export async function getMetaAdAccounts(workspaceId: string): Promise<MetaAccount[]> {
  const connection = await storage.getConnection(workspaceId, 'meta');
  if (!connection) {
    throw new Error('Meta connection not found');
  }

  console.log('Fetching Meta ad accounts...');
  
  try {
    const url = `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_status,currency,timezone_name&access_token=${connection.accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Meta API Error:', errorText);
      throw new Error(`Meta API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Meta ad accounts fetched successfully:', data.data?.length || 0, 'accounts');
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Meta ad accounts:', error);
    throw error;
  }
}

export async function getMetaCampaigns(workspaceId: string, accountId?: string): Promise<MetaCampaign[]> {
  const connection = await storage.getConnection(workspaceId, 'meta');
  if (!connection) {
    throw new Error('Meta connection not found');
  }

  console.log('Fetching Meta campaigns for account:', accountId);
  
  try {
    // If no specific account, get campaigns from all accounts
    if (!accountId) {
      const accounts = await getMetaAdAccounts(workspaceId);
      const allCampaigns: MetaCampaign[] = [];
      
      for (const account of accounts.slice(0, 3)) { // Limit to first 3 accounts to avoid rate limits
        try {
          const accountCampaigns = await getMetaCampaigns(workspaceId, account.id);
          allCampaigns.push(...accountCampaigns);
        } catch (error) {
          console.warn(`Failed to fetch campaigns for account ${account.id}:`, error);
        }
      }
      
      return allCampaigns;
    }

    const url = `https://graph.facebook.com/v18.0/${accountId}/campaigns?fields=id,name,status,objective,created_time,updated_time&access_token=${connection.accessToken}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Meta Campaigns API Error:', errorText);
      throw new Error(`Meta API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Meta campaigns fetched successfully:', data.data?.length || 0, 'campaigns');
    
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Meta campaigns:', error);
    throw error;
  }
}

export async function getMetaAdInsights(
  workspaceId: string, 
  accountId?: string,
  startDate?: string,
  endDate?: string
): Promise<any> {
  const connection = await storage.getConnection(workspaceId, 'meta');
  if (!connection) {
    throw new Error('Meta connection not found');
  }

  console.log('Fetching Meta ad insights...');
  
  try {
    // Default date range (last 30 days)
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let insights: MetaAdInsights[] = [];

    if (accountId) {
      // Get insights for specific account
      const url = `https://graph.facebook.com/v18.0/${accountId}/insights?fields=impressions,clicks,spend,reach,ctr,cpc,cpm,frequency&time_range={"since":"${start}","until":"${end}"}&access_token=${connection.accessToken}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        insights = data.data || [];
      }
    } else {
      // Get insights from all accounts
      const accounts = await getMetaAdAccounts(workspaceId);
      
      for (const account of accounts.slice(0, 3)) { // Limit to avoid rate limits
        try {
          const accountInsights = await getMetaAdInsights(workspaceId, account.id, startDate, endDate);
          if (accountInsights.impressions) {
            insights.push(accountInsights);
          }
        } catch (error) {
          console.warn(`Failed to fetch insights for account ${account.id}:`, error);
        }
      }
    }

    // Aggregate insights
    const aggregated = insights.reduce((acc, insight) => ({
      impressions: acc.impressions + parseInt(insight.impressions || '0'),
      clicks: acc.clicks + parseInt(insight.clicks || '0'),
      spend: acc.spend + parseFloat(insight.spend || '0'),
      reach: Math.max(acc.reach, parseInt(insight.reach || '0')), // Use max reach, not sum
      ctr: 0, // Will calculate after
      cpc: 0, // Will calculate after
      cpm: 0, // Will calculate after
      frequency: acc.frequency + parseFloat(insight.frequency || '0')
    }), {
      impressions: 0,
      clicks: 0,
      spend: 0,
      reach: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      frequency: 0
    });

    // Calculate derived metrics
    if (aggregated.impressions > 0) {
      aggregated.ctr = (aggregated.clicks / aggregated.impressions) * 100;
      aggregated.cpm = (aggregated.spend / aggregated.impressions) * 1000;
    }
    if (aggregated.clicks > 0) {
      aggregated.cpc = aggregated.spend / aggregated.clicks;
    }

    console.log('Meta insights aggregated:', aggregated);
    
    return aggregated;
  } catch (error) {
    console.error('Error fetching Meta ad insights:', error);
    // Return empty data instead of throwing
    return {
      impressions: 0,
      clicks: 0,
      spend: 0,
      reach: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      frequency: 0
    };
  }
}

export async function getUserInfo(accessToken: string): Promise<{ id: string; name: string; email?: string }> {
  const url = `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get user info: ${errorText}`);
  }

  return await response.json();
}