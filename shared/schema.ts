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

  // Blockchain verification (Phase 4)
  blockchainHash: text("blockchain_hash"),
  blockchainTransactionId: text("blockchain_transaction_id"),
  blockchainTimestamp: timestamp("blockchain_timestamp"),
  blockchainNetwork: text("blockchain_network"), // mainnet, testnet, previewnet
  blockchainExplorerUrl: text("blockchain_explorer_url"),
  verificationStatus: text("verification_status").default("unverified"), // unverified, pending, verified, certified

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

// Suppliers table for supplier coordination
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  name: text("name").notNull(),
  role: text("role").notNull(), // caterer, venue, av_company, staging, transportation, accommodation, other
  contactInfo: text("contact_info"),
  identifiedFrom: text("identified_from").default("user_mentioned"), // user_mentioned, ai_inferred, database_lookup
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Supplier data requests table
export const supplierRequests = pgTable("supplier_requests", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  requestType: jsonb("request_type").notNull(), // Array of data categories needed
  draftMessage: text("draft_message").notNull(),
  status: text("status").default("draft"), // draft, pending_approval, sent, responded, integrated, declined
  sentAt: timestamp("sent_at"),
  responseReceived: timestamp("response_received"),
  responseData: jsonb("response_data"),
  trackingLink: text("tracking_link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendee profiles for gamification
export const attendeeProfiles = pgTable("attendee_profiles", {
  id: serial("id").primaryKey(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  name: text("name"),
  email: text("email"),
  ticketId: text("ticket_id"),
  totalFootprint: decimal("total_footprint", { precision: 10, scale: 6 }), // tCO2e
  rank: integer("rank"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendee choices for tracking
export const attendeeChoices = pgTable("attendee_choices", {
  id: serial("id").primaryKey(),
  attendeeId: integer("attendee_id").references(() => attendeeProfiles.id),
  category: text("category").notNull(), // transportation, food, accommodation, waste, merchandise
  choice: text("choice").notNull(),
  emissions: decimal("emissions", { precision: 10, scale: 6 }), // tCO2e
  comparedToAverage: decimal("compared_to_average", { precision: 5, scale: 2 }), // percentage
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendee achievements
export const attendeeAchievements = pgTable("attendee_achievements", {
  id: serial("id").primaryKey(),
  attendeeId: integer("attendee_id").references(() => attendeeProfiles.id),
  type: text("type").notNull(), // low_impact_travel, plant_based, zero_waste, etc.
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  footprintReduction: decimal("footprint_reduction", { precision: 10, scale: 6 }),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Attendee rewards
export const attendeeRewards = pgTable("attendee_rewards", {
  id: serial("id").primaryKey(),
  attendeeId: integer("attendee_id").references(() => attendeeProfiles.id),
  type: text("type").notNull(), // discount, upgrade, merchandise, access, recognition
  title: text("title").notNull(),
  description: text("description"),
  value: decimal("value", { precision: 10, scale: 2 }),
  code: text("code"),
  expiresAt: timestamp("expires_at"),
  redeemed: boolean("redeemed").default(false),
  redeemedAt: timestamp("redeemed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blockchain records for verification
export const blockchainRecords = pgTable("blockchain_records", {
  id: serial("id").primaryKey(),
  recordId: text("record_id").notNull().unique(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  recordType: text("record_type").notNull(), // calculation, reduction, verification, offset, attendee_aggregate
  dataHash: text("data_hash").notNull(),
  transactionId: text("transaction_id"),
  consensusTimestamp: text("consensus_timestamp"),
  topicSequenceNumber: integer("topic_sequence_number"),
  explorerUrl: text("explorer_url"),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit logs for compliance
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  logId: text("log_id").notNull().unique(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  action: text("action").notNull(),
  actor: text("actor").notNull(),
  changes: jsonb("changes"),
  hash: text("hash").notNull(),
  previousHash: text("previous_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Carbon certificates
export const carbonCertificates = pgTable("carbon_certificates", {
  id: serial("id").primaryKey(),
  certificateId: text("certificate_id").notNull().unique(),
  calculationId: integer("calculation_id").references(() => carbonCalculations.id),
  eventName: text("event_name").notNull(),
  organizationName: text("organization_name").notNull(),
  totalEmissions: decimal("total_emissions", { precision: 10, scale: 3 }),
  emissionBreakdown: jsonb("emission_breakdown"),
  verificationStatus: text("verification_status").default("unverified"), // unverified, pending, verified, certified
  blockchainHash: text("blockchain_hash").notNull(),
  blockchainTimestamp: timestamp("blockchain_timestamp").notNull(),
  certificateUrl: text("certificate_url"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Saved Events for tracking over time
export const savedEvents = pgTable("saved_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventName: text("event_name").notNull(),
  eventType: text("event_type").notNull(), // festival, conference, wedding, concert, etc.
  eventYear: integer("event_year").notNull(),
  eventDate: timestamp("event_date"),
  attendance: integer("attendance").notNull(),
  location: text("location"),

  // Form data stored as JSON for flexibility
  formData: jsonb("form_data").notNull(),

  // Calculated emissions results
  totalEmissions: decimal("total_emissions", { precision: 10, scale: 3 }),
  transportationEmissions: decimal("transportation_emissions", { precision: 10, scale: 3 }),
  energyEmissions: decimal("energy_emissions", { precision: 10, scale: 3 }),
  cateringEmissions: decimal("catering_emissions", { precision: 10, scale: 3 }),
  wasteEmissions: decimal("waste_emissions", { precision: 10, scale: 3 }),
  productionEmissions: decimal("production_emissions", { precision: 10, scale: 3 }),
  venueEmissions: decimal("venue_emissions", { precision: 10, scale: 3 }),
  emissionsPerAttendee: decimal("emissions_per_attendee", { precision: 10, scale: 6 }),

  // Benchmarking
  industryAverage: decimal("industry_average", { precision: 10, scale: 6 }),
  percentile: integer("percentile"),
  performance: text("performance"), // excellent, good, average, needs improvement, poor

  // Improvements tracking
  notes: text("notes"),
  improvementsImplemented: jsonb("improvements_implemented"), // Array of implemented recommendations

  // Comparison with previous year
  previousEventId: integer("previous_event_id").references(() => savedEvents.id),
  emissionsChange: decimal("emissions_change", { precision: 5, scale: 2 }), // percentage change from previous

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  calculation: one(carbonCalculations, { fields: [suppliers.calculationId], references: [carbonCalculations.id] }),
  requests: many(supplierRequests),
}));

export const supplierRequestsRelations = relations(supplierRequests, ({ one }) => ({
  supplier: one(suppliers, { fields: [supplierRequests.supplierId], references: [suppliers.id] }),
  calculation: one(carbonCalculations, { fields: [supplierRequests.calculationId], references: [carbonCalculations.id] }),
}));

export const attendeeProfilesRelations = relations(attendeeProfiles, ({ one, many }) => ({
  calculation: one(carbonCalculations, { fields: [attendeeProfiles.calculationId], references: [carbonCalculations.id] }),
  choices: many(attendeeChoices),
  achievements: many(attendeeAchievements),
  rewards: many(attendeeRewards),
}));

export const attendeeChoicesRelations = relations(attendeeChoices, ({ one }) => ({
  attendee: one(attendeeProfiles, { fields: [attendeeChoices.attendeeId], references: [attendeeProfiles.id] }),
}));

export const attendeeAchievementsRelations = relations(attendeeAchievements, ({ one }) => ({
  attendee: one(attendeeProfiles, { fields: [attendeeAchievements.attendeeId], references: [attendeeProfiles.id] }),
}));

export const attendeeRewardsRelations = relations(attendeeRewards, ({ one }) => ({
  attendee: one(attendeeProfiles, { fields: [attendeeRewards.attendeeId], references: [attendeeProfiles.id] }),
}));

export const blockchainRecordsRelations = relations(blockchainRecords, ({ one }) => ({
  calculation: one(carbonCalculations, { fields: [blockchainRecords.calculationId], references: [carbonCalculations.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  calculation: one(carbonCalculations, { fields: [auditLogs.calculationId], references: [carbonCalculations.id] }),
}));

export const carbonCertificatesRelations = relations(carbonCertificates, ({ one }) => ({
  calculation: one(carbonCalculations, { fields: [carbonCertificates.calculationId], references: [carbonCalculations.id] }),
}));

export const savedEventsRelations = relations(savedEvents, ({ one }) => ({
  user: one(users, { fields: [savedEvents.userId], references: [users.id] }),
  previousEvent: one(savedEvents, { fields: [savedEvents.previousEventId], references: [savedEvents.id] }),
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

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierRequestSchema = createInsertSchema(supplierRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendeeProfileSchema = createInsertSchema(attendeeProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendeeChoiceSchema = createInsertSchema(attendeeChoices).omit({
  id: true,
  createdAt: true,
});

export const insertAttendeeAchievementSchema = createInsertSchema(attendeeAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertAttendeeRewardSchema = createInsertSchema(attendeeRewards).omit({
  id: true,
  createdAt: true,
});

export const insertBlockchainRecordSchema = createInsertSchema(blockchainRecords).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertCarbonCertificateSchema = createInsertSchema(carbonCertificates).omit({
  id: true,
  createdAt: true,
});

export const insertSavedEventSchema = createInsertSchema(savedEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type SupplierRequest = typeof supplierRequests.$inferSelect;
export type InsertSupplierRequest = z.infer<typeof insertSupplierRequestSchema>;

export type AttendeeProfile = typeof attendeeProfiles.$inferSelect;
export type InsertAttendeeProfile = z.infer<typeof insertAttendeeProfileSchema>;

export type AttendeeChoice = typeof attendeeChoices.$inferSelect;
export type InsertAttendeeChoice = z.infer<typeof insertAttendeeChoiceSchema>;

export type AttendeeAchievement = typeof attendeeAchievements.$inferSelect;
export type InsertAttendeeAchievement = z.infer<typeof insertAttendeeAchievementSchema>;

export type AttendeeReward = typeof attendeeRewards.$inferSelect;
export type InsertAttendeeReward = z.infer<typeof insertAttendeeRewardSchema>;

export type BlockchainRecord = typeof blockchainRecords.$inferSelect;
export type InsertBlockchainRecord = z.infer<typeof insertBlockchainRecordSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export type CarbonCertificate = typeof carbonCertificates.$inferSelect;
export type InsertCarbonCertificate = z.infer<typeof insertCarbonCertificateSchema>;

export type SavedEvent = typeof savedEvents.$inferSelect;
export type InsertSavedEvent = z.infer<typeof insertSavedEventSchema>;
