import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateOAuthUrl } from "./services/oauth";

export function registerRoutes(app: Express): Server {
  // Setup authentication
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Workspace routes
  app.get('/api/workspaces', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      let workspaces = await storage.getWorkspacesByUserId(userId);
      
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

  app.get('/api/workspaces/:workspaceId/connections', requireAuth, async (req: any, res) => {
    try {
      const workspaceId = req.params.workspaceId;
      const connections = await storage.getPlatformConnections(workspaceId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  // OAuth routes
  app.post('/api/oauth/:platform/init', requireAuth, async (req: any, res) => {
    try {
      const { platform } = req.params;
      const { workspaceId } = req.body;
      
      if (!workspaceId) {
        return res.status(400).json({ message: "Workspace ID is required" });
      }
      
      const authUrl = generateOAuthUrl(platform, workspaceId);
      res.json({ authUrl });
    } catch (error) {
      console.error(`Error initiating ${req.params.platform} OAuth:`, error);
      res.status(500).json({ message: "Failed to initiate OAuth connection" });
    }
  });

  app.get('/api/oauth/callback', async (req, res) => {
    try {
      const { code, state: workspaceId, error } = req.query;
      
      if (error) {
        return res.redirect(`/connections?error=${encodeURIComponent(error)}`);
      }
      
      if (!code || !workspaceId) {
        return res.redirect('/connections?error=missing_parameters');
      }
      
      // TODO: Handle OAuth token exchange and store connection
      // For now, redirect back to connections page
      res.redirect('/connections?success=connected');
    } catch (err) {
      console.error("OAuth callback error:", err);
      res.redirect('/connections?error=callback_failed');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}