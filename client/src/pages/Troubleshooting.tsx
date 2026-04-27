import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";
import { AlertTriangle } from "lucide-react";

const issues = [
  {
    id: "streaming",
    title: "\"Streaming not supported\" — Agent calls fail with empty responses",
    severity: "Critical",
    symptom: "Agent calls complete with stopReason: \"stop\" but return 0 payloads. Gateway logs show \"No reply from agent\". The upstream LLM API returns a 400 error about streaming not being supported.",
    cause: "AlphaClaw's openai-completions provider hardcodes stream: true in all API requests. If your LLM provider or proxy does not support Server-Sent Events (SSE) streaming, every call fails silently. The embedded slug-gen agent is particularly affected because it uses a hardcoded model reference.",
    fix: "Deploy a model remapping proxy that intercepts streaming requests, calls the upstream with stream: false, and converts the JSON response back to SSE format. The proxy also handles model aliasing.",
    code: `# model-proxy.py — handles streaming conversion + model remapping
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, urllib.request

UPSTREAM = "https://your-llm-proxy.example.com/v1"
API_KEY  = "your-api-key"
MODEL_MAP = {"gpt-4.1": "gpt-4.1-mini"}  # remap unsupported models

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        # Remap model if needed
        if body.get("model") in MODEL_MAP:
            body["model"] = MODEL_MAP[body["model"]]
        # Force non-streaming
        body["stream"] = False
        # Forward to upstream...
        # Convert response to SSE format for AlphaClaw

HTTPServer(("0.0.0.0", 18792), Handler).serve_forever()`,
  },
  {
    id: "embedded-slug-gen",
    title: "Embedded slug-gen agent hardcodes openai/gpt-4.1 — ignores your config",
    severity: "Critical",
    symptom: "Gateway logs show \"embedded run agent end: isError=true model=gpt-4.1 provider=openai\" even though your config specifies a different model. The slug-gen agent fails, blocking session creation.",
    cause: "AlphaClaw has an internal \"embedded\" agent (slug-gen) that generates session slugs. This agent hardcodes openai/gpt-4.1 regardless of your agents.defaults.models config. If your provider doesn't serve gpt-4.1, this agent fails on every new session.",
    fix: "Override the built-in openai provider's baseUrl to point to a local proxy that remaps gpt-4.1 requests to a model your provider supports (e.g., gpt-4.1-mini). The proxy intercepts the hardcoded model reference transparently.",
    code: `# In alphaclaw.json, override the openai provider:
{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "http://127.0.0.1:18792/v1",
        "apiKey": "your-key"
      }
    }
  }
}

# The proxy at :18792 remaps gpt-4.1 → gpt-4.1-mini
# and converts streaming → non-streaming`,
  },
  {
    id: "models-schema",
    title: "Config validation: agents.defaults.models expects a record of objects, not strings",
    severity: "High",
    symptom: "Gateway fails to start with: \"agents.defaults.models.primary: Invalid input: expected object, received string\" or \"agents.defaults.models: Invalid input: expected record, received array\".",
    cause: "The agents.defaults.models field must be a record where keys are model references (provider/model) and values are objects with at least an alias field. It cannot be a string, an array, or a record of strings.",
    fix: "Use the correct format: { \"provider/model-name\": { \"alias\": \"descriptive name\" } }",
    code: `// ❌ WRONG — string value
"models": { "primary": "openai/gpt-4.1-mini" }

// ❌ WRONG — array
"models": ["openai/gpt-4.1-mini"]

// ✅ CORRECT — record of objects
"models": {
  "openai/gpt-4.1-mini": { "alias": "primary" }
}`,
  },
  {
    id: "telegram-no-channels",
    title: "Telegram bot does not respond — no channels section in config",
    severity: "Critical",
    symptom: "You message the Telegram bot and get no response. The gateway is running and healthy. The Control UI works fine. Gateway logs show no Telegram-related entries at all.",
    cause: "The alphaclaw.json has no channels section. Without channels.telegram configured, the gateway never starts the Telegram polling provider. It does not know the bot exists.",
    fix: "Add the channels.telegram block to your alphaclaw.json with botToken, dmPolicy, and allowFrom. If you used setup.sh, make sure TELEGRAM_BOT_TOKEN is set in your .env file and re-run setup.",
    code: `# Add to alphaclaw.json (or re-run setup.sh with TELEGRAM_BOT_TOKEN in .env):\n{\n  \"channels\": {\n    \"telegram\": {\n      \"botToken\": \"123456789:ABCdefGhIjKlmNoPqRsTuVwXyZ\",\n      \"dmPolicy\": \"open\",\n      \"allowFrom\": [\"*\"]\n    }\n  }\n}\n\n# Then restart the gateway:\nalphaclaw gateway restart\n# Or: ./scripts/stop-all.sh && ./scripts/start-all.sh`,
  },
  {
    id: "telegram-allowfrom",
    title: "Telegram provider keeps restarting — dmPolicy requires allowFrom",
    severity: "High",
    symptom: "Gateway logs show \"[telegram] [default] starting provider\" repeatedly. The Telegram bot never connects to polling. Config validation shows: \"channels.telegram.accounts.*.dmPolicy='open' requires allowFrom to include '*'\".",
    cause: "When dmPolicy is set to \"open\", AlphaClaw requires an explicit allowFrom: [\"*\"] to confirm you intentionally want to accept DMs from anyone. Without it, the Telegram provider restarts in a loop.",
    fix: "Add allowFrom: [\"*\"] at both the account level and the channel level.",
    code: `// In alphaclaw.json:
{
  "channels": {
    "telegram": {
      "allowFrom": ["*"],
      "accounts": {
        "default": {
          "token": "your-bot-token",
          "dmPolicy": "open",
          "allowFrom": ["*"]
        }
      }
    }
  }
}`,
  },
  {
    id: "config-schema-general",
    title: "Config validation fails with \"unrecognized field\" errors",
    severity: "High",
    symptom: "alphaclaw config validate reports errors like \"unrecognized field: timeoutSeconds\" or \"unrecognized field: streaming\" in the configuration file.",
    cause: "The AlphaClaw config schema is strict and does not accept arbitrary fields. Some fields that seem logical (like streaming at the provider level, or timeoutSeconds in compaction) are not part of the schema.",
    fix: "Remove unrecognized fields. The validated schema fields are documented in the official config reference. Key gotchas: compaction only accepts maxTokens and strategy (not timeoutSeconds), and streaming cannot be controlled at the provider level.",
    code: `# Validate your config
alphaclaw config validate

# Common fields to REMOVE:
# - agents.defaults.compaction.timeoutSeconds
# - models.providers[].streaming
# - agents.defaults.blockStreaming

# The model remapping proxy is the correct fix for streaming issues`,
  },
  {
    id: "command-center-adapter-url",
    title: "Command Center run fails with \"AlphaClaw gateway adapter missing url\"",
    severity: "High",
    symptom: "Creating an issue in Command Center triggers a run that immediately fails with \"AlphaClaw gateway adapter missing url\". The run shows as failed in the Runs tab.",
    cause: "The Command Center AlphaClaw Gateway adapter expects the config field to be named url (not gatewayUrl, wsUrl, or endpoint). This is the WebSocket URL to the AlphaClaw gateway.",
    fix: "Update the agent's adapter_config in the database to use the correct field name url.",
    code: `-- Fix via PostgreSQL:
UPDATE agents
SET adapter_config = jsonb_set(
  adapter_config,
  '{url}',
  '"ws://127.0.0.1:18789"'
)
WHERE adapter_type = 'alphaclaw_gateway';

-- Required adapter_config fields:
-- url: "ws://127.0.0.1:18789"  (REQUIRED)
-- authToken: "your-gateway-token"  (for authenticated gateways)
-- sessionKeyStrategy: "issue"  (recommended)`,
  },
  {
    id: "command-center-llm-doctor",
    title: "Command Center doctor blocks startup — LLM check fails with custom base URL",
    severity: "High",
    symptom: "alphaclaw-cc run fails at the doctor check step with \"LLM check failed\". The LLM provider is accessible but Command Center's doctor validates against the real OpenAI API, not your custom base URL.",
    cause: "Command Center's config schema only accepts provider and apiKey for the LLM config — baseUrl and model are not valid fields and get stripped during validation. The doctor check always validates the API key against api.openai.com regardless of any custom proxy.",
    fix: "Patch the Command Center source to accept baseUrl in the schema and use it in the doctor check. The patch is in dist/index.js of the alphaclaw-cc package.",
    code: `# Find the Command Center dist file:
PPATH=$(which alphaclaw-cc | xargs dirname)/../lib/node_modules/alphaclaw-cc

# 1. Patch the LLM config schema to accept baseUrl:
# Find: provider:Ue.enum(["openai","claude"])
# Add: ,baseUrl:Ue.string().optional(),model:Ue.string().optional()

# 2. Patch the doctor LLM check to use baseUrl:
# Find: fetch("https://api.openai.com/v1/models"
# Replace with: fetch((config.llm?.baseUrl || "https://api.openai.com") + "/v1/models"

# Then run: alphaclaw-cc doctor
# All 9 checks should pass`,
  },
  {
    id: "command-center-postgres",
    title: "Command Center requires PostgreSQL 15+ — NULLS NOT DISTINCT syntax error",
    severity: "High",
    symptom: "Command Center starts but immediately crashes with a PostgreSQL syntax error: \"syntax error at or near 'NULLS'\" during database migration.",
    cause: "Command Center's database schema uses NULLS NOT DISTINCT in unique constraints, which is a PostgreSQL 15+ feature. Ubuntu 22.04 ships with PostgreSQL 14 by default.",
    fix: "Install PostgreSQL 16 from the official PostgreSQL apt repository.",
    code: `# Add PostgreSQL apt repo
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install -y postgresql-16

# Create cluster on a non-conflicting port
sudo pg_createcluster 16 main --start -p 5433

# Create database
sudo -u postgres psql -p 5433 -c "CREATE DATABASE command-center;"

# Update Command Center config:
# "database": { "mode": "external", "connectionString": "postgresql://..." }`,
  },
  {
    id: "command-center-database-url",
    title: "Command Center connects to wrong database — picks up DATABASE_URL from environment",
    severity: "Medium",
    symptom: "Command Center tries to connect to MySQL on port 3306 instead of your PostgreSQL database. Error: \"connect ECONNREFUSED 127.0.0.1:3306\".",
    cause: "The @alphaclaw-cc/server module reads DATABASE_URL from the environment. If another service (like a webdev platform) sets this variable, Command Center uses it instead of its own config.",
    fix: "Override DATABASE_URL when starting Command Center, or unset it from the environment.",
    code: `# Start Command Center with explicit DATABASE_URL:
DATABASE_URL="postgresql://postgres@localhost:5433/command-center" \\
  alphaclaw-cc run --no-repair

# Or unset the conflicting variable:
unset DATABASE_URL
alphaclaw-cc run`,
  },
  {
    id: "device-pairing",
    title: "Control UI shows \"unauthorized\" — cannot access the chat interface",
    severity: "Medium",
    symptom: "Opening the Control UI in a browser shows \"unauthorized: gateway token missing\" or the chat interface loads but messages fail with auth errors.",
    cause: "The Control UI requires device pairing. When you first access it from a new browser, it creates a pairing request that must be approved via the CLI.",
    fix: "List pending devices and approve the request. For non-local connections, you may also need to configure trustedProxies.",
    code: `# List pending device pairing requests
alphaclaw gateway call device.pair.list

# Approve the pending device
alphaclaw gateway call device.pair.approve --params '{"deviceId":"<id>"}'

# For reverse proxies, add to alphaclaw.json:
{
  "gateway": {
    "trustedProxies": ["10.0.0.0/8", "172.16.0.0/12"]
  }
}`,
  },
  {
    id: "single-turn",
    title: "Agent delegation does not work — Chief Marketing Agent cannot route tasks to sub-agents",
    severity: "Medium",
    symptom: "The Chief Marketing Agent acknowledges a task and says it will delegate to a sub-function lead, but the delegation never happens. The response ends after the initial message.",
    cause: "The alphaclaw agent CLI command runs in single-turn mode. The Chief Marketing Agent makes a tool call to delegate (sessions_spawn), but the CLI does not execute the tool call — it just reports the response and exits.",
    fix: "Use the Control UI (web chat) or the alphaclaw chat command for multi-turn conversations where delegation actually executes. The CLI agent command is only useful for testing individual agents in isolation.",
    code: `# Single-turn (delegation does NOT work):
alphaclaw agent --agent chief-marketing --message "Write a blog post"

# Multi-turn (delegation WORKS):
# Use the Control UI at http://localhost:18789
# Or use the chat command:
alphaclaw chat --session main`,
  },
  {
    id: "alphaclaw-gateway-adapter-disabled",
    title: "Command Center onboarding: AlphaClaw Gateway adapter button is disabled",
    severity: "Medium",
    symptom: "During Command Center onboarding, the \"AlphaClaw Gateway\" adapter type button appears grayed out (opacity-40, cursor-not-allowed) and cannot be selected.",
    cause: "The AlphaClaw Gateway adapter is a built-in adapter type but it's disabled in the onboarding UI when no AlphaClaw gateway connection has been pre-configured. The button becomes enabled only after Command Center detects a running gateway.",
    fix: "Skip the onboarding wizard and create the agent directly in the database with the alphaclaw_gateway adapter type. Then configure the adapter_config with the correct WebSocket URL.",
    code: `-- Insert agent directly via PostgreSQL:
INSERT INTO agents (company_id, name, role, title, status, adapter_type, adapter_config)
VALUES (
  '<your-company-id>',
  'Chief Marketing Agent',
  'executive',
  'Chief Marketing Agent',
  'idle',
  'alphaclaw_gateway',
  '{
    "url": "ws://127.0.0.1:18789",
    "authToken": "<your-gateway-token>",
    "sessionKeyStrategy": "issue"
  }'::jsonb
);`,
  },
  {
    id: "permissions",
    title: "Security warning about config file permissions",
    severity: "Low",
    symptom: "alphaclaw health or alphaclaw status shows a warning about config file permissions being too open.",
    cause: "The alphaclaw.json file contains API keys and the gateway token. If file permissions allow other users to read it, AlphaClaw warns you.",
    fix: "Set restrictive permissions on the config file.",
    code: `chmod 600 ~/.alphaclaw/alphaclaw.json`,
  },
  {
    id: "port-conflict",
    title: "Gateway fails to start — port already in use",
    severity: "Low",
    symptom: "alphaclaw gateway start fails with \"EADDRINUSE\" or \"port 18789 already in use\".",
    cause: "Another process (possibly a previous gateway instance) is already using port 18789.",
    fix: "Find and kill the conflicting process, or change the gateway port in the config.",
    code: `# Find what's using the port
lsof -i :18789

# Kill the process
kill <PID>

# Or change the port in alphaclaw.json:
# "gateway": { "port": 18790 }`,
  },
];

