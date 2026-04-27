import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import * as db from "./db";
import { nanoid } from "nanoid";

// ── Default agent definitions (the 21 MKT1 agents) ────────────────────
const DEFAULT_AGENTS = [
  { agentId: "chief-marketing", name: "Chief Marketing Agent", role: "Routes tasks, enriches context, reviews all output", tier: "leader" as const, subFunction: "Strategy" },
  { agentId: "product-marketing-lead", name: "Product Marketing Lead", role: "Positioning, competitive intel, launches", tier: "leader" as const, subFunction: "Product Marketing" },
  { agentId: "content-brand-lead", name: "Content & Brand Lead", role: "Content strategy, brand voice, creative direction", tier: "leader" as const, subFunction: "Content & Brand" },
  { agentId: "growth-marketing-lead", name: "Growth Marketing Lead", role: "Channel strategy, funnel optimization", tier: "leader" as const, subFunction: "Growth Marketing" },
  { agentId: "campaign-producer", name: "Campaign Producer", role: "Cross-functional orchestration, GACCS briefs", tier: "coordinator" as const, subFunction: "Operations" },
  { agentId: "marketing-ops", name: "Marketing Ops", role: "Data, reporting, attribution, tool integrations", tier: "coordinator" as const, subFunction: "Operations" },
  { agentId: "competitive-intel", name: "Competitive Intel Agent", role: "Monitors competitors, pricing, market shifts", tier: "specialist" as const, subFunction: "Product Marketing" },
  { agentId: "audience-research", name: "Audience Research Agent", role: "ICP/persona research, buyer journey mapping", tier: "specialist" as const, subFunction: "Product Marketing" },
  { agentId: "sales-enablement", name: "Sales Enablement Agent", role: "Battle cards, pitch decks, one-pagers", tier: "specialist" as const, subFunction: "Product Marketing" },
  { agentId: "product-launch", name: "Product Launch Agent", role: "Launch plans, GTM execution", tier: "specialist" as const, subFunction: "Product Marketing" },
  { agentId: "content-writer", name: "Content Writer Agent", role: "Long-form articles, blogs, thought leadership", tier: "specialist" as const, subFunction: "Content & Brand" },
  { agentId: "content-repurposing", name: "Content Repurposing Agent", role: "Turns long-form into social posts, clips", tier: "specialist" as const, subFunction: "Content & Brand" },
  { agentId: "designer", name: "Designer Agent", role: "Brand assets, campaign creative, social graphics", tier: "specialist" as const, subFunction: "Content & Brand" },
  { agentId: "social-media", name: "Social Media Agent", role: "LinkedIn, X, community engagement", tier: "specialist" as const, subFunction: "Content & Brand" },
  { agentId: "pr-comms", name: "PR & Comms Agent", role: "Press releases, media outreach", tier: "specialist" as const, subFunction: "Content & Brand" },
  { agentId: "seo", name: "SEO Agent", role: "Technical SEO, keyword strategy", tier: "specialist" as const, subFunction: "Growth Marketing" },
  { agentId: "paid-media", name: "Paid Media Agent", role: "Ad copy, campaign setup, A/B testing", tier: "specialist" as const, subFunction: "Growth Marketing" },
  { agentId: "lifecycle-email", name: "Lifecycle Email Agent", role: "Sequences, drip campaigns, retention", tier: "specialist" as const, subFunction: "Growth Marketing" },
  { agentId: "social-listening", name: "Social Listening Agent", role: "Monitor mentions, sentiment, conversations", tier: "specialist" as const, subFunction: "Growth Marketing" },
  { agentId: "growth-analyst", name: "Growth Analyst Agent", role: "KPI dashboards, anomaly detection", tier: "specialist" as const, subFunction: "Growth Marketing" },
  { agentId: "ecosystem", name: "Ecosystem Agent", role: "Partner research, co-marketing, customer stories", tier: "specialist" as const, subFunction: "Ecosystem" },
];

