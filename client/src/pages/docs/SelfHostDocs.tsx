import {
  ArrowLeft,
  ArrowRight,
  Brain,
  ChevronRight,
  Cloud,
  Code,
  Container,
  Database,
  Download,
  Globe,
  Key,
  Layers,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type DocSection = {
  id: string;
  title: string;
  icon: typeof Brain;
  group?: string;
  content: React.ReactNode;
};

function DocNav({
  sections,
  activeId,
  onSelect,
}: {
  sections: DocSection[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  let lastGroup = "";
  return (
    <nav className="space-y-0.5">
      {sections.map((s) => {
        const Icon = s.icon;
        const isActive = activeId === s.id;
        const showGroup = s.group && s.group !== lastGroup;
        if (s.group) lastGroup = s.group;
        return (
          <div key={s.id}>
            {showGroup && (
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F5F1E8]/25 mt-5 mb-2 px-3">
                {s.group}
              </div>
            )}
            <button
              onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-all ${
                isActive
                  ? "bg-[#F5C542]/10 text-[#F5C542] font-medium"
                  : "text-[#F5F1E8]/40 hover:text-[#F5F1E8]/60 hover:bg-[#F5F1E8]/[0.03]"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {s.title}
            </button>
          </div>
        );
      })}
    </nav>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group my-4">
      {title && (
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#F5F1E8]/30 mb-1.5 px-1">
          {title}
        </div>
      )}
      <pre className="bg-[#0B0D0F] border border-[#F5F1E8]/10 p-4 overflow-x-auto text-sm font-mono text-[#F5F1E8]/65 leading-relaxed">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-wider text-[#F5F1E8]/20 hover:text-[#F5C542] transition-colors opacity-0 group-hover:opacity-100 bg-[#0B0D0F] px-2 py-1 border border-[#F5F1E8]/10"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-[#F5C542]/30 bg-[#F5C542]/5",
    warning: "border-red-400/30 bg-red-400/5",
    tip: "border-emerald-400/30 bg-emerald-400/5",
  };
  const labels = { info: "Note", warning: "Warning", tip: "Tip" };
  const labelColors = {
    info: "text-[#F5C542]",
    warning: "text-red-400",
    tip: "text-emerald-400",
  };
  return (
    <div className={`border-l-3 ${styles[type]} p-4 my-4`}>
      <div
        className={`text-[10px] font-mono uppercase tracking-[0.15em] ${labelColors[type]} mb-1.5`}
      >
        {labels[type]}
      </div>
      <div className="text-sm text-[#F5F1E8]/55 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl tracking-tight mb-3 text-[#F5F1E8]"
      style={{ fontFamily: "var(--font-heading)", fontWeight: 300 }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-[#F5F1E8]/85 mt-6 mb-2">
      {children}
    </h3>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-[#F5F1E8]/50 leading-relaxed mb-4">
      {children}
    </p>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto my-4 border border-[#F5F1E8]/8">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-2.5 px-3 text-[#F5F1E8]/50 font-mono text-[11px] uppercase tracking-wider bg-[#0B0D0F]">
      {children}
    </th>
  );
}

function Td({
  children,
  mono,
}: {
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <td
      className={`py-2.5 px-3 text-[#F5F1E8]/45 border-t border-[#F5F1E8]/6 ${mono ? "font-mono text-[#F5F1E8]/55" : ""}`}
    >
      {children}
    </td>
  );
}

/* ── Sections ── */

const sections: DocSection[] = [
  /* ── Getting Started ── */
  {
    id: "introduction",
    title: "Introduction",
    icon: Layers,
    group: "Getting Started",
    content: (
      <div className="space-y-4">
        <SectionHeading>Self-Hosted Outclaw</SectionHeading>
        <Paragraph>
          Outclaw is an open-source AI marketing command center built on the
          MKT1 team structure. The self-hosted edition gives you the same
          21-agent orchestration pipeline, GACCS brief system, and multi-provider
          LLM support — running entirely on your own infrastructure.
        </Paragraph>
        <Paragraph>
          Powered by{" "}
          <a
            href="https://github.com/chrysb/alphaclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C542] hover:underline"
          >
            AlphaClaw
          </a>{" "}
          for agent orchestration and{" "}
          <a
            href="https://github.com/browser-use/browser-harness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C542] hover:underline"
          >
            browser-harness
          </a>{" "}
          for native web access, every agent can research, monitor, and interact
          with the web autonomously.
        </Paragraph>

        <SubHeading>Why self-host?</SubHeading>
        <ul className="space-y-2 text-sm text-[#F5F1E8]/45 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">01</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Complete data ownership.</strong>{" "}
              All marketing briefs, agent outputs, and knowledge base content
              stay on your servers.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">02</span>
            <span>
              <strong className="text-[#F5F1E8]/75">No vendor lock-in.</strong>{" "}
              Bring your own LLM keys. Switch providers at any time. No
              per-seat pricing from us.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">03</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Full customization.</strong>{" "}
              Modify agent prompts, add new agents, change the team structure,
              or rebrand entirely.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">04</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Compliance-ready.</strong>{" "}
              Meet data residency requirements. Run behind your firewall. Audit
              everything.
            </span>
          </li>
        </ul>

        <SubHeading>SaaS vs Self-Hosted</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Feature</Th>
              <Th>Cloud (SaaS)</Th>
              <Th>Self-Hosted</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Setup time</Td>
              <Td>5 minutes</Td>
              <Td>30–60 minutes</Td>
            </tr>
            <tr>
              <Td>Infrastructure</Td>
              <Td>Managed by Outmark</Td>
              <Td>You manage</Td>
            </tr>
            <tr>
              <Td>Data location</Td>
              <Td>Outmark servers</Td>
              <Td>Your servers</Td>
            </tr>
            <tr>
              <Td>Updates</Td>
              <Td>Automatic</Td>
              <Td>Manual (git pull)</Td>
            </tr>
            <tr>
              <Td>Multi-tenant</Td>
              <Td>Yes (workspaces)</Td>
              <Td>Single-tenant</Td>
            </tr>
            <tr>
              <Td>LLM keys</Td>
              <Td>Bring your own</Td>
              <Td>Bring your own</Td>
            </tr>
            <tr>
              <Td>Enterprise features</Td>
              <Td>Included</Td>
              <Td>Separate license</Td>
            </tr>
          </tbody>
        </TableWrap>
      </div>
    ),
  },
  {
    id: "requirements",
    title: "Requirements",
    icon: Settings,
    group: "Getting Started",
    content: (
      <div className="space-y-4">
        <SectionHeading>System Requirements</SectionHeading>
        <Paragraph>
          Before you begin, ensure your server meets the following minimum
          requirements.
        </Paragraph>

        <SubHeading>Hardware</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Resource</Th>
              <Th>Minimum</Th>
              <Th>Recommended</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>CPU</Td>
              <Td mono>2 vCPU</Td>
              <Td mono>4 vCPU</Td>
            </tr>
            <tr>
              <Td>RAM</Td>
              <Td mono>2 GB</Td>
              <Td mono>4 GB</Td>
            </tr>
            <tr>
              <Td>Storage</Td>
              <Td mono>20 GB SSD</Td>
              <Td mono>40 GB SSD</Td>
            </tr>
          </tbody>
        </TableWrap>
        <Callout type="info">
          Outclaw itself is lightweight. The heavy computation happens at your
          LLM provider. A modest VPS handles most teams comfortably.
        </Callout>

        <SubHeading>Software</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Software</Th>
              <Th>Version</Th>
              <Th>Purpose</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Node.js</Td>
              <Td mono>18+</Td>
              <Td>Application runtime</Td>
            </tr>
            <tr>
              <Td>pnpm</Td>
              <Td mono>8+</Td>
              <Td>Package manager</Td>
            </tr>
            <tr>
              <Td>MySQL or TiDB</Td>
              <Td mono>8+</Td>
              <Td>Database</Td>
            </tr>
            <tr>
              <Td>Docker (optional)</Td>
              <Td mono>24+</Td>
              <Td>Container deployment</Td>
            </tr>
            <tr>
              <Td>Git</Td>
              <Td mono>2+</Td>
              <Td>Version control</Td>
            </tr>
          </tbody>
        </TableWrap>

        <SubHeading>API keys you will need</SubHeading>
        <Paragraph>
          Outclaw requires at least one LLM provider API key. We recommend
          configuring two tiers: a top-tier model for leadership agents (CMA and
          function heads) and a cost-effective model for specialists.
        </Paragraph>
        <TableWrap>
          <thead>
            <tr>
              <Th>Provider</Th>
              <Th>Recommended Model</Th>
              <Th>Agent Tier</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>OpenAI</Td>
              <Td mono>gpt-4o</Td>
              <Td>Leaders</Td>
            </tr>
            <tr>
              <Td>Anthropic</Td>
              <Td mono>claude-3.5-sonnet</Td>
              <Td>Leaders</Td>
            </tr>
            <tr>
              <Td>OpenAI</Td>
              <Td mono>gpt-4o-mini</Td>
              <Td>Specialists</Td>
            </tr>
            <tr>
              <Td>Anthropic</Td>
              <Td mono>claude-3-haiku</Td>
              <Td>Specialists</Td>
            </tr>
          </tbody>
        </TableWrap>
      </div>
    ),
  },

  /* ── Deployment ── */
  {
    id: "linux-vm",
    title: "Linux VM",
    icon: Terminal,
    group: "Deployment",
    content: (
      <div className="space-y-4">
        <SectionHeading>Deploy on Linux VM</SectionHeading>
        <Paragraph>
          The simplest deployment method. Clone the repository, configure your
          environment, and start the server.
        </Paragraph>

        <SubHeading>1. Clone the repository</SubHeading>
        <CodeBlock>{`git clone https://github.com/outmarkhq/outclaw.git
cd outclaw`}</CodeBlock>

        <SubHeading>2. Install dependencies</SubHeading>
        <CodeBlock>{`pnpm install`}</CodeBlock>

        <SubHeading>3. Configure environment</SubHeading>
        <CodeBlock>{`cp .env.example .env`}</CodeBlock>
        <Paragraph>
          Edit <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env</code> with
          your database URL, JWT secret, and LLM provider keys. See the{" "}
          <button className="text-[#F5C542] hover:underline">
            Environment Variables
          </button>{" "}
          section for the full reference.
        </Paragraph>

        <SubHeading>4. Set up the database</SubHeading>
        <CodeBlock>{`pnpm db:push`}</CodeBlock>

        <SubHeading>5. Install browser-harness</SubHeading>
        <CodeBlock>{`npx browser-harness install`}</CodeBlock>
        <Callout type="info">
          browser-harness gives every agent the ability to browse, research, and
          interact with the web. It requires a Chromium-based browser on the
          server.
        </Callout>

        <SubHeading>6. Build and start</SubHeading>
        <CodeBlock>{`pnpm build
NODE_ENV=production node dist/index.js`}</CodeBlock>

        <SubHeading>7. Set up a process manager</SubHeading>
        <Paragraph>
          For production, use a process manager like PM2 to keep the server
          running and restart on crashes.
        </Paragraph>
        <CodeBlock>{`npm install -g pm2
pm2 start dist/index.js --name outclaw
pm2 save
pm2 startup`}</CodeBlock>

        <SubHeading>8. Configure reverse proxy</SubHeading>
        <Paragraph>
          Use Nginx or Caddy as a reverse proxy with SSL termination.
        </Paragraph>
        <CodeBlock title="Nginx configuration">{`server {
    listen 80;
    server_name command.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name command.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/command.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/command.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</CodeBlock>
      </div>
    ),
  },
  {
    id: "docker",
    title: "Docker",
    icon: Container,
    group: "Deployment",
    content: (
      <div className="space-y-4">
        <SectionHeading>Deploy with Docker</SectionHeading>
        <Paragraph>
          The recommended deployment method for most teams. Docker Compose
          handles the application, database, and browser-harness in a single
          configuration.
        </Paragraph>

        <SubHeading>1. Clone the repository</SubHeading>
        <CodeBlock>{`git clone https://github.com/outmarkhq/outclaw.git
cd outclaw`}</CodeBlock>

        <SubHeading>2. Configure environment</SubHeading>
        <CodeBlock>{`cp .env.example .env`}</CodeBlock>
        <Paragraph>
          Edit <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env</code> with
          your LLM provider keys, database credentials, and JWT secret.
        </Paragraph>

        <SubHeading>3. Start with Docker Compose</SubHeading>
        <CodeBlock>{`docker compose up -d`}</CodeBlock>
        <Paragraph>
          This starts three services: the Outclaw application, a MySQL database,
          and a browser-harness sidecar for agent web access.
        </Paragraph>

        <SubHeading>4. Run database migrations</SubHeading>
        <CodeBlock>{`docker compose exec app pnpm db:push`}</CodeBlock>

        <SubHeading>5. Verify the deployment</SubHeading>
        <CodeBlock>{`# Check service health
docker compose ps

# View application logs
docker compose logs -f app`}</CodeBlock>
        <Paragraph>
          Open <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">http://localhost:3000</code> in
          your browser. You should see the Outclaw onboarding screen.
        </Paragraph>

        <SubHeading>Docker Compose reference</SubHeading>
        <CodeBlock title="docker-compose.yml">{`version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db
      - browser
    restart: unless-stopped

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: outclaw
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

  browser:
    image: browseruse/browser-harness:latest
    ports:
      - "9222:9222"
    restart: unless-stopped

volumes:
  db_data:`}</CodeBlock>

        <Callout type="tip">
          For production, add a reverse proxy (Nginx or Caddy) in front of the
          app service for SSL termination. See the Linux VM section for an Nginx
          configuration example.
        </Callout>
      </div>
    ),
  },
  {
    id: "cloud",
    title: "Cloud Providers",
    icon: Cloud,
    group: "Deployment",
    content: (
      <div className="space-y-4">
        <SectionHeading>Deploy on Cloud Providers</SectionHeading>
        <Paragraph>
          Outclaw can be deployed on any cloud provider that supports Docker or
          Node.js. Below are quick-start guides for the most common platforms.
        </Paragraph>

        <SubHeading>AWS (EC2 + RDS)</SubHeading>
        <Paragraph>
          Launch an EC2 instance (t3.small or larger), install Docker, clone the
          repository, and use Docker Compose. For the database, use Amazon RDS
          for MySQL with the connection string in your{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">DATABASE_URL</code>.
        </Paragraph>

        <SubHeading>DigitalOcean (Droplet)</SubHeading>
        <Paragraph>
          Create a Droplet with the Docker marketplace image. SSH in, clone the
          repository, configure your{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env</code>, and run{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">docker compose up -d</code>.
          Use a managed MySQL database for production.
        </Paragraph>

        <SubHeading>Google Cloud Platform</SubHeading>
        <Paragraph>
          Deploy on Cloud Run with Cloud SQL for MySQL. Build the Docker image,
          push to Artifact Registry, and deploy with the DATABASE_URL pointing
          to your Cloud SQL instance.
        </Paragraph>

        <SubHeading>Hetzner</SubHeading>
        <Paragraph>
          Hetzner offers excellent value for self-hosted deployments. A CX21 (2
          vCPU, 4GB RAM) at approximately $5/month handles most teams. Follow
          the Linux VM deployment guide.
        </Paragraph>

        <Callout type="info">
          Regardless of cloud provider, always enable SSL, use a managed
          database for production, and configure automated backups.
        </Callout>
      </div>
    ),
  },

  /* ── Configuration ── */
  {
    id: "env-vars",
    title: "Environment Variables",
    icon: Key,
    group: "Configuration",
    content: (
      <div className="space-y-4">
        <SectionHeading>Environment Variables</SectionHeading>
        <Paragraph>
          All configuration is managed through environment variables. Copy{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env.example</code> to{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env</code> and update
          the values.
        </Paragraph>

        <SubHeading>Required</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Variable</Th>
              <Th>Description</Th>
              <Th>Example</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td mono>DATABASE_URL</Td>
              <Td>MySQL connection string</Td>
              <Td mono>mysql://user:pass@host:3306/outclaw</Td>
            </tr>
            <tr>
              <Td mono>JWT_SECRET</Td>
              <Td>Session signing secret (min 32 chars)</Td>
              <Td mono>your-random-secret-here</Td>
            </tr>
            <tr>
              <Td mono>OPENAI_API_KEY</Td>
              <Td>OpenAI API key (or other LLM provider)</Td>
              <Td mono>sk-...</Td>
            </tr>
          </tbody>
        </TableWrap>

        <SubHeading>LLM Providers</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Variable</Th>
              <Th>Description</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td mono>OPENAI_API_KEY</Td>
              <Td>OpenAI API key</Td>
            </tr>
            <tr>
              <Td mono>ANTHROPIC_API_KEY</Td>
              <Td>Anthropic API key</Td>
            </tr>
            <tr>
              <Td mono>GOOGLE_AI_API_KEY</Td>
              <Td>Google AI (Gemini) API key</Td>
            </tr>
            <tr>
              <Td mono>LLM_LEADER_MODEL</Td>
              <Td>Model for CMA and function heads (default: gpt-4o)</Td>
            </tr>
            <tr>
              <Td mono>LLM_SPECIALIST_MODEL</Td>
              <Td>Model for specialist agents (default: gpt-4o-mini)</Td>
            </tr>
          </tbody>
        </TableWrap>

        <SubHeading>Optional</SubHeading>
        <TableWrap>
          <thead>
            <tr>
              <Th>Variable</Th>
              <Th>Description</Th>
              <Th>Default</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td mono>PORT</Td>
              <Td>Application port</Td>
              <Td mono>3000</Td>
            </tr>
            <tr>
              <Td mono>NODE_ENV</Td>
              <Td>Environment mode</Td>
              <Td mono>production</Td>
            </tr>
            <tr>
              <Td mono>BROWSER_HARNESS_URL</Td>
              <Td>browser-harness CDP endpoint</Td>
              <Td mono>ws://localhost:9222</Td>
            </tr>
            <tr>
              <Td mono>SMTP_HOST</Td>
              <Td>Email server for notifications</Td>
              <Td>—</Td>
            </tr>
            <tr>
              <Td mono>SMTP_PORT</Td>
              <Td>Email server port</Td>
              <Td mono>587</Td>
            </tr>
            <tr>
              <Td mono>TELEGRAM_BOT_TOKEN</Td>
              <Td>Telegram channel integration</Td>
              <Td>—</Td>
            </tr>
            <tr>
              <Td mono>SLACK_BOT_TOKEN</Td>
              <Td>Slack channel integration</Td>
              <Td>—</Td>
            </tr>
          </tbody>
        </TableWrap>

        <Callout type="warning">
          Never commit your <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.env</code> file
          to version control. The{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">.gitignore</code> is
          pre-configured to exclude it.
        </Callout>
      </div>
    ),
  },
  {
    id: "database",
    title: "Database Setup",
    icon: Database,
    group: "Configuration",
    content: (
      <div className="space-y-4">
        <SectionHeading>Database Setup</SectionHeading>
        <Paragraph>
          Outclaw uses MySQL (or TiDB) with Drizzle ORM. The schema is managed
          through migrations.
        </Paragraph>

        <SubHeading>Create the database</SubHeading>
        <CodeBlock>{`mysql -u root -p -e "CREATE DATABASE outclaw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`}</CodeBlock>

        <SubHeading>Create a dedicated user</SubHeading>
        <CodeBlock>{`mysql -u root -p -e "
  CREATE USER 'outclaw'@'%' IDENTIFIED BY 'your-secure-password';
  GRANT ALL PRIVILEGES ON outclaw.* TO 'outclaw'@'%';
  FLUSH PRIVILEGES;
"`}</CodeBlock>

        <SubHeading>Run migrations</SubHeading>
        <CodeBlock>{`pnpm db:push`}</CodeBlock>
        <Paragraph>
          This generates and applies all schema migrations. Run this command
          after every update.
        </Paragraph>

        <SubHeading>Connection string format</SubHeading>
        <CodeBlock>{`DATABASE_URL=mysql://outclaw:your-secure-password@localhost:3306/outclaw`}</CodeBlock>

        <Callout type="tip">
          For production, use a managed database service (Amazon RDS,
          PlanetScale, TiDB Cloud) with automated backups and SSL enabled.
        </Callout>

        <SubHeading>Backup</SubHeading>
        <CodeBlock>{`# Manual backup
mysqldump -u outclaw -p outclaw > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
0 2 * * * mysqldump -u outclaw -p'password' outclaw > /backups/outclaw_$(date +\\%Y\\%m\\%d).sql`}</CodeBlock>
      </div>
    ),
  },

  /* ── Customization ── */
  {
    id: "customization",
    title: "Customization",
    icon: Code,
    group: "Customization",
    content: (
      <div className="space-y-4">
        <SectionHeading>Customization</SectionHeading>
        <Paragraph>
          Outclaw is designed to be modified. The most common customizations
          require no code changes — just database updates through the Settings
          UI.
        </Paragraph>

        <SubHeading>Modifying agent system prompts</SubHeading>
        <Paragraph>
          Each agent has a system prompt that defines its personality, expertise,
          and behavior. Edit these through the Command Center Settings page or
          directly in the database. Changes take effect on the next task
          assignment.
        </Paragraph>

        <SubHeading>Adding new agents</SubHeading>
        <Paragraph>
          Insert new rows into the agents table with the appropriate
          sub-function, tier, and system prompt. The orchestration pipeline
          automatically includes new agents in the routing logic. The CMA will
          consider them when delegating tasks.
        </Paragraph>

        <SubHeading>Changing the team structure</SubHeading>
        <Paragraph>
          The three sub-functions (Product Marketing, Content & Brand, Growth
          Marketing) are defined in the agent configuration. You can rename
          them, add new sub-functions, or reorganize agents by updating the
          database records.
        </Paragraph>

        <SubHeading>Branding</SubHeading>
        <Paragraph>
          Update the theme in{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">
            client/src/index.css
          </code>
          , replace the logo in{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">
            client/index.html
          </code>
          , and update the app title. The entire UI is built with Tailwind CSS
          and CSS variables, making global theme changes straightforward.
        </Paragraph>

        <SubHeading>Adding LLM providers</SubHeading>
        <Paragraph>
          Outclaw supports any OpenAI-compatible API. To add a custom provider,
          set the base URL and API key in your environment variables. The
          provider will be available in the Settings UI for assignment to agent
          tiers.
        </Paragraph>
      </div>
    ),
  },

  /* ── Security ── */
  {
    id: "security",
    title: "Security",
    icon: Shield,
    group: "Security",
    content: (
      <div className="space-y-4">
        <SectionHeading>Security</SectionHeading>
        <Paragraph>
          Security best practices for production self-hosted deployments.
        </Paragraph>

        <SubHeading>HTTPS</SubHeading>
        <Paragraph>
          Always use HTTPS in production. Use Let's Encrypt with your reverse
          proxy for free SSL certificates. Outclaw sets secure cookie flags
          automatically when running behind HTTPS.
        </Paragraph>

        <SubHeading>API key storage</SubHeading>
        <Paragraph>
          LLM API keys are stored encrypted in the database. They are only
          decrypted server-side when making LLM calls. Keys are never exposed to
          the frontend or included in API responses.
        </Paragraph>

        <SubHeading>Authentication</SubHeading>
        <Paragraph>
          The self-hosted edition uses JWT-based session authentication. Set a
          strong, unique{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">JWT_SECRET</code> (minimum
          32 characters). Sessions expire after 30 days by default.
        </Paragraph>

        <SubHeading>Database access</SubHeading>
        <Paragraph>
          Use a dedicated database user with minimal privileges. Enable SSL for
          database connections. Restrict network access to the database port.
          Regularly back up your data.
        </Paragraph>

        <SubHeading>Firewall</SubHeading>
        <CodeBlock>{`# Allow only HTTP, HTTPS, and SSH
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable`}</CodeBlock>

        <Callout type="warning">
          Do not expose the database port (3306) or browser-harness port (9222)
          to the public internet. These should only be accessible from the
          application server.
        </Callout>
      </div>
    ),
  },

  /* ── Maintenance ── */
  {
    id: "upgrade",
    title: "Upgrade Guide",
    icon: RefreshCw,
    group: "Maintenance",
    content: (
      <div className="space-y-4">
        <SectionHeading>Upgrade Guide</SectionHeading>
        <Paragraph>
          Outclaw follows semantic versioning. Updates are published to the
          GitHub repository. We recommend checking for updates at least monthly.
        </Paragraph>

        <SubHeading>Standard upgrade (Linux VM)</SubHeading>
        <CodeBlock>{`cd outclaw

# Pull latest changes
git pull origin main

# Install new dependencies
pnpm install

# Run database migrations
pnpm db:push

# Rebuild the application
pnpm build

# Restart the server
pm2 restart outclaw`}</CodeBlock>

        <SubHeading>Docker upgrade</SubHeading>
        <CodeBlock>{`cd outclaw

# Pull latest changes
git pull origin main

# Rebuild and restart containers
docker compose down
docker compose build
docker compose up -d

# Run database migrations
docker compose exec app pnpm db:push`}</CodeBlock>

        <SubHeading>Checking your version</SubHeading>
        <Paragraph>
          The current version is displayed in the Command Center Settings page
          and in the{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">package.json</code> file.
        </Paragraph>

        <Callout type="warning">
          Always back up your database before upgrading. While we test
          migrations thoroughly, it is good practice to have a rollback point.
        </Callout>

        <SubHeading>Compatibility</SubHeading>
        <Paragraph>
          Outclaw is designed to remain compatible with future versions of{" "}
          <a
            href="https://github.com/chrysb/alphaclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C542] hover:underline"
          >
            AlphaClaw
          </a>
          ,{" "}
          <a
            href="https://github.com/browser-use/browser-harness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F5C542] hover:underline"
          >
            browser-harness
          </a>
          , and OpenClaw. Dependency versions are pinned in{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">package.json</code> and
          tested against the latest releases before each Outclaw update.
        </Paragraph>
      </div>
    ),
  },

  /* ── Enterprise ── */
  {
    id: "enterprise",
    title: "Enterprise Edition",
    icon: Sparkles,
    group: "Others",
    content: (
      <div className="space-y-4">
        <SectionHeading>Enterprise Edition</SectionHeading>
        <Paragraph>
          Outclaw Enterprise Edition is a proprietary version designed for larger
          organizations that require advanced features beyond the open-source
          core.
        </Paragraph>
        <Paragraph>
          It is developed from the same GitHub repository as the Community
          Edition but includes additional features under a separate license.
          Enterprise features are located in the{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">enterprise/</code>{" "}
          directory.
        </Paragraph>

        <SubHeading>Enterprise features</SubHeading>
        <ul className="space-y-2 text-sm text-[#F5F1E8]/45 list-none">
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">SSO / SAML authentication</strong>{" "}
              — integrate with your identity provider (Okta, Azure AD, Google
              Workspace)
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Audit logs</strong> — full
              audit trail of all agent actions, GACCS submissions, and
              configuration changes
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">SLA management</strong> —
              define response time targets for different brief priorities
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Agent capacity management</strong>{" "}
              — control concurrent task limits per agent and sub-function
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Advanced analytics</strong>{" "}
              — cost tracking per agent, performance dashboards, ROI attribution
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#F5C542] mt-0.5 text-xs">&#8226;</span>
            <span>
              <strong className="text-[#F5F1E8]/75">Priority support</strong> —
              direct access to the Outmark engineering team
            </span>
          </li>
        </ul>

        <SubHeading>Licensing</SubHeading>
        <Paragraph>
          The core Outclaw application is released under the MIT License. Enterprise
          features are covered by a separate proprietary license. See{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">LICENSE</code> and{" "}
          <code className="text-[#F5F1E8]/65 bg-[#F5F1E8]/8 px-1.5 py-0.5 text-xs font-mono">LICENSE.enterprise</code>{" "}
          in the repository root for full terms.
        </Paragraph>

        <SubHeading>Activating enterprise features</SubHeading>
        <Paragraph>
          Contact{" "}
          <a
            href="mailto:nihal@outmarkhq.com"
            className="text-[#F5C542] hover:underline"
          >
            nihal@outmarkhq.com
          </a>{" "}
          to obtain an enterprise license key. Once activated, enterprise
          features become available in the Command Center Settings page.
        </Paragraph>
        <CodeBlock>{`# Add to your .env file
OUTCLAW_ENTERPRISE_KEY=your-license-key-here`}</CodeBlock>

        <Callout type="info">
          Enterprise features can be evaluated in development environments
          without a license key. A valid subscription is required for production
          use.
        </Callout>
      </div>
    ),
  },
  {
    id: "faq",
    title: "FAQ",
    icon: Globe,
    group: "Others",
    content: (
      <div className="space-y-4">
        <SectionHeading>Frequently Asked Questions</SectionHeading>

        <SubHeading>Can I use my own LLM provider?</SubHeading>
        <Paragraph>
          Yes. Outclaw supports any OpenAI-compatible API endpoint. Set the base
          URL and API key in your environment variables. This includes local
          models via Ollama, vLLM, or any proxy that exposes the OpenAI chat
          completions format.
        </Paragraph>

        <SubHeading>How do I add more agents?</SubHeading>
        <Paragraph>
          Insert new rows into the agents table through the Settings UI or
          directly in the database. Assign a sub-function, tier, and system
          prompt. The CMA will automatically consider new agents when routing
          tasks.
        </Paragraph>

        <SubHeading>Can I change the team structure?</SubHeading>
        <Paragraph>
          Yes. The three sub-functions are configurable. You can rename them, add
          new ones, or reorganize agents. The orchestration pipeline adapts to
          whatever structure you define.
        </Paragraph>

        <SubHeading>What happens if my LLM provider goes down?</SubHeading>
        <Paragraph>
          Tasks will be queued and retried automatically. Configure a fallback
          provider in your environment variables to ensure continuity. The CMA
          will route to the available provider.
        </Paragraph>

        <SubHeading>How do I migrate from the SaaS version?</SubHeading>
        <Paragraph>
          Export your workspace data from the SaaS dashboard (Settings → Export).
          Import the JSON file into your self-hosted instance using the CLI
          migration tool. Agent configurations, GACCS templates, and knowledge
          base content are all included.
        </Paragraph>

        <SubHeading>Where can I get help?</SubHeading>
        <Paragraph>
          Community support is available through GitHub Issues and Discussions.
          Enterprise customers have access to priority support via email at{" "}
          <a
            href="mailto:nihal@outmarkhq.com"
            className="text-[#F5C542] hover:underline"
          >
            nihal@outmarkhq.com
          </a>
          .
        </Paragraph>
      </div>
    ),
  },
];

/* ── Main Component ── */

export default function SelfHostDocs() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("introduction");

  const currentSection =
    sections.find((s) => s.id === activeSection) ?? sections[0];

  return (
    <div
      className="min-h-screen text-[#F5F1E8]"
      style={{ background: "#111315" }}
    >
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#F5F1E8]/6 bg-[#111315]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 bg-[#F5C542] flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-black" />
              </div>
              <span
                className="text-lg tracking-tight"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 300,
                }}
              >
                Outclaw
              </span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#F5F1E8]/15" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5F1E8]/30">
              Self-Host Docs
            </span>
          </div>
          <a
            href="https://github.com/outmarkhq/outclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#F5F1E8]/30 hover:text-[#F5C542] transition-colors font-mono"
          >
            GitHub →
          </a>
        </div>
      </nav>

      <div className="pt-14 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-60 border-r border-[#F5F1E8]/6 p-5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <DocNav
            sections={sections}
            activeId={activeSection}
            onSelect={setActiveSection}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
          {/* Mobile nav */}
          <div className="lg:hidden mb-6">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-[#F5F1E8]/[0.04] border border-[#F5F1E8]/10 text-[#F5F1E8] px-3 py-2 text-sm"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.group ? `${s.group} — ${s.title}` : s.title}
                </option>
              ))}
            </select>
          </div>

          {currentSection.content}

          {/* Prev/Next */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#F5F1E8]/6">
            {(() => {
              const idx = sections.findIndex((s) => s.id === activeSection);
              const prev = idx > 0 ? sections[idx - 1] : null;
              const next =
                idx < sections.length - 1 ? sections[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => setActiveSection(prev.id)}
                      className="flex items-center gap-2 text-sm text-[#F5F1E8]/30 hover:text-[#F5C542] transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> {prev.title}
                    </button>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <button
                      onClick={() => setActiveSection(next.id)}
                      className="flex items-center gap-2 text-sm text-[#F5F1E8]/30 hover:text-[#F5C542] transition-colors"
                    >
                      {next.title} <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </>
              );
            })()}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-[#F5F1E8]/6 text-center">
            <p className="text-xs text-[#F5F1E8]/20 font-mono">
              Outclaw is open-source software by{" "}
              <a
                href="https://outmarkhq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F1E8]/30 hover:text-[#F5C542]"
              >
                Growth Crystal, Inc.
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
