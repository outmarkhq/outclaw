/**
 * Email service — sends transactional emails via Loops.so
 * Templates are created in the Loops dashboard; we reference them by ID.
 */
import { ENV } from "./_core/env";

const LOOPS_API_URL = "https://app.loops.so/api/v1/transactional";

interface SendEmailOptions {
  to: string;
  transactionalId: string;
  dataVariables?: Record<string, string | number>;
  addToAudience?: boolean;
}

async function sendLoopsEmail(opts: SendEmailOptions): Promise<boolean> {
  if (!ENV.loopsApiKey) {
    console.warn("[Email] LOOPS_API_KEY not set — skipping email send");
    return false;
  }

  try {
    const res = await fetch(LOOPS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.loopsApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: opts.to,
        transactionalId: opts.transactionalId,
        addToAudience: opts.addToAudience ?? true,
        dataVariables: opts.dataVariables ?? {},
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[Email] Loops API error (${res.status}):`, body);
      return false;
    }

    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("[Email] Failed to send email:", err);
    return false;
  }
}

/**
 * Send a welcome email after registration.
 * Template should include data variable: {{name}}
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  if (!ENV.loopsWelcomeTemplateId || ENV.loopsWelcomeTemplateId === "PLACEHOLDER_WELCOME") {
    console.warn("[Email] Welcome template ID not configured — skipping");
    return false;
  }

  return sendLoopsEmail({
    to,
    transactionalId: ENV.loopsWelcomeTemplateId,
    dataVariables: { name },
    addToAudience: true,
  });
}

/**
 * Send a password reset email.
 * Template should include data variables: {{name}}, {{resetLink}}
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
): Promise<boolean> {
  if (!ENV.loopsResetTemplateId || ENV.loopsResetTemplateId === "PLACEHOLDER_RESET") {
    console.warn("[Email] Reset template ID not configured — skipping");
    return false;
  }

  return sendLoopsEmail({
    to,
    transactionalId: ENV.loopsResetTemplateId,
    dataVariables: { name, resetLink },
    addToAudience: false,
  });
}