// ── Workspace Router ───────────────────────────────────────────────────
const workspaceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.getWorkspacesForUser(ctx.user.id);
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(255), slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.getWorkspaceBySlug(input.slug);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Workspace slug already taken" });

      const wsId = await db.createWorkspace({
        name: input.name,
        slug: input.slug,
        ownerId: ctx.user.id,
        status: "provisioning",
        onboardingStep: 1,
      });

      // Add creator as admin member
      await db.addWorkspaceMember({
        workspaceId: wsId,
        userId: ctx.user.id,
        role: "admin",
        inviteAccepted: true,
      });

      await db.createAuditEntry({
        workspaceId: wsId,
        userId: ctx.user.id,
        action: "workspace.created",
        resource: "workspace",
        resourceId: String(wsId),
      });

      return { id: wsId, slug: input.slug };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.id, ctx.user.id);
      if (!membership && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this workspace" });
      const ws = await db.getWorkspaceById(input.id);
      if (!ws) throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found" });
      return { ...ws, memberRole: membership?.role ?? (ctx.user.role === "admin" ? "admin" : "member") };
    }),

  updateOnboarding: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      step: z.number(),
      data: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const updateData: Record<string, any> = { onboardingStep: input.step };

      // Step 2: LLM config
      if (input.data?.llmProvider) updateData.llmProvider = input.data.llmProvider;
      if (input.data?.llmModel) updateData.llmModel = input.data.llmModel;
      if (input.data?.llmApiKey) updateData.llmApiKeyEncrypted = input.data.llmApiKey; // TODO: encrypt
      if (input.data?.portkeyVirtualKey) updateData.portkeyVirtualKey = input.data.portkeyVirtualKey;

      // Step 3: Channels
      if (input.data?.telegramBotToken !== undefined) {
        updateData.telegramBotToken = input.data.telegramBotToken;
        updateData.telegramEnabled = !!input.data.telegramBotToken;
      }
      if (input.data?.slackBotToken !== undefined) {
        updateData.slackBotToken = input.data.slackBotToken;
        updateData.slackEnabled = !!input.data.slackBotToken;
      }

      // Step 4: Provision complete
      if (input.step >= 4) {
        updateData.onboardingCompleted = true;
        updateData.status = "active";
      }

      await db.updateWorkspace(input.workspaceId, updateData);
      return { success: true };
    }),

  provision: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const ws = await db.getWorkspaceById(input.workspaceId);
      if (!ws) throw new TRPCError({ code: "NOT_FOUND" });

      // Create all 21 default agents for this workspace
      const agentRows = DEFAULT_AGENTS.map((a) => ({
        workspaceId: input.workspaceId,
        agentId: a.agentId,
        name: a.name,
        role: a.role,
        tier: a.tier,
        subFunction: a.subFunction,
        status: "idle" as const,
      }));

      await db.bulkCreateAgents(agentRows);

      await db.updateWorkspace(input.workspaceId, {
        status: "active",
        onboardingCompleted: true,
        onboardingStep: 4,
      });

      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "workspace.provisioned",
        resource: "workspace",
        resourceId: String(input.workspaceId),
        details: { agentCount: agentRows.length },
      });

      return { success: true, agentCount: agentRows.length };
    }),

  updateSettings: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      llmProvider: z.string().optional(),
      llmModel: z.string().optional(),
      llmApiKey: z.string().optional(),
      telegramBotToken: z.string().optional(),
      telegramEnabled: z.boolean().optional(),
      slackBotToken: z.string().optional(),
      slackEnabled: z.boolean().optional(),
      whatsappToken: z.string().optional(),
      whatsappEnabled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const { workspaceId, llmApiKey, ...rest } = input;
      const updateData: Record<string, any> = { ...rest };
      if (llmApiKey) updateData.llmApiKeyEncrypted = llmApiKey; // TODO: encrypt

      await db.updateWorkspace(workspaceId, updateData);

      await db.createAuditEntry({
        workspaceId,
        userId: ctx.user.id,
        action: "workspace.settings_updated",
        resource: "workspace",
        resourceId: String(workspaceId),
      });

      return { success: true };
    }),
});

// ── Members Router ─────────────────────────────────────────────────────
const membersRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getWorkspaceMembers(input.workspaceId);
    }),

  invite: protectedProcedure
    .input(z.object({ workspaceId: z.number(), email: z.string().email(), role: z.enum(["admin", "member"]) }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const token = nanoid(32);
      await db.addWorkspaceMember({
        workspaceId: input.workspaceId,
        userId: 0, // placeholder until invite is accepted
        role: input.role,
        invitedBy: ctx.user.id,
        inviteEmail: input.email,
        inviteToken: token,
        inviteAccepted: false,
      });

      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "member.invited",
        resource: "member",
        details: { email: input.email, role: input.role },
      });

      return { success: true, inviteToken: token };
    }),

  remove: protectedProcedure
    .input(z.object({ workspaceId: z.number(), userId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove yourself" });

      await db.removeWorkspaceMember(input.workspaceId, input.userId);
      return { success: true };
    }),
});

