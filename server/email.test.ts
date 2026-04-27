import { describe, expect, it } from "vitest";

const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

describe("Loops email configuration", () => {
  it("LOOPS_API_KEY is set and valid (can reach Loops API)", async () => {
    const apiKey = process.env.LOOPS_API_KEY;
    expect(apiKey).toBeTruthy();

    // Verify the API key by hitting the transactional endpoint with a GET
    // (Loops returns 405 for GET but 401 for bad auth)
    const res = await fetch("https://app.loops.so/api/v1/contacts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // A valid API key returns 200 (or 400 for missing params), not 401/403
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("LOOPS_WELCOME_TEMPLATE_ID is set and looks valid", () => {
    const templateId = process.env.LOOPS_WELCOME_TEMPLATE_ID;
    expect(templateId).toBeTruthy();
    expect(templateId).not.toBe("PLACEHOLDER_WELCOME");
    expect(templateId!.length).toBeGreaterThan(10);
  });

  it("LOOPS_RESET_TEMPLATE_ID is set and looks valid", () => {
    const templateId = process.env.LOOPS_RESET_TEMPLATE_ID;
    expect(templateId).toBeTruthy();
    expect(templateId).not.toBe("PLACEHOLDER_RESET");
    expect(templateId!.length).toBeGreaterThan(10);
  });
});
