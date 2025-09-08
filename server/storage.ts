import { 
  users, organizations, carbonCalculations, aiConversations, 
  carbonReports, userAchievements, emissionFactors,
  type User, type InsertUser, type Organization, type InsertOrganization,
  type CarbonCalculation, type InsertCarbonCalculation,
  type AiConversation, type InsertAiConversation,
  type CarbonReport, type InsertCarbonReport,
  type UserAchievement, type InsertUserAchievement,
  type EmissionFactor, type InsertEmissionFactor
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  // Organization operations
  getOrganization(id: number): Promise<Organization | undefined>;
  getOrganizationsByOwner(ownerId: number): Promise<Organization[]>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: number, org: Partial<InsertOrganization>): Promise<Organization>;

  // Carbon calculation operations
  getCarbonCalculation(id: number): Promise<CarbonCalculation | undefined>;
  getCarbonCalculationsByOrganization(orgId: number): Promise<CarbonCalculation[]>;
  getCarbonCalculationsByUser(userId: number): Promise<CarbonCalculation[]>;
  createCarbonCalculation(calc: InsertCarbonCalculation): Promise<CarbonCalculation>;
  updateCarbonCalculation(id: number, calc: Partial<InsertCarbonCalculation>): Promise<CarbonCalculation>;

  // AI conversation operations
  getAiConversation(id: number): Promise<AiConversation | undefined>;
  getAiConversationBySession(sessionId: string): Promise<AiConversation | undefined>;
  getAiConversationsByUser(userId: number): Promise<AiConversation[]>;
  createAiConversation(conv: InsertAiConversation): Promise<AiConversation>;
  updateAiConversation(id: number, conv: Partial<InsertAiConversation>): Promise<AiConversation>;

  // Report operations
  getCarbonReport(id: number): Promise<CarbonReport | undefined>;
  getCarbonReportsByCalculation(calcId: number): Promise<CarbonReport[]>;
  getCarbonReportsByUser(userId: number): Promise<CarbonReport[]>;
  createCarbonReport(report: InsertCarbonReport): Promise<CarbonReport>;
  updateCarbonReport(id: number, report: Partial<InsertCarbonReport>): Promise<CarbonReport>;

  // Achievement operations
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(achievement: InsertUserAchievement): Promise<UserAchievement>;

  // Emission factor operations
  getEmissionFactors(): Promise<EmissionFactor[]>;
  getEmissionFactorsByCategory(category: string): Promise<EmissionFactor[]>;
  createEmissionFactor(factor: InsertEmissionFactor): Promise<EmissionFactor>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Organization operations
  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org || undefined;
  }

  async getOrganizationsByOwner(ownerId: number): Promise<Organization[]> {
    return await db.select().from(organizations).where(eq(organizations.ownerId, ownerId));
  }

  async createOrganization(insertOrg: InsertOrganization): Promise<Organization> {
    const [org] = await db.insert(organizations).values(insertOrg).returning();
    return org;
  }

  async updateOrganization(id: number, updateData: Partial<InsertOrganization>): Promise<Organization> {
    const [org] = await db
      .update(organizations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  // Carbon calculation operations
  async getCarbonCalculation(id: number): Promise<CarbonCalculation | undefined> {
    const [calc] = await db.select().from(carbonCalculations).where(eq(carbonCalculations.id, id));
    return calc || undefined;
  }

  async getCarbonCalculationsByOrganization(orgId: number): Promise<CarbonCalculation[]> {
    return await db
      .select()
      .from(carbonCalculations)
      .where(eq(carbonCalculations.organizationId, orgId))
      .orderBy(desc(carbonCalculations.createdAt));
  }

  async getCarbonCalculationsByUser(userId: number): Promise<CarbonCalculation[]> {
    return await db
      .select()
      .from(carbonCalculations)
      .where(eq(carbonCalculations.userId, userId))
      .orderBy(desc(carbonCalculations.createdAt));
  }

  async createCarbonCalculation(insertCalc: InsertCarbonCalculation): Promise<CarbonCalculation> {
    const [calc] = await db.insert(carbonCalculations).values(insertCalc).returning();
    return calc;
  }

  async updateCarbonCalculation(id: number, updateData: Partial<InsertCarbonCalculation>): Promise<CarbonCalculation> {
    const [calc] = await db
      .update(carbonCalculations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(carbonCalculations.id, id))
      .returning();
    return calc;
  }

  // AI conversation operations
  async getAiConversation(id: number): Promise<AiConversation | undefined> {
    const [conv] = await db.select().from(aiConversations).where(eq(aiConversations.id, id));
    return conv || undefined;
  }

  async getAiConversationBySession(sessionId: string): Promise<AiConversation | undefined> {
    const [conv] = await db.select().from(aiConversations).where(eq(aiConversations.sessionId, sessionId));
    return conv || undefined;
  }

  async getAiConversationsByUser(userId: number): Promise<AiConversation[]> {
    return await db
      .select()
      .from(aiConversations)
      .where(eq(aiConversations.userId, userId))
      .orderBy(desc(aiConversations.createdAt));
  }

  async createAiConversation(insertConv: InsertAiConversation): Promise<AiConversation> {
    const [conv] = await db.insert(aiConversations).values(insertConv).returning();
    return conv;
  }

  async updateAiConversation(id: number, updateData: Partial<InsertAiConversation>): Promise<AiConversation> {
    const [conv] = await db
      .update(aiConversations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(aiConversations.id, id))
      .returning();
    return conv;
  }

  // Report operations
  async getCarbonReport(id: number): Promise<CarbonReport | undefined> {
    const [report] = await db.select().from(carbonReports).where(eq(carbonReports.id, id));
    return report || undefined;
  }

  async getCarbonReportsByCalculation(calcId: number): Promise<CarbonReport[]> {
    return await db
      .select()
      .from(carbonReports)
      .where(eq(carbonReports.calculationId, calcId))
      .orderBy(desc(carbonReports.createdAt));
  }

  async getCarbonReportsByUser(userId: number): Promise<CarbonReport[]> {
    return await db
      .select()
      .from(carbonReports)
      .where(eq(carbonReports.userId, userId))
      .orderBy(desc(carbonReports.createdAt));
  }

  async createCarbonReport(insertReport: InsertCarbonReport): Promise<CarbonReport> {
    const [report] = await db.insert(carbonReports).values(insertReport).returning();
    return report;
  }

  async updateCarbonReport(id: number, updateData: Partial<InsertCarbonReport>): Promise<CarbonReport> {
    const [report] = await db
      .update(carbonReports)
      .set(updateData)
      .where(eq(carbonReports.id, id))
      .returning();
    return report;
  }

  // Achievement operations
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async createUserAchievement(insertAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [achievement] = await db.insert(userAchievements).values(insertAchievement).returning();
    return achievement;
  }

  // Emission factor operations
  async getEmissionFactors(): Promise<EmissionFactor[]> {
    return await db.select().from(emissionFactors).where(eq(emissionFactors.isActive, true));
  }

  async getEmissionFactorsByCategory(category: string): Promise<EmissionFactor[]> {
    return await db
      .select()
      .from(emissionFactors)
      .where(and(eq(emissionFactors.category, category), eq(emissionFactors.isActive, true)));
  }

  async createEmissionFactor(insertFactor: InsertEmissionFactor): Promise<EmissionFactor> {
    const [factor] = await db.insert(emissionFactors).values(insertFactor).returning();
    return factor;
  }
}

export const storage = new DatabaseStorage();
