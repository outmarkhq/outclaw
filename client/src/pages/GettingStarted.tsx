/*
 * Outclaw — Getting Started Page
 * Automated setup, single-command deployment
 */
import DocPage from "@/components/DocPage";
import { BookOpen, AlertTriangle, CheckCircle2, Terminal } from "lucide-react";

export default function GettingStarted() {
  return (
    <DocPage
      title="Getting Started"
      subtitle="Deploy the full 21-agent Outclaw marketing system with a single command."
      icon={<BookOpen size={24} />}
      nextPage={{ path: "/architecture", label: "Architecture" }}
    >
      <h2>Prerequisites</h2>
      <p>
        The setup script handles most dependencies automatically, but you need these on your system
        before running it. The script will install Node.js 24 and PostgreSQL 16 if they are missing.
      </p>
      <table>
        <thead>
          <tr><th>Dependency</th><th>Required Version</th><th>Auto-installed?</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td>Node.js</td><td>24+</td><td>Yes (via nvm)</td><td>AlphaClaw requires Node 24 — not 20, not 22</td></tr>
          <tr><td>Python</td><td>3.9+</td><td>No</td><td>For the model remapping proxy (stdlib only, no pip packages)</td></tr>
          <tr><td>PostgreSQL</td><td>15+</td><td>Yes (16)</td><td>Command Center needs NULLS NOT DISTINCT (PG 15+ feature)</td></tr>
          <tr><td>Git</td><td>2.30+</td><td>No</td><td>For cloning the repo</td></tr>
          <tr><td>Docker (optional)</td><td>24.0+</td><td>No</td><td>Only for cloud deployment mode</td></tr>
        </tbody>
      </table>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 not-prose">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm text-slate-900">Common Blocker: Node.js Version</strong>
            <p className="text-sm mt-1 mb-0 text-slate-600">
              If you have Node.js 20 or 22 installed, AlphaClaw will fail silently. The setup script
              detects this and installs Node 24 via nvm automatically. If you manage Node versions
              manually, make sure <code>node --version</code> shows v24+.
            </p>
          </div>
        </div>
      </div>

      <h2>Quick Start (Automated)</h2>
      <p>
        The automated setup script handles everything: Node.js 24 installation, AlphaClaw and Command Center
        CLI installation, agent workspace generation, model proxy deployment, PostgreSQL setup,
        Command Center bootstrap with admin account, and all 21 agent registration. This is the recommended
        path for first-time deployment.
      </p>

      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# 1. Clone the repository
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw

# 2. Create your environment file
cp config/.env.template .env

# 3. Edit .env with your API keys (at minimum, one LLM provider key)
#    Also set TELEGRAM_BOT_TOKEN if you want Telegram access (see below).
#    The setup script will auto-generate a gateway token if you skip it.

# 4. Run the automated setup
./scripts/setup.sh laptop

# The script runs 9 steps:
#   Step 1/9: Pre-flight checks (Node 24, Python, memory)
#   Step 2/9: Install AlphaClaw and Command Center CLI
#   Step 3/9: Load environment
#   Step 4/9: Generate 21 agent workspaces
#   Step 5/9: Apply AlphaClaw configuration
#   Step 6/9: Start model-remapping proxy
#   Step 7/9: Set up PostgreSQL for Command Center
#   Step 8/9: Set up Command Center
#   Step 9/9: Start AlphaClaw gateway and verify`}
      </pre>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 my-6 not-prose">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm text-slate-900">What the Script Automates</strong>
            <ul className="text-sm mt-1 mb-0 text-slate-600 list-disc pl-4 space-y-1">
              <li>Installs Node.js 24 via nvm if your version is too old</li>
              <li>Installs AlphaClaw and Command Center CLI globally</li>
              <li>Generates all 21 agent workspace files (SOUL.md, AGENTS.md, etc.)</li>
              <li>Generates AlphaClaw config dynamically from your .env (model proxy, auth, Telegram)</li>
              <li>Starts the model-remapping proxy (handles gpt-4.1 aliasing and SSE conversion)</li>
              <li>Installs PostgreSQL 16 and creates the Command Center database</li>
              <li>Patches Command Center's doctor check for proxy compatibility</li>
              <li>Bootstraps the admin account and prints the invite URL</li>
              <li>Registers all 21 agents in Command Center with correct hierarchy and adapter config</li>
              <li>Starts the AlphaClaw gateway and verifies health</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>After Setup</h2>
      <p>
        When the script completes, you will see a summary with URLs and your gateway token.
        Three services are now running:
      </p>
      <table>
        <thead>
          <tr><th>Service</th><th>URL</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td>AlphaClaw Control UI</td><td><code>http://localhost:18789</code></td><td>Chat with agents, manage sessions</td></tr>
          <tr><td>Command Center</td><td><code>http://localhost:3001</code></td><td>Dashboard, governance, task management</td></tr>
          <tr><td>Model Proxy</td><td><code>http://127.0.0.1:18792</code></td><td>Internal — model aliasing and streaming</td></tr>
        </tbody>
      </table>

      <h2>Connect Telegram</h2>
      <p>
        Telegram is the primary way to chat with your agents from anywhere. The setup script
        configures it automatically if you set <code>TELEGRAM_BOT_TOKEN</code> in your <code>.env</code> file
        before running setup.
      </p>

      <h3>Create a Bot</h3>
      <ol>
        <li>Open Telegram and message <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer">@BotFather</a></li>
        <li>Send <code>/newbot</code> and follow the prompts to name your bot</li>
        <li>Copy the bot token (looks like <code>123456789:ABCdefGhIjKlmNoPqRsTuVwXyZ</code>)</li>
        <li>Add it to your <code>.env</code> file: <code>TELEGRAM_BOT_TOKEN=your-token-here</code></li>
      </ol>

      <h3>If You Already Ran Setup Without Telegram</h3>
      <p>
        No problem. Add the token to your <code>.env</code> and re-run the setup script. It will
        regenerate the AlphaClaw config with Telegram enabled and restart the gateway.
      </p>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# Add to .env:
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIjKlmNoPqRsTuVwXyZ

# Re-run setup (safe to run multiple times):
./scripts/setup.sh laptop`}
      </pre>
      <p>
        After setup, message your bot on Telegram. The Chief Marketing Agent will respond.
        The bot is configured with <code>dmPolicy: open</code> by default, meaning anyone can DM it.
        To restrict access, see the <a href="/troubleshooting#telegram-allowfrom">Troubleshooting page</a>.
      </p>

      <h2>Verify the Deployment</h2>
      <p>
        Run the health check script to confirm all services are operational:
      </p>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`./scripts/health-check.sh

# Expected output:
#   ✓ PostgreSQL (PostgreSQL 16.x ...)
#   ✓ Model Proxy (HTTP 200)
#   ✓ Command Center (HTTP 200)
#   ✓ AlphaClaw Gateway (HTTP 200)
#   ✓ 21 agents registered in Command Center
#   Results: 8 passed, 0 failed, 0 warnings`}
      </pre>

      <h2>Helper Scripts</h2>
      <p>
        The project includes helper scripts for day-to-day operations:
      </p>
      <table>
        <thead>
          <tr><th>Script</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>scripts/setup.sh laptop</code></td><td>Full automated setup (first time)</td></tr>
          <tr><td><code>scripts/start-all.sh</code></td><td>Start all services (after reboot)</td></tr>
          <tr><td><code>scripts/stop-all.sh</code></td><td>Gracefully stop all services</td></tr>
          <tr><td><code>scripts/health-check.sh</code></td><td>Verify all services are running</td></tr>
        </tbody>
      </table>

      <h2>Manual Setup (Step-by-Step)</h2>
      <p>
        If you prefer to understand each step or need to customize the deployment, here is the
        manual process. The automated script does all of this for you.
      </p>

      <h3>1. Install Node.js 24</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24
nvm use 24`}
      </pre>

      <h3>2. Install AlphaClaw, Command Center, and Browser Harness</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`npm install -g @chrysb/alphaclaw
pip install browser-harness`}
      </pre>

      <h3>3. Configure Environment</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`cp config/.env.template .env
# Edit .env with your API keys and gateway token`}
      </pre>

      <h3>4. Generate Agent Workspaces</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`python3 scripts/generate-agent-files.py`}
      </pre>

      <h3>5. Start the Model Proxy</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`python3 proxy/model-proxy.py &
# Verify: curl http://127.0.0.1:18792/v1/models`}
      </pre>

      <h3>6. Start the Gateway</h3>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`alphaclaw gateway run --bind lan`}
      </pre>

      <h3>7. Set Up Command Center</h3>
      <p>
        See the <a href="/command-center">Command Center</a> page for the full Command Center setup,
        including PostgreSQL installation, admin bootstrap, and agent registration.
      </p>

      <h2>Test the System</h2>
      <p>
        Open the Control UI at <code>http://localhost:18789</code> and paste your gateway token.
        Send a message like:
      </p>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`What are your top 3 priorities as Chief Marketing Agent?`}
      </pre>
      <p>
        The Chief Marketing Agent should respond with a substantive answer referencing its role,
        team structure, and the GACCS brief framework. If it delegates to a sub-function lead,
        that is the delegation system working correctly.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 not-prose">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm text-slate-900">Testing Tip</strong>
            <p className="text-sm mt-1 mb-0 text-slate-600">
              Do not use <code>alphaclaw agent</code> for testing — it runs in single-turn mode
              and delegation will not work. Use the Control UI or <code>alphaclaw chat --session main</code> instead.
            </p>
          </div>
        </div>
      </div>

      <h2>What Next?</h2>
      <p>
        Once the gateway is running and the Chief Marketing Agent responds, you have a working system.
        Here is the recommended reading order:
      </p>
      <ol>
        <li><a href="/architecture">Architecture</a> — Understand the four-layer hierarchy and how agents communicate</li>
        <li><a href="/agents">Agent Roster</a> — Review all 21 agents and their specializations</li>
        <li><a href="/gaccs">GACCS Briefs</a> — Learn the structured task request format</li>
        <li><a href="/command-center">Command Center</a> — Set up Command Center for dashboard management</li>
        <li><a href="/deployment">Deployment</a> — Platform-specific guides for Windows, Mac, Linux, and Cloud</li>
      </ol>
    </DocPage>
  );
}
