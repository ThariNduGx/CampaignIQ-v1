import {
  users,
  workspaces,
  campaigns,
  campaignMetrics,
  aiInsights,
  platformConnections,
  type User,
  type InsertUser,
  type Workspace,
  type InsertWorkspace,
  type Campaign,
  type InsertCampaign,
  type CampaignMetrics,
  type InsertCampaignMetrics,
  type AiInsight,
  type InsertAiInsight,  
  type PlatformConnection,
  type InsertPlatformConnection,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Workspace operations
  getWorkspacesByUserId(userId: string): Promise<Workspace[]>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getWorkspace(id: string): Promise<Workspace | undefined>;

  // Campaign operations
  getCampaignsByWorkspace(workspaceId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  // Metrics operations
  getMetricsByWorkspace(workspaceId: string): Promise<CampaignMetrics[]>;
  createMetric(metric: InsertCampaignMetrics): Promise<CampaignMetrics>;

  // AI Insights operations
  getInsightsByWorkspace(workspaceId: string): Promise<AiInsight[]>;
  createInsight(insight: InsertAiInsight): Promise<AiInsight>;

  // Connection operations
  getConnectionsByWorkspace(workspaceId: string): Promise<PlatformConnection[]>;
  createConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Workspace operations
  async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
    return await db.select().from(workspaces).where(eq(workspaces.userId, userId));
  }

  async createWorkspace(workspaceData: InsertWorkspace): Promise<Workspace> {
    const [workspace] = await db
      .insert(workspaces)
      .values(workspaceData)
      .returning();
    return workspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace;
  }

  // Campaign operations
  async getCampaignsByWorkspace(workspaceId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.workspaceId, workspaceId));
  }

  async createCampaign(campaignData: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(campaignData)
      .returning();
    return campaign;
  }

  // Metrics operations
  async getMetricsByWorkspace(workspaceId: string): Promise<CampaignMetrics[]> {
    return await db
      .select()
      .from(campaignMetrics)
      .where(eq(campaignMetrics.campaignId, workspaceId))
      .orderBy(desc(campaignMetrics.date));
  }

  async createMetric(metricData: InsertCampaignMetrics): Promise<CampaignMetrics> {
    const [metric] = await db
      .insert(campaignMetrics)
      .values(metricData)
      .returning();
    return metric;
  }

  // AI Insights operations
  async getInsightsByWorkspace(workspaceId: string): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.workspaceId, workspaceId))
      .orderBy(desc(aiInsights.createdAt));
  }

  async createInsight(insightData: InsertAiInsight): Promise<AiInsight> {
    const [insight] = await db
      .insert(aiInsights)
      .values(insightData)
      .returning();
    return insight;
  }

  // Connection operations
  async getConnectionsByWorkspace(workspaceId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(eq(platformConnections.workspaceId, workspaceId));
  }

  async createConnection(connectionData: InsertPlatformConnection): Promise<PlatformConnection> {
    const [connection] = await db
      .insert(platformConnections)
      .values(connectionData)
      .returning();
    return connection;
  }
}

export const storage = new DatabaseStorage();