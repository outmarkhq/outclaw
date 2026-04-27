import { describe, it, expect } from "vitest";

describe("Loops API Key Validation", () => {
  const LOOPS_API_KEY = process.env.LOOPS_API_KEY;

  it("should have LOOPS_API_KEY set", () => {
    expect(LOOPS_API_KEY).toBeDefined();
    expect(LOOPS_API_KEY).not.toBe("");
    expect(LOOPS_API_KEY).not.toBe("PLACEHOLDER");
  });

  it("should authenticate with Loops API", async () => {
    const res = await fetch("https://app.loops.so/api/v1/api-key", {
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.teamName).toBeTruthy();
  });

  it("should be able to list transactional emails", async () => {
    const res = await fetch("https://app.loops.so/api/v1/transactional", {
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
      },
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toHaveProperty("data");
  });
});