// ── Agents Router ──────────────────────────────────────────────────────
const agentsRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAgentsForWorkspace(input.workspaceId);
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), workspaceId: z.number(), status: z.enum(["active", "idle", "error", "offline"]).optional(), model: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const { id, workspaceId, ...data } = input;
      await db.updateAgent(id, data);
      return { success: true };
    }),
});

// ── Tasks Router ───────────────────────────────────────────────────────
const tasksRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number(), status: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getTasksForWorkspace(input.workspaceId, input.status);
    }),

  create: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      title: z.string().min(1).max(500),
      description: z.string().optional(),
      // GACCS brief fields
      gaccsGoals: z.string().optional(),
      gaccsAudience: z.string().optional(),
      gaccsCreative: z.string().optional(),
      gaccsChannels: z.string().optional(),
      gaccsStakeholders: z.string().optional(),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
      source: z.enum(["form", "telegram", "slack", "whatsapp", "api"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      // Find the CMA agent for this workspace to auto-route
      const agents = await db.getAgentsForWorkspace(input.workspaceId);
      const cma = agents.find(a => a.agentId === "chief-marketing");

      const taskId = await db.createTask({
        workspaceId: input.workspaceId,
        title: input.title,
        description: input.description,
        gaccsGoals: input.gaccsGoals,
        gaccsAudience: input.gaccsAudience,
        gaccsCreative: input.gaccsCreative,
        gaccsChannels: input.gaccsChannels,
        gaccsStakeholders: input.gaccsStakeholders,
        priority: input.priority ?? "normal",
        source: input.source ?? "form",
        createdByUserId: ctx.user.id,
        // Auto-route to CMA for initial review
        routedByAgentId: cma?.id,
        assignedAgentId: cma?.id,
        status: "assigned",
        orchestrationStage: "cma_review",
      });

      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "task.gaccs_submitted",
        resource: "task",
        resourceId: String(taskId),
        details: { title: input.title, hasGaccs: !!(input.gaccsGoals || input.gaccsAudience) },
      });

      return { id: taskId };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      workspaceId: z.number(),
      status: z.enum(["inbox", "assigned", "active", "review", "waiting", "blocked", "done", "archived"]).optional(),
      priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
      assignedAgentId: z.number().nullable().optional(),
      orchestrationStage: z.enum(["cma_review", "lead_assignment", "specialist_work", "lead_review", "cma_approval", "human_review", "completed"]).optional(),
      subFunction: z.string().optional(),
      cmaFeedback: z.string().optional(),
      leadFeedback: z.string().optional(),
      result: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
      const { id, workspaceId, ...data } = input;
      if (data.status === "done") (data as any).completedAt = new Date();
      if (data.orchestrationStage === "completed") {
        (data as any).status = "done";
        (data as any).completedAt = new Date();
      }
      await db.updateTask(id, data);
      return { success: true };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number(), workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const task = await db.getTaskById(input.id);
      if (!task || task.workspaceId !== input.workspaceId) throw new TRPCError({ code: "NOT_FOUND" });
      return task;
    }),
});

// ── Audit Router ───────────────────────────────────────────────────────
const auditRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number(), limit: z.number().min(1).max(200).optional() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAuditLog(input.workspaceId, input.limit ?? 50);
    }),
});

// ── Admin Router (platform operator only) ──────────────────────────────
const platformAdminRouter = router({
  stats: adminProcedure.query(async () => {
    return db.getAdminStats();
  }),

  workspaces: adminProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return db.getAllWorkspaces(input?.search);
    }),

  users: adminProcedure.query(async () => {
    return db.getAllUsers();
  }),

  updateWorkspaceStatus: adminProcedure
    .input(z.object({ workspaceId: z.number(), status: z.enum(["provisioning", "active", "suspended", "archived"]) }))
    .mutation(async ({ ctx, input }) => {
      await db.updateWorkspace(input.workspaceId, { status: input.status });
      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "admin.workspace_status_changed",
        resource: "workspace",
        resourceId: String(input.workspaceId),
        details: { newStatus: input.status },
      });
      return { success: true };
    }),
});

// ── Main Router ────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  workspace: workspaceRouter,
  members: membersRouter,
  agents: agentsRouter,
  tasks: tasksRouter,
  audit: auditRouter,
  admin: platformAdminRouter,
});

export type AppRouter = typeof appRouter;
