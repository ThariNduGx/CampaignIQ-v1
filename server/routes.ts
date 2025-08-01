import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

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

  // Additional API routes can be added here
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

  const httpServer = createServer(app);
  return httpServer;
}