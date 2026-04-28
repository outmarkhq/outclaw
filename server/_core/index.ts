import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // CORS for newsletter endpoint (allow static marketing site)
  app.options("/api/newsletter", (_req, res) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    });
    res.sendStatus(204);
  });

  // Newsletter signup endpoint — proxies to Loops API
  app.post("/api/newsletter", async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    try {
      const { email, firstName } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email is required" });
      }

      if (!ENV.loopsApiKey) {
        console.warn("[Newsletter] LOOPS_API_KEY not set");
        return res.status(500).json({ error: "Newsletter service not configured" });
      }

      const loopsRes = await fetch("https://app.loops.so/api/v1/contacts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.loopsApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          firstName: firstName?.trim() || "",
          source: "Ingest Newsletter",
          subscribed: true,
        }),
      });

      if (loopsRes.status === 409) {
        // Contact already exists — still a success from the user's perspective
        return res.json({ success: true, message: "Already subscribed" });
      }

      if (!loopsRes.ok) {
        const body = await loopsRes.text();
        console.error(`[Newsletter] Loops API error (${loopsRes.status}):`, body);
        return res.status(502).json({ error: "Failed to subscribe" });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error("[Newsletter] Error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
