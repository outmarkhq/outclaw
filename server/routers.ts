import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import * as db from "./db";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";
import { invokeLLM } from "./_core/llm";
import { getProvider, getProviderBaseUrl } from "@shared/llmProviders";
import { sendWelcomeEmail, sendPasswordResetEmail } from "./email";
import crypto from "crypto";

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
      if (input.data?.llmBaseUrl) updateData.llmBaseUrl = input.data.llmBaseUrl;
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
      if (input.data?.whatsappToken !== undefined) {
        updateData.whatsappToken = input.data.whatsappToken;
        updateData.whatsappEnabled = !!input.data.whatsappToken;
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
      llmBaseUrl: z.string().optional(),
      telegramBotToken: z.string().optional(),
      telegramEnabled: z.boolean().optional(),
      slackBotToken: z.string().optional(),
      slackEnabled: z.boolean().optional(),
      whatsappToken: z.string().optional(),
      whatsappEnabled: z.boolean().optional(),
      settings: z.record(z.string(), z.any()).optional(),
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
// ── Audit Router ─────────────────────────────────────────────────────────────────
const auditRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number(), limit: z.number().min(1).max(200).optional() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
      return db.getAuditLog(input.workspaceId, input.limit ?? 50);
    }),
});

// ── Chat Router ──────────────────────────────────────────────────────────────────
const chatRouter = router({
  history: protectedProcedure
    .input(z.object({ workspaceId: z.number(), limit: z.number().min(1).max(200).optional() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
      const messages = await db.getChatMessagesForUser(input.workspaceId, ctx.user.id, input.limit ?? 100);
      return messages.reverse(); // oldest first for display
    }),

  send: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      message: z.string().min(1).max(10000),
      agentId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      // Get workspace LLM config
      const workspace = await db.getWorkspaceById(input.workspaceId);
      if (!workspace) throw new TRPCError({ code: "NOT_FOUND", message: "Workspace not found" });

      // Save user message
      await db.createChatMessage({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        agentId: input.agentId ?? "chief-marketing",
        role: "user",
        content: input.message,
      });

      // Get recent history for context
      const history = await db.getChatMessagesForUser(input.workspaceId, ctx.user.id, 20);

      // Build system prompt based on agent
      const agents = await db.getAgentsForWorkspace(input.workspaceId);
      const targetAgent = agents.find(a => a.agentId === (input.agentId ?? "chief-marketing"));
      const systemPrompt = `You are ${targetAgent?.name ?? "the Chief Marketing Agent"}, an AI marketing specialist. ${targetAgent?.role ?? "You route tasks, enrich context, and review all output."}\n\nYou are part of a 21-agent marketing team. When the user gives you a marketing task or question, respond helpfully and concisely. If the task should be delegated to a specialist, mention which agent would handle it.\n\nBe direct, strategic, and action-oriented. Use marketing best practices.`;

      // Build messages for LLM
      const llmMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: input.message },
      ];

      // Call LLM (uses built-in platform LLM — workspace-specific routing TODO)
      const response = await invokeLLM({ messages: llmMessages });
      const rawContent = response.choices?.[0]?.message?.content;
      const assistantContent = (typeof rawContent === "string" ? rawContent : "") || "I apologize, but I was unable to generate a response. Please try again.";

      // Save assistant response
      await db.createChatMessage({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        agentId: input.agentId ?? "chief-marketing",
        role: "assistant",
        content: assistantContent,
      });

      // Audit
      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "chat.message_sent",
        resource: "chat",
        details: { agentId: input.agentId ?? "chief-marketing" },
      });

      return { content: assistantContent, agentId: input.agentId ?? "chief-marketing" };
    }),
});

