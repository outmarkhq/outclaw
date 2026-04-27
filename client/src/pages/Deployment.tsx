/*
 * Outclaw — Deployment Page
 * Multi-platform deployment guides with automated setup
 */
import { Rocket, AlertTriangle, CheckCircle } from "lucide-react";
import DocPage from "@/components/DocPage";
import { useState } from "react";

const DEPLOY_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306550909/iuGjwtGPwe2tLuJLPpTZVn/deployment-illustration_c328deaa.png";

type Platform = "windows" | "mac" | "linux" | "cloud";

const platformTabs: { id: Platform; label: string }[] = [
  { id: "windows", label: "Windows" },
  { id: "mac", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "cloud", label: "Cloud (AWS/GCP)" },
];

export default function Deployment() {
  const [platform, setPlatform] = useState<Platform>("linux");

  return (
    <DocPage
      title="Deployment"
      subtitle="Step-by-step deployment guides for every platform — one command does everything"
      icon={<Rocket size={24} />}
      prevPage={{ path: "/models", label: "Model Strategy" }}
      nextPage={{ path: "/troubleshooting", label: "Troubleshooting" }}
    >
      <div className="my-8 rounded-xl overflow-hidden border border-slate-200 shadow-lg not-prose">
        <img src={DEPLOY_IMG} alt="Deployment illustration" className="w-full" />
      </div>

      <h2>System Requirements</h2>
      <table>
        <thead>
          <tr><th>Component</th><th>Minimum</th><th>Recommended</th></tr>
        </thead>
        <tbody>
          <tr><td>CPU</td><td>2 cores</td><td>4+ cores</td></tr>
          <tr><td>RAM</td><td>4 GB</td><td>8+ GB</td></tr>
          <tr><td>Disk</td><td>2 GB free</td><td>10+ GB free</td></tr>
          <tr><td>Node.js</td><td>v24+ (auto-installed)</td><td>v24 via nvm</td></tr>
          <tr><td>Python</td><td>3.9+</td><td>3.11+</td></tr>
          <tr><td>PostgreSQL</td><td>v15+ (auto-installed)</td><td>v16</td></tr>
          <tr><td>Docker (optional)</td><td>v24+</td><td>v27+</td></tr>
          <tr><td>Network</td><td>Internet access for LLM APIs</td><td>Low-latency connection</td></tr>
        </tbody>
      </table>

      <h2>What the Setup Script Does</h2>
      <p>
        The <code>setup.sh</code> script automates the entire deployment in 9 steps. Every known
        deployment blocker from real testing is handled automatically — no manual SQL, no patching,
        no debugging required.
      </p>
      <table>
        <thead>
          <tr><th>Step</th><th>What It Does</th><th>Blocker It Prevents</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Pre-flight checks</td><td>Wrong Node.js version (needs 24+, not 20/22)</td></tr>
          <tr><td>2</td><td>Install AlphaClaw + Command Center CLI</td><td>Missing global packages</td></tr>
          <tr><td>3</td><td>Load environment</td><td>Missing API keys, weak gateway token</td></tr>
          <tr><td>4</td><td>Generate 21 agent workspaces</td><td>Missing SOUL.md / AGENTS.md files</td></tr>
          <tr><td>5</td><td>Apply AlphaClaw configuration</td><td>Stale config, wrong model provider URLs</td></tr>
          <tr><td>6</td><td>Start model-remapping proxy</td><td>gpt-4.1 not found, SSE streaming failures</td></tr>
          <tr><td>7</td><td>Set up PostgreSQL 16</td><td>NULLS NOT DISTINCT syntax error (PG 14)</td></tr>
          <tr><td>8</td><td>Bootstrap Command Center + register agents</td><td>DATABASE_URL collision, only 6/21 agents registered</td></tr>
          <tr><td>9</td><td>Start gateway + verify</td><td>Gateway not binding, health check timeout</td></tr>
        </tbody>
      </table>

      <h2>Platform-Specific Guides</h2>

      {/* Platform tabs */}
      <div className="flex flex-wrap gap-2 my-6 not-prose">
        {platformTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPlatform(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              platform === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {platform === "windows" && (
        <>
          <h3>Windows 11 Deployment</h3>
          <p>
            Windows deployment uses WSL2 (Windows Subsystem for Linux). This is the recommended
            approach since AlphaClaw and Command Center were designed for Linux/macOS environments.
          </p>
          <h4>Step 1: Enable WSL2</h4>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# Open PowerShell as Administrator
wsl --install -d Ubuntu-22.04

# Restart your computer, then open Ubuntu from Start menu`}
          </pre>
          <h4>Step 2: Install Python (inside WSL2)</h4>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`sudo apt update && sudo apt install -y python3 python3-pip curl git`}
          </pre>
          <h4>Step 3: Clone and Run Setup</h4>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
cp config/.env.template .env
nano .env  # Add your API keys

# Run the automated setup (installs Node 24, PostgreSQL 16, everything)
chmod +x scripts/setup.sh
./scripts/setup.sh laptop`}
          </pre>
          <p>
            The setup script will install Node.js 24 via nvm and PostgreSQL 16 automatically
            inside WSL2. Access the services from Windows at <code>http://localhost:18789</code> (Control UI)
            and <code>http://localhost:3001</code> (Command Center).
          </p>
        </>
      )}

      {platform === "mac" && (
        <>
          <h3>macOS Deployment</h3>
          <p>
            macOS provides a smooth deployment experience. The setup script handles Node.js 24
            and PostgreSQL 16 installation automatically.
          </p>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# 1. Ensure Python 3 and Git are available
# (macOS includes Python 3 and Git by default, or install via Homebrew)
brew install python3 git

# 2. Clone and configure
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
cp config/.env.template .env
# Edit .env with your API keys (nano .env or open with any editor)

# 3. Run the automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh laptop

# The script installs Node 24 via nvm, PostgreSQL 16 via Homebrew,
# and starts all services automatically.`}
          </pre>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 not-prose">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm text-slate-900">macOS Note</strong>
                <p className="text-sm mt-1 mb-0 text-slate-600">
                  If you have Homebrew's Node.js installed (e.g., node@22), the setup script will
                  install Node 24 via nvm alongside it. Make sure to run <code>nvm use 24</code> in
                  new terminal sessions, or add it to your shell profile.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {platform === "linux" && (
        <>
          <h3>Linux Deployment (Ubuntu/Debian)</h3>
          <p>
            Linux is the primary deployment target. The setup script handles everything including
            Node.js 24 and PostgreSQL 16 installation from official repositories.
          </p>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# 1. Ensure prerequisites
sudo apt update && sudo apt install -y python3 git curl

# 2. Clone and configure
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
cp config/.env.template .env
nano .env  # Add your API keys

# 3. Run the automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh laptop

# 4. Verify everything is running
./scripts/health-check.sh`}
          </pre>

          <h4>Running as a systemd Service (Optional)</h4>
          <p>
            For always-on operation, create systemd services for each component. After the initial
            setup, use the helper scripts for day-to-day management:
          </p>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# Day-to-day operations
./scripts/start-all.sh    # Start all services (after reboot)
./scripts/stop-all.sh     # Gracefully stop all services
./scripts/health-check.sh # Verify all services are running`}
          </pre>
        </>
      )}

      {platform === "cloud" && (
        <>
          <h3>Cloud Deployment (AWS / GCP / Azure)</h3>
          <p>
            For production deployments, a cloud VM provides reliability and always-on availability.
            Here are the recommended instance types:
          </p>
          <table>
            <thead>
              <tr><th>Provider</th><th>Instance Type</th><th>Specs</th><th>Est. Cost/Month</th></tr>
            </thead>
            <tbody>
              <tr><td>AWS</td><td><code>t3.medium</code></td><td>2 vCPU, 4 GB RAM</td><td>~$30</td></tr>
              <tr><td>GCP</td><td><code>e2-medium</code></td><td>2 vCPU, 4 GB RAM</td><td>~$25</td></tr>
              <tr><td>Azure</td><td><code>B2s</code></td><td>2 vCPU, 4 GB RAM</td><td>~$30</td></tr>
              <tr><td>DigitalOcean</td><td>Droplet (Regular)</td><td>2 vCPU, 4 GB RAM</td><td>~$24</td></tr>
              <tr><td>Hetzner</td><td><code>CX22</code></td><td>2 vCPU, 4 GB RAM</td><td>~$5</td></tr>
            </tbody>
          </table>

          <h4>Option A: Automated Setup on VM (Recommended)</h4>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# 1. SSH into your VM
ssh ubuntu@your-server-ip

# 2. Install prerequisites
sudo apt update && sudo apt install -y python3 git curl

# 3. Clone and configure
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
cp config/.env.template .env
nano .env  # Add your API keys

# 4. Run the automated setup
chmod +x scripts/setup.sh
./scripts/setup.sh laptop

# 5. Verify
./scripts/health-check.sh`}
          </pre>

          <h4>Option B: Docker Compose</h4>
          <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Clone and configure
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
cp config/.env.template .env
nano .env  # Add your API keys

# 3. Start with Docker Compose
./scripts/setup.sh cloud

# Note: Command Center is set up separately from Docker.
# The setup script handles this automatically.`}
          </pre>
        </>
      )}

      <h2>The Model Remapping Proxy</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 not-prose">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">Why the Proxy Exists</h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              AlphaClaw's internal slug-gen agent hardcodes <code className="text-xs bg-amber-100 px-1 rounded">openai/gpt-4.1</code> regardless
              of your configuration. If your LLM provider doesn't serve that exact model, agents will
              fail with "model not found" errors.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Additionally, some providers or proxy endpoints don't support SSE streaming. When AlphaClaw
              sends <code className="text-xs bg-amber-100 px-1 rounded">stream: true</code>, these providers return errors
              instead of streamed responses.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              The model proxy (<code className="text-xs bg-amber-100 px-1 rounded">proxy/model-proxy.py</code>, port 18792)
              solves both problems: it remaps model names and converts streaming responses. The setup
              script starts it automatically.
            </p>
          </div>
        </div>
      </div>

      <h2>Post-Deployment Verification</h2>
      <p>
        Run <code>./scripts/health-check.sh</code> to verify all services. The script checks:
      </p>
      <div className="space-y-3 my-6 not-prose">
        {[
          "PostgreSQL 16 running and accepting connections",
          "Model proxy responding on port 18792",
          "Command Center accessible on port 3001",
          "AlphaClaw Gateway healthy on port 18789",
          "All 21 agents registered in Command Center database",
          "Command Center can reach AlphaClaw gateway via WebSocket",
          "Model proxy responding to health checks",
          "Telegram bot token configured (if applicable)",
          "Config file permissions set to 600",
          "Gateway token is a secure random string (32+ hex chars)",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle size={16} className="text-teal-500 shrink-0 mt-0.5" />
            <span className="text-sm text-slate-800">{item}</span>
          </div>
        ))}
      </div>

      <h2>Security Hardening</h2>
      <table>
        <thead>
          <tr><th>Action</th><th>Command / Setting</th><th>Why</th></tr>
        </thead>
        <tbody>
          <tr><td>Restrict config permissions</td><td><code>chmod 600 ~/.alphaclaw/alphaclaw.json</code></td><td>Contains API keys</td></tr>
          <tr><td>Set strong gateway token</td><td><code>openssl rand -hex 32</code></td><td>Prevents unauthorized access</td></tr>
          <tr><td>Enable HITL for browser actions</td><td>Set <code>tools.web.hitl: true</code></td><td>Human approval for web actions</td></tr>
          <tr><td>Restrict agent tool access</td><td>Per-agent tool allowlists in config</td><td>Principle of least privilege</td></tr>
          <tr><td>Use HTTPS in production</td><td>Reverse proxy (Caddy/nginx)</td><td>Encrypt traffic</td></tr>
          <tr><td>Firewall model proxy</td><td>Bind to 127.0.0.1 only</td><td>Proxy should not be externally accessible</td></tr>
        </tbody>
      </table>
    </DocPage>
  );
}
