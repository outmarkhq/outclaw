import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ── Users ──────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("passwordHash"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Workspaces ─────────────────────────────────────────────────────────
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  ownerId: int("ownerId").notNull(),
  status: mysqlEnum("status", ["provisioning", "active", "suspended", "archived"])
    .default("provisioning")
    .notNull(),
  plan: mysqlEnum("plan", ["free", "starter", "pro", "enterprise"])
    .default("free")
    .notNull(),
  // LLM configuration (Portkey)
  llmProvider: varchar("llmProvider", { length: 64 }),
  llmModel: varchar("llmModel", { length: 128 }),
  llmApiKeyEncrypted: text("llmApiKeyEncrypted"),
  llmBaseUrl: text("llmBaseUrl"),
  portkeyVirtualKey: varchar("portkeyVirtualKey", { length: 255 }),
  // Channel configuration
  telegramBotToken: text("telegramBotToken"),
  telegramEnabled: boolean("telegramEnabled").default(false).notNull(),
  slackBotToken: text("slackBotToken"),
  slackEnabled: boolean("slackEnabled").default(false).notNull(),
  whatsappToken: text("whatsappToken"),
  whatsappEnabled: boolean("whatsappEnabled").default(false).notNull(),
  // Usage tracking
  monthlyTokensUsed: bigint("monthlyTokensUsed", { mode: "number" }).default(0).notNull(),
  monthlyTokenLimit: bigint("monthlyTokenLimit", { mode: "number" }).default(1000000).notNull(),
  totalCostCents: int("totalCostCents").default(0).notNull(),
  // Metadata
  onboardingStep: int("onboardingStep").default(0).notNull(),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  settings: json("settings"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

// ── Workspace Members ──────────────────────────────────────────────────
export const workspaceMembers = mysqlTable("workspace_members", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  invitedBy: int("invitedBy"),
  inviteEmail: varchar("inviteEmail", { length: 320 }),
  inviteToken: varchar("inviteToken", { length: 128 }),
  inviteAccepted: boolean("inviteAccepted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

// ── Agents ─────────────────────────────────────────────────────────────
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  agentId: varchar("agentId", { length: 128 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  tier: mysqlEnum("tier", ["leader", "coordinator", "specialist"]).default("specialist").notNull(),
  subFunction: varchar("subFunction", { length: 128 }),
  status: mysqlEnum("status", ["active", "idle", "error", "offline"]).default("idle").notNull(),
  model: varchar("model", { length: 128 }),
  lastHeartbeat: timestamp("lastHeartbeat"),
  totalTasksCompleted: int("totalTasksCompleted").default(0).notNull(),
  totalTokensUsed: bigint("totalTokensUsed", { mode: "number" }).default(0).notNull(),
  config: json("config"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

// ── Tasks ──────────────────────────────────────────────────────────────
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  // GACCS structured brief fields
  gaccsGoals: text("gaccsGoals"),
  gaccsAudience: text("gaccsAudience"),
  gaccsCreative: text("gaccsCreative"),
  gaccsChannels: text("gaccsChannels"),
  gaccsStakeholders: text("gaccsStakeholders"),
  // Orchestration
  status: mysqlEnum("status", ["inbox", "assigned", "active", "review", "waiting", "blocked", "done", "archived"])
    .default("inbox")
    .notNull(),
  priority: mysqlEnum("priority", ["urgent", "high", "normal", "low"]).default("normal").notNull(),
  assignedAgentId: int("assignedAgentId"),
  routedByAgentId: int("routedByAgentId"),         // CMA that routed this task
  reviewingAgentId: int("reviewingAgentId"),        // Agent currently reviewing
  subFunction: varchar("subFunction", { length: 128 }),  // Which sub-function owns this
  orchestrationStage: mysqlEnum("orchestrationStage", [
    "cma_review",       // CMA is analyzing the brief
    "lead_assignment",  // Sub-function lead is decomposing
    "specialist_work",  // Specialist is executing
    "lead_review",      // Lead reviewing specialist output
    "cma_approval",     // CMA final approval
    "human_review",     // Back to human for sign-off
    "completed",        // Done
  ]).default("cma_review"),
  cmaFeedback: text("cmaFeedback"),                // CMA's routing notes / enrichment
  leadFeedback: text("leadFeedback"),               // Function lead's review notes
  createdByUserId: int("createdByUserId"),
  source: mysqlEnum("source", ["form", "telegram", "slack", "whatsapp", "api"]).default("form").notNull(),
  tags: json("tags"),
  result: text("result"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

// ── Audit Log ──────────────────────────────────────────────────────────
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId"),
  userId: int("userId"),
  action: varchar("action", { length: 128 }).notNull(),
  resource: varchar("resource", { length: 128 }),
  resourceId: varchar("resourceId", { length: 128 }),
  details: json("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;
export type InsertAuditLogEntry = typeof auditLog.$inferInsert;

// ── Chat Messages ────────────────────────────────────────────────────────────
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  agentId: varchar("agentId", { length: 128 }),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// ── Cron Jobs ────────────────────────────────────────────────────────────────
export const cronJobs = mysqlTable("cron_jobs", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  cronExpression: varchar("cronExpression", { length: 128 }).notNull(),
  taskTemplate: json("taskTemplate"),
  agentId: varchar("agentId", { length: 128 }),
  enabled: boolean("enabled").default(true).notNull(),
  lastRunAt: timestamp("lastRunAt"),
  nextRunAt: timestamp("nextRunAt"),
  runCount: int("runCount").default(0).notNull(),
  status: mysqlEnum("status", ["active", "paused", "error"]).default("active").notNull(),
  createdByUserId: int("createdByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CronJob = typeof cronJobs.$inferSelect;
export type InsertCronJob = typeof cronJobs.$inferInsert;

// ── Password Reset Tokens ────────────────────────────────────────────────────
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;
