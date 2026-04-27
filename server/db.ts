import { eq, and, desc, sql, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  workspaces,
  InsertWorkspace,
  Workspace,
  workspaceMembers,
  InsertWorkspaceMember,
  agents,
  InsertAgent,
  tasks,
  InsertTask,
  auditLog,
  InsertAuditLogEntry,
  chatMessages,
  InsertChatMessage,
  cronJobs,
  InsertCronJob,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ── Users ──────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(data: {
  email: string;
  passwordHash: string;
  name: string;
  openId: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(users).values({
    openId: data.openId,
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
    loginMethod: "email",
    role: "user",
    lastSignedIn: new Date(),
  }).$returningId();
  return result.id;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ── Workspaces ─────────────────────────────────────────────────────────

export async function createWorkspace(data: InsertWorkspace) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(workspaces).values(data).$returningId();
  return result.id;
}

export async function getWorkspaceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
  return result[0];
}

export async function getWorkspaceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workspaces).where(eq(workspaces.slug, slug)).limit(1);
  return result[0];
}

export async function getWorkspacesForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const memberRows = await db
    .select({ workspaceId: workspaceMembers.workspaceId, role: workspaceMembers.role })
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.userId, userId), eq(workspaceMembers.inviteAccepted, true)));
  if (memberRows.length === 0) return [];
  const wsIds = memberRows.map((r) => r.workspaceId);
  const wsList = await db.select().from(workspaces).where(sql`${workspaces.id} IN (${sql.join(wsIds.map(id => sql`${id}`), sql`, `)})`);
  return wsList.map((ws) => ({
    ...ws,
    memberRole: memberRows.find((m) => m.workspaceId === ws.id)?.role ?? "member",
  }));
}

export async function getAllWorkspaces(search?: string) {
  const db = await getDb();
  if (!db) return [];
  if (search) {
    return db.select().from(workspaces).where(like(workspaces.name, `%${search}%`)).orderBy(desc(workspaces.createdAt));
  }
  return db.select().from(workspaces).orderBy(desc(workspaces.createdAt));
}

export async function updateWorkspace(id: number, data: Partial<InsertWorkspace>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(workspaces).set(data).where(eq(workspaces.id, id));
}

// ── Workspace Members ──────────────────────────────────────────────────

export async function addWorkspaceMember(data: InsertWorkspaceMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(workspaceMembers).values(data);
}

export async function getWorkspaceMembers(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: workspaceMembers.id,
      userId: workspaceMembers.userId,
      role: workspaceMembers.role,
      inviteAccepted: workspaceMembers.inviteAccepted,
      inviteEmail: workspaceMembers.inviteEmail,
      createdAt: workspaceMembers.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(workspaceMembers)
    .leftJoin(users, eq(workspaceMembers.userId, users.id))
    .where(eq(workspaceMembers.workspaceId, workspaceId));
}

export async function getUserWorkspaceMembership(workspaceId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1);
  return result[0];
}

export async function removeWorkspaceMember(workspaceId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .delete(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)));
}

// ── Agents ─────────────────────────────────────────────────────────────

export async function createAgent(data: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(agents).values(data);
}

export async function getAgentsForWorkspace(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(agents).where(eq(agents.workspaceId, workspaceId)).orderBy(agents.tier, agents.name);
}

export async function updateAgent(id: number, data: Partial<InsertAgent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(agents).set(data).where(eq(agents.id, id));
}

export async function bulkCreateAgents(agentList: InsertAgent[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (agentList.length === 0) return;
  await db.insert(agents).values(agentList);
}

// ── Tasks ──────────────────────────────────────────────────────────────

export async function createTask(data: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(tasks).values(data).$returningId();
  return result.id;
}

export async function getTasksForWorkspace(workspaceId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(tasks.workspaceId, workspaceId)];
  if (status) conditions.push(eq(tasks.status, status as any));
  return db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt));
}

export async function updateTask(id: number, data: Partial<InsertTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tasks).set(data).where(eq(tasks.id, id));
}

export async function getTaskById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return result[0];
}

// ── Audit Log ──────────────────────────────────────────────────────────

export async function createAuditEntry(data: InsertAuditLogEntry) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLog).values(data);
}

export async function getAuditLog(workspaceId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(auditLog)
    .where(eq(auditLog.workspaceId, workspaceId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}

// ── Stats (Admin) ──────────────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalWorkspaces: 0, activeWorkspaces: 0, totalTasks: 0 };

  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [wsCount] = await db.select({ count: sql<number>`count(*)` }).from(workspaces);
  const [activeWsCount] = await db.select({ count: sql<number>`count(*)` }).from(workspaces).where(eq(workspaces.status, "active"));
  const [taskCount] = await db.select({ count: sql<number>`count(*)` }).from(tasks);

  return {
    totalUsers: userCount.count,
    totalWorkspaces: wsCount.count,
    activeWorkspaces: activeWsCount.count,
    totalTasks: taskCount.count,
  };
}

// ── Chat Messages ─────────────────────────────────────────────────────

export async function createChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(chatMessages).values(data).$returningId();
  return result.id;
}

export async function getChatMessages(workspaceId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.workspaceId, workspaceId))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

export async function getChatMessagesForUser(workspaceId: number, userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(chatMessages)
    .where(and(eq(chatMessages.workspaceId, workspaceId), eq(chatMessages.userId, userId)))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);
}

// ── Cron Jobs ─────────────────────────────────────────────────────────

export async function createCronJob(data: InsertCronJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(cronJobs).values(data).$returningId();
  return result.id;
}

export async function getCronJobsForWorkspace(workspaceId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(cronJobs)
    .where(eq(cronJobs.workspaceId, workspaceId))
    .orderBy(desc(cronJobs.createdAt));
}

export async function getCronJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cronJobs).where(eq(cronJobs.id, id)).limit(1);
  return result[0];
}

export async function updateCronJob(id: number, data: Partial<InsertCronJob>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(cronJobs).set(data).where(eq(cronJobs.id, id));
}

export async function deleteCronJob(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cronJobs).where(eq(cronJobs.id, id));
}

// ── Password Reset Tokens ─────────────────────────────────────────────

import { passwordResetTokens, InsertPasswordResetToken } from "../drizzle/schema";

export async function createPasswordResetToken(data: InsertPasswordResetToken) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(passwordResetTokens).values(data);
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  return result[0];
}

export async function markTokenUsed(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(eq(passwordResetTokens.token, token));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}
