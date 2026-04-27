/*
 * Outclaw — Dependencies Page
 * Updated with 21-agent descriptive naming, correct tier names, Claude/GPT/Gemini
 */
import { Package } from "lucide-react";
import DocPage from "@/components/DocPage";

export default function Dependencies() {
  return (
    <DocPage
      title="Dependencies"
      subtitle="Every dependency required by Outclaw, with verified versions and installation commands."
      icon={<Package size={24} />}
      prevPage={{ path: "/operations", label: "Operations" }}
      nextPage={{ path: "/troubleshooting", label: "Troubleshooting" }}
    >
      <h2>Core Dependencies</h2>
      <p>
        These are the essential dependencies required for any deployment mode. All versions listed
        were verified during our actual deployment.
      </p>
      <table>
        <thead>
          <tr><th>Dependency</th><th>Verified Version</th><th>Purpose</th><th>Install Command</th></tr>
        </thead>
        <tbody>
          <tr><td>Node.js</td><td>24.x</td><td>AlphaClaw runtime</td><td><code>nvm install 24</code> (auto-installed by setup.sh)</td></tr>
          <tr><td>npm</td><td>10.9.2</td><td>Package manager</td><td>Comes with Node.js</td></tr>
          <tr><td>AlphaClaw</td><td>latest</td><td>Agent framework + management harness</td><td><code>npm install -g @outmarkhq/alphaclaw</code></td></tr>
          <tr><td>Python</td><td>3.9+</td><td>Model remapping proxy, browser-harness, scripts</td><td>python.org or system package manager</td></tr>
          <tr><td>browser-harness</td><td>latest</td><td>CDP-based browser access for all agents</td><td><code>pip install browser-harness</code></td></tr>
          <tr><td>Git</td><td>2.43.0</td><td>Version control</td><td>git-scm.com</td></tr>
        </tbody>
      </table>

      <h2>Python Dependencies (Model Remapping Proxy)</h2>
      <p>
        The model remapping proxy uses only Python standard library modules — no pip packages required.
        This was a deliberate design choice to minimize the dependency footprint.
      </p>
      <table>
        <thead>
          <tr><th>Module</th><th>Source</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td><code>http.server</code></td><td>stdlib</td><td>HTTP server for the proxy</td></tr>
          <tr><td><code>urllib.request</code></td><td>stdlib</td><td>Upstream API calls</td></tr>
          <tr><td><code>json</code></td><td>stdlib</td><td>Request/response parsing</td></tr>
          <tr><td><code>threading</code></td><td>stdlib</td><td>Concurrent request handling</td></tr>
        </tbody>
      </table>

      <h2>Docker Dependencies (Cloud Mode Only)</h2>
      <table>
        <thead>
          <tr><th>Dependency</th><th>Minimum Version</th><th>Purpose</th></tr>
        </thead>
        <tbody>
          <tr><td>Docker Engine</td><td>24.0+</td><td>Container runtime</td></tr>
          <tr><td>Docker Compose</td><td>v2.20+</td><td>Multi-container orchestration</td></tr>
        </tbody>
      </table>

      <h2>Command Center</h2>
      <p>
        The Command Center is the management dashboard for Outclaw. It is set up after the
        AlphaClaw gateway is running.
        See the <a href="/command-center">Command Center</a> page for the full architecture.
      </p>
      <table>
        <thead>
          <tr><th>Dependency</th><th>Notes</th></tr>
        </thead>
        <tbody>
          <tr><td>Node.js</td><td>Same as AlphaClaw — no additional install</td></tr>
          <tr><td>Database</td><td>Auto-configured during Command Center onboard</td></tr>
          <tr><td>Docker (optional)</td><td>For self-hosted Command Center via Docker image</td></tr>
        </tbody>
      </table>

      <h2>LLM Provider Requirements</h2>
      <p>
        Outclaw requires at least one LLM provider with an OpenAI-compatible API. The three-tier
        model strategy is recommended but not required — you can use a single model for all agents.
      </p>
      <table>
        <thead>
          <tr><th>Tier</th><th>Claude</th><th>GPT</th><th>Gemini</th><th>Used By</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader</td><td>claude-opus-4</td><td>gpt-4.1</td><td>gemini-2.5-pro</td><td>Chief Marketing Agent, Sub-Function Leads (4 agents)</td></tr>
          <tr><td>Advanced</td><td>claude-sonnet-4</td><td>gpt-4.1-mini</td><td>gemini-2.5-flash</td><td>Campaign Producer, Marketing Ops (2 agents)</td></tr>
          <tr><td>Standard</td><td>claude-haiku-3.5</td><td>gpt-4.1-nano</td><td>gemini-2.5-flash</td><td>All 15 Specialist Agents</td></tr>
        </tbody>
      </table>

      <h2>Network Requirements</h2>
      <table>
        <thead>
          <tr><th>Port</th><th>Service</th><th>Configurable</th></tr>
        </thead>
        <tbody>
          <tr><td>18789</td><td>AlphaClaw Gateway + Control UI</td><td>Yes, in alphaclaw.json</td></tr>
          <tr><td>18792</td><td>Model remapping proxy</td><td>Yes, via PROXY_PORT env var</td></tr>
          <tr><td>3001</td><td>Command Center Dashboard</td><td>Yes, via COMMAND_CENTER_PORT env var</td></tr>
          <tr><td>5432</td><td>PostgreSQL (Command Center database)</td><td>Yes, via PG_PORT env var</td></tr>
          <tr><td>9222</td><td>Chrome CDP (browser-harness)</td><td>Yes, via BROWSER_CDP_PORT env var</td></tr>
        </tbody>
      </table>

      <h2>Platform-Specific Notes</h2>
      <table>
        <thead>
          <tr><th>Platform</th><th>Additional Requirements</th></tr>
        </thead>
        <tbody>
          <tr><td>Windows 11</td><td>WSL2 recommended. PowerShell execution policy may need adjustment.</td></tr>
          <tr><td>macOS</td><td>Homebrew recommended for dependency management. Works natively.</td></tr>
          <tr><td>Linux (Ubuntu/Debian)</td><td>Node 24 auto-installed via nvm. Works natively.</td></tr>
          <tr><td>AWS/GCP/Azure</td><td>t3.medium / e2-medium / B2s instance minimum. Docker recommended.</td></tr>
        </tbody>
      </table>

      <h2>Verification Script</h2>
      <p>
        Run this script to check if all dependencies are installed and at the correct versions:
      </p>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-4">
{`#!/bin/bash
echo "=== Outclaw Dependency Check ==="
echo ""

# Node.js
if command -v node &> /dev/null; then
  echo "✓ Node.js $(node --version)"
  NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VER" -lt 24 ]; then
    echo "  ⚠ Node.js 24+ required (run: nvm install 24)"
  fi
else
  echo "✗ Node.js not found"
fi

# npm
if command -v npm &> /dev/null; then
  echo "✓ npm $(npm --version)"
else
  echo "✗ npm not found"
fi

# AlphaClaw
if command -v alphaclaw &> /dev/null; then
  echo "✓ AlphaClaw $(alphaclaw --version 2>&1 | head -1)"
else
  echo "✗ AlphaClaw not found (run: npm install -g @outmarkhq/alphaclaw)"
fi

# browser-harness
if python3 -c "import browser_harness" 2>/dev/null; then
  echo "✓ browser-harness installed"
else
  echo "✗ browser-harness not found (run: pip install browser-harness)"
fi

# Python
if command -v python3 &> /dev/null; then
  echo "✓ Python $(python3 --version)"
else
  echo "✗ Python 3 not found"
fi

# Git
if command -v git &> /dev/null; then
  echo "✓ Git $(git --version)"
else
  echo "✗ Git not found"
fi

# Docker (optional)
if command -v docker &> /dev/null; then
  echo "✓ Docker $(docker --version)"
else
  echo "○ Docker not found (optional, only for cloud mode)"
fi

echo ""
echo "=== Done ==="`}
      </pre>
    </DocPage>
  );
}
