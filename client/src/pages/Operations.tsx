import DocPage from "@/components/DocPage";
import CodeBlock from "@/components/CodeBlock";
import { Settings } from "lucide-react";

export default function Operations() {
  return (
    <DocPage
      title="Operations"
      subtitle="Day-to-day management: monitoring, knowledge base updates, agent tuning, and scaling."
      icon={<Settings size={24} />}
      prevPage={{ path: "/command-center", label: "Command Center" }}
      nextPage={{ path: "/dependencies", label: "Dependencies" }}
    >
      <h2>Daily Operations</h2>
      <p>
        Once the system is deployed, day-to-day management involves monitoring agent health,
        updating the knowledge base, reviewing agent output quality, and adjusting configurations
        as needed. Use the included helper scripts for common operations.
      </p>

      <h3>Helper Scripts</h3>
      <table>
        <thead>
          <tr><th>Script</th><th>Purpose</th><th>When to Use</th></tr>
        </thead>
        <tbody>
          <tr><td><code>scripts/start-all.sh</code></td><td>Start all services in correct order</td><td>After system reboot</td></tr>
          <tr><td><code>scripts/stop-all.sh</code></td><td>Gracefully stop all services</td><td>Before maintenance</td></tr>
          <tr><td><code>scripts/health-check.sh</code></td><td>Verify all services are running</td><td>Daily check or after issues</td></tr>
          <tr><td><code>scripts/setup.sh laptop</code></td><td>Full automated setup</td><td>First-time deployment only</td></tr>
        </tbody>
      </table>

      <h3>Health Monitoring</h3>
      <p>
        The health check script verifies all services, processes, agent registration, and connectivity
        in a single command. Run it regularly or after any service restart.
      </p>
      <CodeBlock
        title="Health checks"
        code={`# Comprehensive health check (recommended)
./scripts/health-check.sh

# Quick manual checks
curl http://127.0.0.1:18789        # AlphaClaw Gateway
curl http://127.0.0.1:3001         # Command Center
curl http://127.0.0.1:18792/v1/models  # Model Proxy

# AlphaClaw CLI checks
alphaclaw health
alphaclaw agents list

# Check gateway logs
alphaclaw logs --limit 50 --plain`}
      />

      <h3>Key Metrics to Watch</h3>
      <table>
        <thead>
          <tr><th>Metric</th><th>Where to Find</th><th>Warning Threshold</th></tr>
        </thead>
        <tbody>
          <tr><td>Gateway uptime</td><td><code>alphaclaw health</code></td><td>Any downtime</td></tr>
          <tr><td>Agent response time</td><td>Gateway logs</td><td>&gt; 30 seconds</td></tr>
          <tr><td>Token usage per session</td><td>Command Center or gateway logs</td><td>Varies by task</td></tr>
          <tr><td>Error rate</td><td>Gateway logs</td><td>&gt; 5% of requests</td></tr>
          <tr><td>Proxy health</td><td><code>curl http://127.0.0.1:18792/</code></td><td>Any failure</td></tr>
        </tbody>
      </table>

      <h2>Knowledge Base Management</h2>
      <p>
        The knowledge base is the foundation of agent quality. Agents can only be as good as the
        context they have access to. Update these files regularly.
      </p>

      <h3>Update Schedule</h3>
      <table>
        <thead>
          <tr><th>Domain</th><th>Update Frequency</th><th>Updated By</th></tr>
        </thead>
        <tbody>
          <tr><td>Company overview</td><td>Quarterly or on major changes</td><td>Human operator</td></tr>
          <tr><td>Brand guidelines</td><td>On rebrand or voice changes</td><td>Human operator</td></tr>
          <tr><td>Product info</td><td>On feature releases or pricing changes</td><td>Human operator</td></tr>
          <tr><td>Market / ICP</td><td>Monthly</td><td>Competitive Intel Agent + human review</td></tr>
          <tr><td>Competitors</td><td>Monthly</td><td>Competitive Intel Agent + human review</td></tr>
          <tr><td>Active campaigns</td><td>Weekly</td><td>Campaign Producer Agent + human review</td></tr>
          <tr><td>Customer stories</td><td>On new case studies</td><td>Human operator</td></tr>
        </tbody>
      </table>

      <h3>How to Update</h3>
      <CodeBlock
        title="Updating knowledge base files"
        code={`# Edit the relevant markdown file
nano knowledge-base/company/overview.md

# Or use the onboarding playbook for structured updates
cat templates/onboarding/onboarding-playbook.md

# After updating, restart the gateway to pick up changes
./scripts/stop-all.sh
./scripts/start-all.sh`}
      />

      <h2>Agent Tuning</h2>
      <p>
        If an agent's output quality is not meeting expectations, there are several tuning options
        available, from simple prompt adjustments to model tier changes.
      </p>

      <h3>Tuning Options (Least to Most Disruptive)</h3>
      <table>
        <thead>
          <tr><th>Option</th><th>What to Change</th><th>When to Use</th></tr>
        </thead>
        <tbody>
          <tr><td>Add training examples</td><td><code>workspaces/[agent]/training/</code></td><td>Agent output format is wrong</td></tr>
          <tr><td>Update SOUL.md</td><td><code>workspaces/[agent]/SOUL.md</code></td><td>Agent behavior or tone is off</td></tr>
          <tr><td>Update AGENTS.md</td><td><code>workspaces/[agent]/AGENTS.md</code></td><td>Agent workflow or procedures need change</td></tr>
          <tr><td>Change model tier</td><td><code>alphaclaw.json</code> agent config</td><td>Agent needs more/less capability</td></tr>
          <tr><td>Add/remove tools</td><td><code>alphaclaw.json</code> agent tools</td><td>Agent needs new capabilities</td></tr>
          <tr><td>Restructure hierarchy</td><td>Multiple files + config</td><td>Fundamental workflow change</td></tr>
        </tbody>
      </table>

      <h2>Scaling</h2>
      <p>
        The system can be scaled in several ways depending on your needs.
      </p>

      <h3>Horizontal Scaling</h3>
      <p>
        Add more specialist agents for specific tasks. For example, if content creation is a bottleneck,
        add a second Content Writer Agent (<code>content-writer-2</code>) and update the Content & Brand Lead's
        delegation rules to load-balance between them.
      </p>

      <h3>Vertical Scaling</h3>
      <p>
        Upgrade model tiers for agents that need more capability. Moving a specialist from the Standard tier
        (claude-haiku-3.5) to the Leader tier (claude-sonnet-4) significantly improves output quality at
        higher cost.
      </p>

      <h2>Backup and Recovery</h2>
      <p>
        The system state is split between files (config, knowledge base, agent memory) and the
        Command Center PostgreSQL database (agent registry, task history, audit trail). Back up both.
      </p>
      <table>
        <thead>
          <tr><th>What to Back Up</th><th>Location</th><th>Frequency</th></tr>
        </thead>
        <tbody>
          <tr><td>Configuration</td><td><code>~/.alphaclaw/alphaclaw.json</code></td><td>On every change</td></tr>
          <tr><td>Knowledge base</td><td><code>knowledge-base/</code></td><td>Weekly</td></tr>
          <tr><td>Agent memory</td><td><code>workspaces/*/MEMORY.md</code></td><td>Weekly</td></tr>
          <tr><td>Environment variables</td><td><code>.env</code></td><td>On every change</td></tr>
          <tr><td>Command Center database</td><td>PostgreSQL <code>command-center</code> DB</td><td>Weekly</td></tr>
        </tbody>
      </table>
      <CodeBlock
        title="Simple backup script"
        code={`#!/bin/bash
BACKUP_DIR="backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"
cp ~/.alphaclaw/alphaclaw.json "$BACKUP_DIR/"
cp -r knowledge-base/ "$BACKUP_DIR/"
cp .env "$BACKUP_DIR/"
find workspaces/ -name "MEMORY.md" -exec cp --parents {} "$BACKUP_DIR/" \\;

# Back up Command Center database
pg_dump -p 5432 -U command-center command-center > "$BACKUP_DIR/command-center.sql"

echo "Backup saved to $BACKUP_DIR"`}
      />

      <h2>Shutdown and Restart</h2>
      <CodeBlock
        title="Clean shutdown and restart"
        code={`# Graceful shutdown of all services
./scripts/stop-all.sh

# Restart all services
./scripts/start-all.sh

# Verify everything is healthy
./scripts/health-check.sh`}
      />

      <h2>Log Locations</h2>
      <table>
        <thead>
          <tr><th>Service</th><th>Log File</th></tr>
        </thead>
        <tbody>
          <tr><td>AlphaClaw Gateway</td><td><code>/tmp/outclaw-gateway.log</code></td></tr>
          <tr><td>Command Center</td><td><code>/tmp/outclaw-command-center.log</code></td></tr>
          <tr><td>Model Proxy</td><td><code>/tmp/outclaw-model-proxy.log</code></td></tr>
        </tbody>
      </table>
    </DocPage>
  );
}