// ── Cron Jobs Router ─────────────────────────────────────────────────────────────
const cronRouter = router({
  list: protectedProcedure
    .input(z.object({ workspaceId: z.number() }))
    .query(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });
      return db.getCronJobsForWorkspace(input.workspaceId);
    }),

  create: protectedProcedure
    .input(z.object({
      workspaceId: z.number(),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      cronExpression: z.string().min(1),
      agentId: z.string().optional(),
      taskTemplate: z.any().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const id = await db.createCronJob({
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description ?? null,
        cronExpression: input.cronExpression,
        agentId: input.agentId ?? null,
        taskTemplate: input.taskTemplate ?? null,
        createdByUserId: ctx.user.id,
      });

      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "cron.created",
        resource: "cron_job",
        resourceId: String(id),
        details: { name: input.name, cronExpression: input.cronExpression },
      });

      return { id };
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      workspaceId: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      cronExpression: z.string().optional(),
      agentId: z.string().optional(),
      enabled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      const { id, workspaceId, ...updateData } = input;
      await db.updateCronJob(id, updateData as any);

      await db.createAuditEntry({
        workspaceId,
        userId: ctx.user.id,
        action: "cron.updated",
        resource: "cron_job",
        resourceId: String(id),
      });

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number(), workspaceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await db.getUserWorkspaceMembership(input.workspaceId, ctx.user.id);
      if (!membership || membership.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });

      await db.deleteCronJob(input.id);

      await db.createAuditEntry({
        workspaceId: input.workspaceId,
        userId: ctx.user.id,
        action: "cron.deleted",
        resource: "cron_job",
        resourceId: String(input.id),
      });

      return { success: true };
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

// ── Helpers ───────────────────────────────────────────────────────────
function stripSensitive<T extends Record<string, unknown> | null | undefined>(user: T): T {
  if (!user) return user;
  const { passwordHash, ...safe } = user as Record<string, unknown>;
  return safe as T;
}

// ── Main Router ────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => stripSensitive(opts.ctx.user)),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: publicProcedure
      .input(
        z.object({
          email: z.email().transform((v) => v.toLowerCase().trim()),
          password: z.string().min(8, "Password must be at least 8 characters"),
          name: z.string().min(1, "Name is required").max(255),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if email already exists
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "An account with this email already exists",
          });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(input.password, 12);

        // Generate unique openId for this email-auth user
        const openId = nanoid(32);

        // Create user
        const userId = await db.createUserWithPassword({
          email: input.email,
          passwordHash,
          name: input.name,
          openId,
        });

        // Issue JWT session cookie
        const sessionToken = await sdk.createSessionToken(openId, {
          name: input.name,
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        // Send welcome email (fire and forget)
        sendWelcomeEmail(input.email, input.name).catch((err) =>
          console.error("[Email] Welcome email failed:", err)
        );

        // Fetch the full user record to return
        const user = await db.getUserByOpenId(openId);
        return stripSensitive(user);
      }),
    login: publicProcedure
      .input(
        z.object({
          email: z.email().transform((v) => v.toLowerCase().trim()),
          password: z.string().min(1, "Password is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Find user by email
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Verify password
        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid email or password",
          });
        }

        // Update last sign-in
        await db.upsertUser({
          openId: user.openId,
          lastSignedIn: new Date(),
        });

        // Issue JWT session cookie
        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return stripSensitive(user);
      }),
    forgotPassword: publicProcedure
      .input(z.object({
        email: z.email().transform((v) => v.toLowerCase().trim()),
        origin: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Always return success to prevent email enumeration
        const user = await db.getUserByEmail(input.email);
        if (!user) return { success: true };

        // Generate a secure token
        const token = crypto.randomBytes(48).toString("hex");
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await db.createPasswordResetToken({
          userId: user.id,
          token,
          expiresAt,
        });

        // Build reset link
        const origin = input.origin || "https://command.outmarkhq.com";
        const resetLink = `${origin}/reset-password?token=${token}`;

        // Send password reset email
        await sendPasswordResetEmail(
          input.email,
          user.name ?? "there",
          resetLink
        );

        return { success: true };
      }),
    resetPassword: publicProcedure
      .input(
        z.object({
          token: z.string().min(1),
          password: z.string().min(8, "Password must be at least 8 characters"),
        })
      )
      .mutation(async ({ input }) => {
        const resetToken = await db.getPasswordResetToken(input.token);
        if (!resetToken) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired reset link",
          });
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This reset link has expired. Please request a new one.",
          });
        }

        // Check if token was already used
        if (resetToken.usedAt) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This reset link has already been used",
          });
        }

        // Hash new password and update user
        const passwordHash = await bcrypt.hash(input.password, 12);
        await db.updateUserPassword(resetToken.userId, passwordHash);
        await db.markTokenUsed(input.token);

        return { success: true };
      }),
  }),
  workspace: workspaceRouter,
  members: membersRouter,
  agents: agentsRouter,
  tasks: tasksRouter,
  audit: auditRouter,
  chat: chatRouter,
  cron: cronRouter,
  admin: platformAdminRouter,
});

export type AppRouter = typeof appRouter;