const severityColors: Record<string, string> = {
  Critical: "bg-red-500 text-white",
  High: "bg-amber-500 text-slate-900",
  Medium: "bg-teal-500 text-white",
  Low: "bg-slate-300 text-slate-900",
};

export default function Troubleshooting() {
  return (
    <DocPage
      title="Troubleshooting"
      subtitle="Every issue we encountered during deployment, with exact symptoms, root causes, and fixes."
      icon={<AlertTriangle size={24} />}
      prevPage={{ path: "/dependencies", label: "Dependencies" }}
      nextPage={{ path: "/faq", label: "FAQ" }}
    >
      <div className="bg-slate-800 rounded-xl p-6 mb-10 text-slate-100">
        <p className="mb-0 text-sm leading-relaxed">
          <strong>These are not theoretical issues.</strong> Every problem listed below was actually
          encountered during our deployment of this system. The fixes are tested and verified.
          The automated <code className="text-teal-300">setup.sh</code> script handles most of these
          issues automatically — but this page exists as a reference for manual deployments or when
          things go wrong despite automation.
        </p>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        {issues.length} issues documented — {issues.filter(i => i.severity === "Critical").length} critical,{" "}
        {issues.filter(i => i.severity === "High").length} high,{" "}
        {issues.filter(i => i.severity === "Medium").length} medium,{" "}
        {issues.filter(i => i.severity === "Low").length} low severity.
      </p>

      {issues.map((issue) => (
        <div key={issue.id} id={issue.id} className="mb-10 scroll-mt-20">
          <div className="flex items-start gap-3 mb-3">
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shrink-0 mt-1 ${severityColors[issue.severity]}`}>
              {issue.severity}
            </span>
            <h3 className="!mt-0 !mb-0">{issue.title}</h3>
          </div>

          <div className="space-y-4 ml-0 lg:ml-[72px]">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Symptom</div>
              <p className="text-sm">{issue.symptom}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Root Cause</div>
              <p className="text-sm">{issue.cause}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Fix</div>
              <p className="text-sm">{issue.fix}</p>
            </div>
            <CodeBlock code={issue.code} />
          </div>
        </div>
      ))}

      <h2>Still Stuck?</h2>
      <p>
        If you encounter an issue not listed here, check these resources:
      </p>
      <ul>
        <li><a href="https://github.com/chrysb/alphaclaw" target="_blank" rel="noopener noreferrer">AlphaClaw Official Documentation</a></li>
        <li><a href="https://github.com/alphaclaw/alphaclaw/issues" target="_blank" rel="noopener noreferrer">AlphaClaw GitHub Issues</a></li>
        <li><a href="https://github.com/chrysb/alphaclaw" target="_blank" rel="noopener noreferrer">Command Center Documentation</a></li>
        <li><a href="https://discord.gg/alphaclaw" target="_blank" rel="noopener noreferrer">AlphaClaw Discord Community</a></li>
      </ul>
    </DocPage>
  );
}
