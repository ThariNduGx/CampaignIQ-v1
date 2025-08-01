export function generateOAuthUrl(platform: string, workspaceId: string): string {
  const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
  let redirectUri: string;
  
  if (domains.length > 0) {
    redirectUri = `https://${domains[0]}/api/oauth/callback`;
  } else {
    // Fallback for development
    redirectUri = `http://localhost:5000/api/oauth/callback`;
  }
  
  if (platform === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/adwords',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');
    
    const params = new URLSearchParams({
      client_id: clientId || '',
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      state: `${workspaceId}`,
      access_type: 'offline',
      prompt: 'consent'
    });
    
    return `https://accounts.google.com/o/oauth2/auth?${params}`;
  }
  
  if (platform === 'meta') {
    const clientId = process.env.META_APP_ID;
    const scopes = ['ads_read', 'ads_management'].join(',');
    
    const params = new URLSearchParams({
      client_id: clientId || '',
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      state: `${workspaceId}`
    });
    
    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }
  
  throw new Error(`Unsupported platform: ${platform}`);
}

export async function exchangeCodeForTokens(platform: string, code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  accountId: string;
  accountName: string;
}> {
  const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
  let redirectUri: string;
  
  if (domains.length > 0) {
    redirectUri = `https://${domains[0]}/api/oauth/callback`;
  } else {
    // Fallback for development
    redirectUri = `http://localhost:5000/api/oauth/callback`;
  }
  
  if (platform === 'google') {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    const userInfo = await userResponse.json();
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      accountId: userInfo.id,
      accountName: userInfo.email,
    };
  }
  
  if (platform === 'meta') {
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.META_APP_ID || '',
        client_secret: process.env.META_APP_SECRET || '',
        code,
        redirect_uri: redirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }
    
    const tokens = await tokenResponse.json();
    
    // Get user info
    const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${tokens.access_token}`);
    const userInfo = await userResponse.json();
    
    return {
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in || 3600,
      accountId: userInfo.id,
      accountName: userInfo.name,
    };
  }
  
  throw new Error(`Unsupported platform: ${platform}`);
}
