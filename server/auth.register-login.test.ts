import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  value: string;
  options: Record<string, unknown>;
};

function createAnonymousContextWithCookies(): {
  ctx: TrpcContext;
  setCookies: CookieCall[];
  clearedCookies: { name: string; options: Record<string, unknown> }[];
} {
  const setCookies: CookieCall[] = [];
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, setCookies, clearedCookies };
}

// ── Registration Tests ──────────────────────────────────────────────────

describe("auth.register", () => {
  it("validates email format", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: "not-an-email",
        password: "password123",
        name: "Test User",
      })
    ).rejects.toThrow();
  });

  it("validates password minimum length", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: "test@example.com",
        password: "short",
        name: "Test User",
      })
    ).rejects.toThrow();
  });

  it("validates name is required", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.register({
        email: "test@example.com",
        password: "password123",
        name: "",
      })
    ).rejects.toThrow();
  });

  it("creates user and sets session cookie on successful registration", async () => {
    const { ctx, setCookies } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    // Use a unique email to avoid conflicts with existing users
    const uniqueEmail = `test-register-${Date.now()}@example.com`;

    const result = await caller.auth.register({
      email: uniqueEmail,
      password: "securepassword123",
      name: "Test Registration User",
    });

    // Should return user data
    expect(result).toBeDefined();
    expect(result?.email).toBe(uniqueEmail);
    expect(result?.name).toBe("Test Registration User");
    expect(result?.loginMethod).toBe("email");
    expect(result?.role).toBe("user");

    // Should set a session cookie
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
    expect(typeof setCookies[0]?.value).toBe("string");
    expect(setCookies[0]?.value.length).toBeGreaterThan(0);
    expect(setCookies[0]?.options).toMatchObject({
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });

  it("rejects duplicate email registration", async () => {
    const { ctx: ctx1 } = createAnonymousContextWithCookies();
    const caller1 = appRouter.createCaller(ctx1);

    const uniqueEmail = `test-dup-${Date.now()}@example.com`;

    // First registration should succeed
    await caller1.auth.register({
      email: uniqueEmail,
      password: "securepassword123",
      name: "First User",
    });

    // Second registration with same email should fail
    const { ctx: ctx2 } = createAnonymousContextWithCookies();
    const caller2 = appRouter.createCaller(ctx2);

    await expect(
      caller2.auth.register({
        email: uniqueEmail,
        password: "anotherpassword123",
        name: "Second User",
      })
    ).rejects.toThrow(/already exists/i);
  });

  it("normalizes email to lowercase", async () => {
    const { ctx, setCookies } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    const uniqueEmail = `Test-Normalize-${Date.now()}@Example.COM`;

    const result = await caller.auth.register({
      email: uniqueEmail,
      password: "securepassword123",
      name: "Normalize Test",
    });

    expect(result?.email).toBe(uniqueEmail.toLowerCase());
  });
});

// ── Login Tests ─────────────────────────────────────────────────────────

describe("auth.login", () => {
  it("validates email format", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "not-an-email",
        password: "password123",
      })
    ).rejects.toThrow();
  });

  it("validates password is required", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: "test@example.com",
        password: "",
      })
    ).rejects.toThrow();
  });

  it("rejects login with non-existent email", async () => {
    const { ctx } = createAnonymousContextWithCookies();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.auth.login({
        email: `nonexistent-${Date.now()}@example.com`,
        password: "password123",
      })
    ).rejects.toThrow(/invalid email or password/i);
  });

  it("logs in successfully with correct credentials and sets session cookie", async () => {
    // First register a user
    const { ctx: regCtx } = createAnonymousContextWithCookies();
    const regCaller = appRouter.createCaller(regCtx);

    const uniqueEmail = `test-login-${Date.now()}@example.com`;
    const password = "securepassword123";

    await regCaller.auth.register({
      email: uniqueEmail,
      password,
      name: "Login Test User",
    });

    // Now login with the same credentials
    const { ctx: loginCtx, setCookies } = createAnonymousContextWithCookies();
    const loginCaller = appRouter.createCaller(loginCtx);

    const result = await loginCaller.auth.login({
      email: uniqueEmail,
      password,
    });

    // Should return user data
    expect(result).toBeDefined();
    expect(result?.email).toBe(uniqueEmail);
    expect(result?.name).toBe("Login Test User");

    // Should set a session cookie
    expect(setCookies).toHaveLength(1);
    expect(setCookies[0]?.name).toBe(COOKIE_NAME);
    expect(typeof setCookies[0]?.value).toBe("string");
    expect(setCookies[0]?.value.length).toBeGreaterThan(0);
    expect(setCookies[0]?.options).toMatchObject({
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });

  it("rejects login with wrong password", async () => {
    // First register a user
    const { ctx: regCtx } = createAnonymousContextWithCookies();
    const regCaller = appRouter.createCaller(regCtx);

    const uniqueEmail = `test-wrongpw-${Date.now()}@example.com`;

    await regCaller.auth.register({
      email: uniqueEmail,
      password: "correctpassword123",
      name: "Wrong PW Test",
    });

    // Try login with wrong password
    const { ctx: loginCtx } = createAnonymousContextWithCookies();
    const loginCaller = appRouter.createCaller(loginCtx);

    await expect(
      loginCaller.auth.login({
        email: uniqueEmail,
        password: "wrongpassword123",
      })
    ).rejects.toThrow(/invalid email or password/i);
  });

  it("login is case-insensitive for email", async () => {
    // Register with lowercase
    const { ctx: regCtx } = createAnonymousContextWithCookies();
    const regCaller = appRouter.createCaller(regCtx);

    const uniqueEmail = `test-case-${Date.now()}@example.com`;

    await regCaller.auth.register({
      email: uniqueEmail,
      password: "securepassword123",
      name: "Case Test",
    });

    // Login with mixed case
    const { ctx: loginCtx, setCookies } = createAnonymousContextWithCookies();
    const loginCaller = appRouter.createCaller(loginCtx);

    const result = await loginCaller.auth.login({
      email: uniqueEmail.toUpperCase(),
      password: "securepassword123",
    });

    expect(result).toBeDefined();
    expect(result?.email).toBe(uniqueEmail);
    expect(setCookies).toHaveLength(1);
  });
});
