import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3000";

describe("Newsletter endpoint", () => {
  it("should reject missing email", async () => {
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Test" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("email");
  });

  it("should reject invalid email", async () => {
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-valid", firstName: "Test" }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("email");
  });

  it("should accept valid email and subscribe to Loops", async () => {
    const testEmail = `test-newsletter-${Date.now()}@example.com`;
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, firstName: "Vitest" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should handle duplicate email gracefully", async () => {
    const testEmail = `test-newsletter-dup-${Date.now()}@example.com`;
    // First subscription
    await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, firstName: "Dup" }),
    });
    // Second subscription (duplicate)
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, firstName: "Dup" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("should respond to CORS preflight", async () => {
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://outmarkhq.com",
        "Access-Control-Request-Method": "POST",
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });
});
