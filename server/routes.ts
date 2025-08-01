import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertWorkspaceSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { generateOAuthUrl, exchangeCodeForTokens } from "./services/oauth";
import { generateAIInsights } from "./services/openai.js";
import { googleApiService } from "./services/google";
import { getMetaAdAccounts, getMetaCampaigns, getMetaAdInsights } from "./services/meta";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Workspace routes
  app.get('/api/workspaces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let workspaces = await storage.getUserWorkspaces(userId);
      
      // Create default workspace if user has none
      if (workspaces.length === 0) {
        const defaultWorkspace = await storage.createWorkspace({
          name: "My Marketing Campaigns",
          userId: userId
        });
        workspaces = [defaultWorkspace];
      }
      
      res.json(workspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      res.status(500).json({ message: "Failed to fetch workspaces" });
    }
  });

  app.post('/api/workspaces', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertWorkspaceSchema.parse({ ...req.body, userId });
      const workspace = await storage.createWorkspace(validatedData);
      res.json(workspace);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      console.error("Error creating workspace:", error);
      res.status(500).json({ message: "Failed to create workspace" });
    }
  });

  app.get('/api/workspaces/:id', isAuthenticated, async (req: any, res) => {
    try {
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }
      res.json(workspace);
    } catch (error) {
      console.error("Error fetching workspace:", error);
      res.status(500).json({ message: "Failed to fetch workspace" });
    }
  });

  // Platform connection routes
  app.get('/api/workspaces/:workspaceId/connections', isAuthenticated, async (req, res) => {
    try {
      const connections = await storage.getWorkspacePlatformConnections(req.params.workspaceId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  // OAuth initiation routes
  app.post('/api/oauth/:platform/init', isAuthenticated, async (req: any, res) => {
    try {
      const { platform } = req.params;
      const { workspaceId } = req.body;
      
      if (!['google', 'meta'].includes(platform)) {
        return res.status(400).json({ message: "Invalid platform" });
      }

      const authUrl = generateOAuthUrl(platform, workspaceId);
      res.json({ authUrl });
    } catch (error) {
      console.error("Error initiating OAuth:", error);
      res.status(500).json({ message: "Failed to initiate OAuth" });
    }
  });

  // OAuth callback route - Updated to handle both Google and Meta callbacks
  app.get('/api/oauth/callback', async (req, res) => {
    try {
      const { code, state, error, error_description } = req.query;
      
      // Handle OAuth errors
      if (error) {
        console.error(`OAuth error: ${error} - ${error_description}`);
        return res.redirect(`/?connection=error&error=${error}`);
      }
      
      if (!code || !state) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      // Determine platform from the referrer URL and state parameter
      const referrer = req.get('Referer') || '';
      let platform = 'google'; // Default to Google
      
      if (referrer.includes('facebook.com') || referrer.includes('meta.com')) {
        platform = 'meta';
      }
      
      console.log(`OAuth callback received for platform: ${platform}, referrer: ${referrer}`);
      
      const tokens = await exchangeCodeForTokens(platform, code as string);
      
      // Store the connection in database
      const connection = await storage.createPlatformConnection({
        workspaceId: state as string,
        platform: platform,
        accountId: tokens.accountId,
        accountName: tokens.accountName,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + tokens.expiresIn * 1000)
      });

      res.redirect(`/?connection=success&platform=${platform}`);
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      res.redirect(`/?connection=error`);
    }
  });

  // Disconnect platform connection
  app.delete('/api/workspaces/:workspaceId/connections/:platform', isAuthenticated, async (req, res) => {
    try {
      const { workspaceId, platform } = req.params;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await storage.deletePlatformConnection(workspaceId, platform);
      res.json({ message: `${platform} connection removed successfully` });
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      res.status(500).json({ message: "Failed to disconnect platform" });
    }
  });

  // Campaign metrics routes
  app.get('/api/workspaces/:workspaceId/metrics/summary', isAuthenticated, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { startDate, endDate } = req.query;
      
      const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate as string) : new Date();
      
      const summary = await storage.getWorkspaceMetricsSummary(workspaceId, start, end);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching metrics summary:", error);
      res.status(500).json({ message: "Failed to fetch metrics summary" });
    }
  });

  app.get('/api/workspaces/:workspaceId/campaigns', isAuthenticated, async (req, res) => {
    try {
      const campaigns = await storage.getWorkspaceCampaigns(req.params.workspaceId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // AI insights routes
  app.post('/api/workspaces/:workspaceId/ai-insights', isAuthenticated, async (req: any, res) => {
    try {
      const { workspaceId } = req.params;
      const { startDate, endDate } = req.body;
      const userId = req.user.claims.sub;
      
      // Get user's OpenAI API key
      const userSettings = await storage.getUserSettings(userId);
      if (!userSettings?.openaiApiKey) {
        return res.status(400).json({ message: "OpenAI API key not configured" });
      }
      
      // Get metrics data for the date range
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();
      const summary = await storage.getWorkspaceMetricsSummary(workspaceId, start, end);
      
      // Generate AI insights
      const insights = await generateAIInsights(summary, userSettings.openaiApiKey);
      
      // Store insights in database
      const savedInsights = await Promise.all(
        insights.map((insight: { title: string; content: string; type: string }) => 
          storage.createAiInsight({
            workspaceId,
            title: insight.title,
            content: insight.content,
            type: insight.type,
            dateRange: { startDate, endDate }
          })
        )
      );
      
      res.json(savedInsights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({ message: "Failed to generate AI insights" });
    }
  });

  app.get('/api/workspaces/:workspaceId/ai-insights', isAuthenticated, async (req, res) => {
    try {
      const insights = await storage.getWorkspaceAiInsights(req.params.workspaceId);
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // User settings routes
  app.get('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.post('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserSettingsSchema.parse({ ...req.body, userId });
      const settings = await storage.upsertUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // Get available Google Analytics properties
  app.get('/api/google/analytics/:workspaceId/properties', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const properties = await googleApiService.getUserProperties();
      res.json(properties);
    } catch (error) {
      console.error('Error fetching Google Analytics properties:', error);
      res.status(500).json({ message: 'Failed to fetch Analytics properties' });
    }
  });

  // Get available Google Search Console sites
  app.get('/api/google/search-console/:workspaceId/sites', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/webmasters.readonly',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const sites = await googleApiService.getUserSites();
      res.json(sites);
    } catch (error) {
      console.error('Error fetching Google Search Console sites:', error);
      res.status(500).json({ message: 'Failed to fetch Search Console sites' });
    }
  });

  // Get available Google My Business accounts
  app.get('/api/google/my-business/:workspaceId/accounts', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/business.manage',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const accounts = await googleApiService.getMyBusinessAccounts();
      res.json(accounts);
    } catch (error) {
      console.error('Error fetching Google My Business accounts:', error);
      res.status(500).json({ message: 'Failed to fetch My Business accounts' });
    }
  });

  // Google Analytics data endpoint
  app.get('/api/google/analytics/:workspaceId', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      const { propertyId, startDate, endDate } = req.query;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get Google connection for this workspace
      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      // Set credentials and fetch data
      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/analytics.readonly',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const analyticsData = await googleApiService.getAnalyticsData(
        startDate as string || '2025-07-02',
        endDate as string || '2025-08-01',
        propertyId as string
      );

      res.json(analyticsData);
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      res.status(500).json({ message: 'Failed to fetch Analytics data' });
    }
  });

  // Google Search Console data endpoint
  app.get('/api/google/search-console/:workspaceId', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      const { siteUrl, startDate, endDate } = req.query;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get Google connection for this workspace
      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      // Set credentials and fetch data
      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/webmasters.readonly',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const searchConsoleData = await googleApiService.getSearchConsoleData(
        startDate as string || '2024-01-01',
        endDate as string || '2024-01-31',
        siteUrl as string
      );

      res.json(searchConsoleData);
    } catch (error) {
      console.error('Error fetching Google Search Console data:', error);
      res.status(500).json({ message: 'Failed to fetch Search Console data' });
    }
  });

  // Google My Business data endpoint
  app.get('/api/google/my-business/:workspaceId', isAuthenticated, async (req, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const userId = (req.user as any)?.claims?.sub;
      const { accountId, locationId, startDate, endDate } = req.query;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get Google connection for this workspace
      const connection = await storage.getConnection(workspaceId, 'google');
      if (!connection) {
        return res.status(404).json({ message: 'Google connection not found' });
      }

      // Set credentials and fetch data
      googleApiService.setCredentials({
        access_token: connection.accessToken,
        refresh_token: connection.refreshToken || undefined,
        scope: 'https://www.googleapis.com/auth/business.manage',
        token_type: 'Bearer',
        expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
      });

      const myBusinessData = await googleApiService.getMyBusinessData(
        accountId as string || '123',
        locationId as string || '456',
        startDate as string || '2024-01-01',
        endDate as string || '2024-01-31'
      );

      res.json(myBusinessData);
    } catch (error) {
      console.error('Error fetching Google My Business data:', error);
      res.status(500).json({ message: 'Failed to fetch My Business data' });
    }
  });

  // Meta (Facebook/Instagram) API routes
  app.get('/api/meta/:workspaceId/accounts', isAuthenticated, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const accounts = await getMetaAdAccounts(workspaceId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching Meta ad accounts:", error);
      res.status(500).json({ message: "Failed to fetch Meta ad accounts" });
    }
  });

  app.get('/api/meta/:workspaceId/campaigns', isAuthenticated, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { accountId } = req.query;
      const campaigns = await getMetaCampaigns(workspaceId, accountId as string);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching Meta campaigns:", error);
      res.status(500).json({ message: "Failed to fetch Meta campaigns" });
    }
  });

  app.get('/api/meta/:workspaceId', isAuthenticated, async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { accountId, startDate, endDate } = req.query;
      
      const insights = await getMetaAdInsights(
        workspaceId, 
        accountId as string,
        startDate as string,
        endDate as string
      );
      
      res.json(insights);
    } catch (error) {
      console.error("Error fetching Meta ad insights:", error);
      res.status(500).json({ message: "Failed to fetch Meta ad insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
