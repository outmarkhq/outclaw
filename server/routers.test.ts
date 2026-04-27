import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// ── Auth ──────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.openId).toBe("test-user-001");
    expect(result?.email).toBe("test@example.com");
  });
});

// ── Workspace ─────────────────────────────────────────────────────────

describe("workspace.list", () => {
  it("rejects unauthenticated requests", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.workspace.list()).rejects.toThrow();
  });

  it("returns an array for authenticated users", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.workspace.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("workspace.create", () => {
  it("rejects unauthenticated requests", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.workspace.create({ name: "Test Workspace", slug: "test-ws" })
    ).rejects.toThrow();
  });

  it("validates slug format", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.workspace.create({ name: "Test", slug: "INVALID SLUG!" })
    ).rejects.toThrow();
  });
});

// ── Tasks (GACCS briefs) ──────────────────────────────────────────────

describe("tasks.create (GACCS brief)", () => {
  it("rejects unauthenticated requests", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.tasks.create({
        workspaceId: 1,
        title: "Test brief",
      })
    ).rejects.toThrow();
  });

  it("validates title is required", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.tasks.create({
        workspaceId: 1,
        title: "", // empty title should fail
      })
    ).rejects.toThrow();
  });

  it("accepts GACCS fields in the input schema", async () => {
    // Verify the input schema accepts all GACCS fields without throwing a validation error.
    // We expect a FORBIDDEN error (not a member) rather than a validation error,
    // which proves the schema accepts the GACCS fields correctly.
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.tasks.create({
        workspaceId: 999999, // non-existent workspace
        title: "Competitive analysis for Q3 launch",
        description: "Background context for the CMA",
        gaccsGoals: "Increase inbound demos by 25% in Q3",
        gaccsAudience: "VP of Engineering at Series B-D SaaS companies",
        gaccsCreative: "2,000-word blog post, authoritative tone",
        gaccsChannels: "Company blog + LinkedIn organic",
        gaccsStakeholders: "VP Marketing gives final approval",
        priority: "high",
        source: "form",
      });
    } catch (err: any) {
      // Should fail with FORBIDDEN (not a member), not a validation error
      expect(err.code).toBe("FORBIDDEN");
    }
  });
});

describe("tasks.list", () => {
  it("rejects unauthenticated requests", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.tasks.list({ workspaceId: 1 })
    ).rejects.toThrow();
  });
});

describe("tasks.update", () => {
  it("accepts orchestration stage updates", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);
    // Should fail with FORBIDDEN, not validation error
    try {
      await caller.tasks.update({
        id: 999999,
        workspaceId: 999999,
        orchestrationStage: "lead_assignment",
        subFunction: "Product Marketing",
      });
    } catch (err: any) {
      expect(err.code).toBe("FORBIDDEN");
    }
  });
});

// ── Agents ────────────────────────────────────────────────────────────

describe("agents.list", () => {
  it("rejects unauthenticated requests", async () => {
    const ctx = createAnonymousContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.agents.list({ workspaceId: 1 })
    ).rejects.toThrow();
  });
});

// ── Admin ─────────────────────────────────────────────────────────────

describe("admin.stats", () => {
  it("rejects non-admin users", async () => {
    const ctx = createMockContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("returns stats for admin users", async () => {
    const ctx = createMockContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.stats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("totalWorkspaces");
    expect(result).toHaveProperty("activeWorkspaces");
    expect(result).toHaveProperty("totalTasks");
  });
});

describe("admin.workspaces", () => {
  it("rejects non-admin users", async () => {
    const ctx = createMockContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.workspaces()).rejects.toThrow();
  });

  it("returns workspace list for admin users", async () => {
    const ctx = createMockContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.workspaces();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("admin.users", () => {
  it("rejects non-admin users", async () => {
    const ctx = createMockContext({ role: "user" });
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.users()).rejects.toThrow();
  });

  it("returns user list for admin users", async () => {
    const ctx = createMockContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.users();
    expect(Array.isArray(result)).toBe(true);
  });
});
