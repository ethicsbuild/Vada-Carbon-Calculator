import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // corporate, government, ngo, university, event
  size: text("size").notNull(), // 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+
  industry: text("industry").notNull(),
  country: text("country"),
  website: text("website"),
  description: text("description"),
  ownerId: integer("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Carbon calculations table
export const carbonCalculations = pgTable("carbon_calculations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  userId: integer("user_id").references(() => users.id),
  reportingYear: integer("reporting_year").notNull(),
  calculationMethod: text("calculation_method").notNull(), // guided, estimation, detailed
  status: text("status").default("in_progress"), // in_progress, completed, verified
  
  // Emission scopes data
  scope1Data: jsonb("scope1_data"),
  scope2Data: jsonb("scope2_data"),
  scope3Data: jsonb("scope3_data"),
  
  // Calculated results (in tCO2e)
  scope1Emissions: decimal("scope1_emissions", { precision: 10, scale: 3 }),
  scope2Emissions: decimal("scope2_emissions", { precision: 10, scale: 3 }),
  scope3Emissions: decimal("scope3_emissions", { precision: 10, scale: 3 }),
  totalEmissions: decimal("total_emissions", { precision: 10, scale: 3 }),
  
  // Metadata
  ghgProtocolVersion: text("ghg_protocol_version").default("2025"),
  calculatedAt: timestamp("calculated_at"),
  verifiedAt: timestamp("verified_at"),
  blockchainHash: text("blockchain_hash"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI conversation sessions
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  sessionId: text("session_id").notNull(),
  messages: jsonb("messages").notNull(), // Array of conversation messages
  context: jsonb("context"), // AI context and memory
  status: text("status").default("active"), // active, completed, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Carbon reports
export const carbonReports = pgTable("carbon_reports", {
  id: serial("id").primaryKey(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // ghg_protocol, carbon_receipt, custom
  format: text("format").notNull(), // pdf, csv, json
  title: text("title").notNull(),
  content: jsonb("content"), // Report data and structure
  filePath: text("file_path"), // Path to generated file
  isBlockchainVerified: boolean("is_blockchain_verified").default(false),
  blockchainHash: text("blockchain_hash"),
  generatedAt: timestamp("generated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements and gamification
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  achievementType: text("achievement_type").notNull(), // first_calculation, scope3_master, trend_tracker, etc.
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Emission factors and reference data
export const emissionFactors = pgTable("emission_factors", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // energy, transport, waste, etc.
  subcategory: text("subcategory"),
  activity: text("activity").notNull(),
  unit: text("unit").notNull(), // kWh, km, kg, etc.
  factor: decimal("factor", { precision: 10, scale: 6 }).notNull(), // CO2e factor
  source: text("source").notNull(),
  region: text("region"),
  year: integer("year").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, { fields: [organizations.ownerId], references: [users.id] }),
  calculations: many(carbonCalculations),
}));

export const carbonCalculationsRelations = relations(carbonCalculations, ({ one, many }) => ({
  organization: one(organizations, { fields: [carbonCalculations.organizationId], references: [organizations.id] }),
  user: one(users, { fields: [carbonCalculations.userId], references: [users.id] }),
  conversations: many(aiConversations),
  reports: many(carbonReports),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one }) => ({
  user: one(users, { fields: [aiConversations.userId], references: [users.id] }),
  calculation: one(carbonCalculations, { fields: [aiConversations.calculationId], references: [carbonCalculations.id] }),
}));

export const carbonReportsRelations = relations(carbonReports, ({ one }) => ({
  calculation: one(carbonCalculations, { fields: [carbonReports.calculationId], references: [carbonCalculations.id] }),
  user: one(users, { fields: [carbonReports.userId], references: [users.id] }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, { fields: [userAchievements.userId], references: [users.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarbonCalculationSchema = createInsertSchema(carbonCalculations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  calculatedAt: true,
  verifiedAt: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCarbonReportSchema = createInsertSchema(carbonReports).omit({
  id: true,
  createdAt: true,
  generatedAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  createdAt: true,
  unlockedAt: true,
});

export const insertEmissionFactorSchema = createInsertSchema(emissionFactors).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;

export type CarbonCalculation = typeof carbonCalculations.$inferSelect;
export type InsertCarbonCalculation = z.infer<typeof insertCarbonCalculationSchema>;

export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;

export type CarbonReport = typeof carbonReports.$inferSelect;
export type InsertCarbonReport = z.infer<typeof insertCarbonReportSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type EmissionFactor = typeof emissionFactors.$inferSelect;
export type InsertEmissionFactor = z.infer<typeof insertEmissionFactorSchema>;
