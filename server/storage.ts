import {
  users,
  workspaces,
  platformConnections,
  campaigns,
  campaignMetrics,
  aiInsights,
  userSettings,
  type User,
  type UpsertUser,
  type Workspace,
  type InsertWorkspace,
  type PlatformConnection,
  type InsertPlatformConnection,
  type Campaign,
  type InsertCampaign,
  type CampaignMetrics,
  type InsertCampaignMetrics,
  type AiInsight,
  type InsertAiInsight,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Workspace operations
  getUserWorkspaces(userId: string): Promise<Workspace[]>;
  createWorkspace(workspace: InsertWorkspace): Promise<Workspace>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  
  // Platform connection operations
  getWorkspacePlatformConnections(workspaceId: string): Promise<PlatformConnection[]>;
  createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection>;
  updatePlatformConnection(id: string, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection>;
  getPlatformConnection(id: string): Promise<PlatformConnection | undefined>;
  getConnection(workspaceId: string, platform: string): Promise<PlatformConnection | undefined>;
  deletePlatformConnection(workspaceId: string, platform: string): Promise<void>;
  
  // Campaign operations
  getWorkspaceCampaigns(workspaceId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaignsByConnection(connectionId: string): Promise<Campaign[]>;
  
  // Campaign metrics operations
  createCampaignMetrics(metrics: InsertCampaignMetrics): Promise<CampaignMetrics>;
  getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date): Promise<CampaignMetrics[]>;
  getWorkspaceMetricsSummary(workspaceId: string, startDate: Date, endDate: Date): Promise<any>;
  
  // AI insights operations
  createAiInsight(insight: InsertAiInsight): Promise<AiInsight>;
  getWorkspaceAiInsights(workspaceId: string, limit?: number): Promise<AiInsight[]>;
  clearWorkspaceAiInsights(workspaceId: string): Promise<void>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Workspace operations
  async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    return await db.select().from(workspaces).where(eq(workspaces.userId, userId)).orderBy(desc(workspaces.createdAt));
  }

  async createWorkspace(workspace: InsertWorkspace): Promise<Workspace> {
    const [newWorkspace] = await db.insert(workspaces).values(workspace).returning();
    return newWorkspace;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return workspace;
  }

  // Platform connection operations
  async getWorkspacePlatformConnections(workspaceId: string): Promise<PlatformConnection[]> {
    return await db
      .select()
      .from(platformConnections)
      .where(and(eq(platformConnections.workspaceId, workspaceId), eq(platformConnections.isActive, true)))
      .orderBy(desc(platformConnections.createdAt));
  }

  async createPlatformConnection(connection: InsertPlatformConnection): Promise<PlatformConnection> {
    const [newConnection] = await db.insert(platformConnections).values(connection).returning();
    return newConnection;
  }

  async updatePlatformConnection(id: string, connection: Partial<InsertPlatformConnection>): Promise<PlatformConnection> {
    const [updatedConnection] = await db
      .update(platformConnections)
      .set({ ...connection, updatedAt: new Date() })
      .where(eq(platformConnections.id, id))
      .returning();
    return updatedConnection;
  }

  async getPlatformConnection(id: string): Promise<PlatformConnection | undefined> {
    const [connection] = await db.select().from(platformConnections).where(eq(platformConnections.id, id));
    return connection;
  }

  async getConnection(workspaceId: string, platform: string): Promise<PlatformConnection | undefined> {
    const [connection] = await db
      .select()
      .from(platformConnections)
      .where(and(
        eq(platformConnections.workspaceId, workspaceId),
        eq(platformConnections.platform, platform),
        eq(platformConnections.isActive, true)
      ));
    return connection;
  }

  async deletePlatformConnection(workspaceId: string, platform: string): Promise<void> {
    await db
      .update(platformConnections)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(
        eq(platformConnections.workspaceId, workspaceId),
        eq(platformConnections.platform, platform)
      ));
  }

  // Campaign operations
  async getWorkspaceCampaigns(workspaceId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.workspaceId, workspaceId)).orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async getCampaignsByConnection(connectionId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.platformConnectionId, connectionId));
  }

  // Campaign metrics operations
  async createCampaignMetrics(metrics: InsertCampaignMetrics): Promise<CampaignMetrics> {
    const [newMetrics] = await db.insert(campaignMetrics).values(metrics).returning();
    return newMetrics;
  }

  async getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date): Promise<CampaignMetrics[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(campaignMetrics)
        .where(and(
          eq(campaignMetrics.campaignId, campaignId),
          gte(campaignMetrics.date, startDate),
          lte(campaignMetrics.date, endDate)
        ))
        .orderBy(desc(campaignMetrics.date));
    }
    
    return await db
      .select()
      .from(campaignMetrics)
      .where(eq(campaignMetrics.campaignId, campaignId))
      .orderBy(desc(campaignMetrics.date));
  }

  async getWorkspaceMetricsSummary(workspaceId: string, startDate: Date, endDate: Date): Promise<any> {
    const result = await db
      .select({
        totalSpend: sql<number>`SUM(${campaignMetrics.spend})`,
        totalConversions: sql<number>`SUM(${campaignMetrics.conversions})`,
        totalImpressions: sql<number>`SUM(${campaignMetrics.impressions})`,
        totalClicks: sql<number>`SUM(${campaignMetrics.clicks})`,
        totalRevenue: sql<number>`SUM(${campaignMetrics.conversionValue})`,
        avgCtr: sql<number>`AVG(${campaignMetrics.ctr})`,
        avgRoas: sql<number>`AVG(${campaignMetrics.roas})`
      })
      .from(campaignMetrics)
      .innerJoin(campaigns, eq(campaignMetrics.campaignId, campaigns.id))
      .where(and(
        eq(campaigns.workspaceId, workspaceId),
        gte(campaignMetrics.date, startDate),
        lte(campaignMetrics.date, endDate)
      ));

    return result[0] || {
      totalSpend: 0,
      totalConversions: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalRevenue: 0,
      avgCtr: 0,
      avgRoas: 0
    };
  }

  // AI insights operations
  async createAiInsight(insight: InsertAiInsight): Promise<AiInsight> {
    const [newInsight] = await db.insert(aiInsights).values(insight).returning();
    return newInsight;
  }

  async getWorkspaceAiInsights(workspaceId: string, limit = 10): Promise<AiInsight[]> {
    return await db
      .select()
      .from(aiInsights)
      .where(eq(aiInsights.workspaceId, workspaceId))
      .orderBy(desc(aiInsights.createdAt))
      .limit(limit);
  }

  async clearWorkspaceAiInsights(workspaceId: string): Promise<void> {
    await db
      .delete(aiInsights)
      .where(eq(aiInsights.workspaceId, workspaceId));
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [upsertedSettings] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          openaiApiKey: settings.openaiApiKey,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedSettings;
  }
}

export const storage = new DatabaseStorage();
