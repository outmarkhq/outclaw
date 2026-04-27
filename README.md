# Outclaw

**Your AI marketing team, structured like a real one.**

Outclaw is an open-source AI marketing command center built on the MKT1 team framework. It gives B2B companies a structured workforce of 21 AI agents organized into three sub-functions — Product Marketing, Content & Brand, and Growth Marketing — coordinated through the GACCS brief system and orchestrated by a Chief Marketing Agent.

> Built by [Growth Crystal, Inc.](https://outmarkhq.com) · Dual-licensed: MIT (core) + Proprietary (enterprise)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start (Docker)](#quick-start-docker)
- [Manual Installation](#manual-installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Connecting Your LLM](#connecting-your-llm)
- [AlphaClaw Setup](#alphaclaw-setup)
- [Browser Harness Setup](#browser-harness-setup)
- [Upgrading](#upgrading)
- [Enterprise Edition](#enterprise-edition)
- [Contributing](#contributing)
- [License](#license)

---

## Features

**Core (MIT)**
- 21 AI marketing agents across 3 sub-functions
- GACCS brief system (Goals, Audience, Creative, Channels, Stakeholders)
- Chief Marketing Agent orchestration with approval chain
- Command Center dashboard with real-time agent status
- Task pipeline with kanban view
- Agent roster with capability management
- Bring-your-own LLM (OpenAI, Anthropic, Azure, local models)
- Browser automation via Browser Harness
- AlphaClaw/OpenClaw orchestration engine support
- MySQL database with Drizzle ORM
- S3-compatible file storage

**Enterprise (Proprietary)**
- SSO / SAML authentication
- Audit logs and compliance reporting
- SLA policies and escalation rules
- Advanced analytics and attribution
- Priority support
- Custom agent training

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Command Center                  │
│              (React + Tailwind UI)               │
├─────────────────────────────────────────────────┤
│                  tRPC API Layer                  │
├──────────┬──────────┬──────────┬────────────────┤
│   Auth   │  Tasks   │  Agents  │  Workspaces    │
├──────────┴──────────┴──────────┴────────────────┤
│            Orchestration Engine                   │
│         (AlphaClaw / OpenClaw)                   │
├──────────┬──────────┬───────────────────────────┤
│  MySQL   │   S3     │   Browser Harness         │
└──────────┴──────────┴───────────────────────────┘
```

The GACCS brief flow:

1. **User** submits a structured GACCS brief
2. **Chief Marketing Agent** analyzes, enriches context, and routes to the right function head
3. **Function Head** (Product Marketing, Content & Brand, or Growth) delegates to specialists
4. **Specialist agents** execute the work
5. **Function Head** reviews output
6. **CMA** gives final approval
7. **User** receives the deliverable

---

## Quick Start (Docker)

The fastest way to get Outclaw running. Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

```bash
# 1. Clone the repository
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw

# 2. Copy the environment template
cp .env.example .env

# 3. Edit .env with your configuration
#    At minimum, set:
#    - JWT_SECRET (generate with: openssl rand -hex 32)
#    - OPENAI_API_KEY (your LLM provider key)
nano .env

# 4. Start all services
docker compose up -d

# 5. Run database migrations
docker compose exec outclaw npx drizzle-kit migrate

# 6. Open the Command Center
open http://localhost:3000
```

To stop all services:

```bash
docker compose down
```

To view logs:

```bash
docker compose logs -f outclaw
```

---

## Manual Installation

For production deployments or when you need more control over the stack.

### Prerequisites

- Node.js 22+
- MySQL 8.0+
- Redis 7+ (optional, for caching)
- pnpm 9+

### Steps

```bash
# 1. Clone and install dependencies
git clone https://github.com/outmarkhq/outclaw.git
cd outclaw
pnpm install

# 2. Configure environment
cp .env.example .env
nano .env

# 3. Run database migrations
pnpm db:push

# 4. Build the application
pnpm build

# 5. Start the server
node dist/index.js
```

For development:

```bash
pnpm dev
```

### Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name command.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

For SSL, use [Certbot](https://certbot.eff.org/) with Let's Encrypt:

```bash
sudo certbot --nginx -d command.yourdomain.com
```

---

## Configuration

All configuration is done through environment variables. See `.env.example` for the complete list.

### Required Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@localhost:3306/outclaw` |
| `JWT_SECRET` | Session signing secret (64+ chars) | `openssl rand -hex 32` |
| `OPENAI_API_KEY` | Your LLM provider API key | `sk-...` |

### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | LLM API endpoint |
| `OPENAI_MODEL` | `gpt-4o` | Default model |
| `S3_ENDPOINT` | — | S3-compatible storage endpoint |
| `SMTP_HOST` | — | Email server for notifications |
| `BROWSER_HARNESS_ENABLED` | `true` | Enable browser automation |

---

## Database Setup

Outclaw uses MySQL 8.0+ with Drizzle ORM for schema management.

### Using Docker (recommended)

The `docker-compose.yml` includes a pre-configured MySQL instance. No additional setup needed.

### Using an Existing MySQL Instance

```bash
# 1. Create the database
mysql -u root -p -e "CREATE DATABASE outclaw CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Create a user
mysql -u root -p -e "CREATE USER 'outclaw'@'%' IDENTIFIED BY 'your-secure-password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON outclaw.* TO 'outclaw'@'%';"

# 3. Update DATABASE_URL in .env
# DATABASE_URL=mysql://outclaw:your-secure-password@localhost:3306/outclaw

# 4. Run migrations
pnpm db:push
```

### Using TiDB / PlanetScale

Outclaw is compatible with TiDB and PlanetScale. Set `DATABASE_URL` to your connection string and ensure SSL is enabled:

```
DATABASE_URL=mysql://user:pass@host:4000/outclaw?ssl={"rejectUnauthorized":true}
```

---

## Connecting Your LLM

Outclaw supports any OpenAI-compatible API. You bring your own keys.

### OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o
```

### Anthropic (via OpenAI-compatible proxy)

Use a proxy like [LiteLLM](https://github.com/BerriAI/litellm):

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-ant-your-key
OPENAI_BASE_URL=http://localhost:4000/v1
OPENAI_MODEL=claude-sonnet-4-20250514
```

### Azure OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=your-azure-key
OPENAI_BASE_URL=https://your-resource.openai.azure.com/openai/deployments/your-deployment
OPENAI_MODEL=gpt-4o
```

### Local Models (Ollama)

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=ollama
OPENAI_BASE_URL=http://localhost:11434/v1
OPENAI_MODEL=llama3.1
```

---

## AlphaClaw Setup

[AlphaClaw](https://github.com/chrysb/alphaclaw) is the orchestration engine that manages agent lifecycles, watchdog monitoring, Git-based config sync, and channel routing.

### Installation

```bash
# Clone AlphaClaw alongside Outclaw
git clone https://github.com/chrysb/alphaclaw.git
cd alphaclaw
chmod +x setup.sh
./setup.sh
```

### Configuration

Outclaw ships with a default `alphaclaw.json` pre-configured for the MKT1 21-agent structure. To customize:

```bash
# Edit the agent configuration
nano alphaclaw.json

# Key sections:
# - agents: Define agent names, roles, and capabilities
# - channels: Configure communication channels (Slack, email, webhooks)
# - watchdog: Set health check intervals and restart policies
```

### Connecting to Outclaw

```env
ALPHACLAW_MODE=local
ALPHACLAW_CONFIG_PATH=./alphaclaw.json
```

For remote AlphaClaw instances:

```env
ALPHACLAW_MODE=remote
ALPHACLAW_API_URL=http://your-alphaclaw-host:8080
ALPHACLAW_API_KEY=your-api-key
```

---

## Browser Harness Setup

[Browser Harness](https://github.com/browser-use/browser-harness) gives every agent the ability to browse, scrape, click, and automate web tasks through a self-healing CDP-based browser controller.

### Using Docker

```yaml
# Add to your docker-compose.yml
browser-harness:
  image: browseruse/browser-harness:latest
  container_name: outclaw-browser
  restart: unless-stopped
  ports:
    - "9222:9222"
  environment:
    - CHROME_FLAGS=--no-sandbox --disable-gpu
  networks:
    - outclaw-net
```

### Manual Installation

Follow the [Browser Harness installation guide](https://github.com/browser-use/browser-harness/blob/main/install.md).

### Configuration

```env
BROWSER_HARNESS_ENABLED=true
BROWSER_HARNESS_ENDPOINT=http://localhost:9222
```

---

## Upgrading

### Docker

```bash
# Pull the latest version
git pull origin main

# Rebuild and restart
docker compose build
docker compose up -d

# Run any new migrations
docker compose exec outclaw npx drizzle-kit migrate
```

### Manual

```bash
# Pull the latest version
git pull origin main

# Install updated dependencies
pnpm install

# Run migrations
pnpm db:push

# Rebuild
pnpm build

# Restart the server
# (use your process manager: systemd, pm2, etc.)
pm2 restart outclaw
```

### Version Pinning

For production stability, pin to a specific release tag:

```bash
git checkout v1.0.0
```

---

## Enterprise Edition

Outclaw follows a dual-license model. The core platform is MIT-licensed and free to use. Enterprise features require a separate license.

### What's Included

| Feature | Core (MIT) | Enterprise |
|---|:---:|:---:|
| 21 AI agents | ✓ | ✓ |
| GACCS briefs | ✓ | ✓ |
| CMA orchestration | ✓ | ✓ |
| Command Center UI | ✓ | ✓ |
| AlphaClaw integration | ✓ | ✓ |
| Browser Harness | ✓ | ✓ |
| SSO / SAML | — | ✓ |
| Audit logs | — | ✓ |
| SLA policies | — | ✓ |
| Advanced analytics | — | ✓ |
| Priority support | — | ✓ |
| Custom agent training | — | ✓ |

### Activating Enterprise

Contact us at [nihal@outmarkhq.com](mailto:nihal@outmarkhq.com) for an enterprise license key.

```env
OUTCLAW_EDITION=enterprise
OUTCLAW_LICENSE_KEY=your-license-key
```

---

## Contributing

We welcome contributions. Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

**Core:** [MIT License](./LICENSE)

**Enterprise:** [Proprietary License](./LICENSE.enterprise)

Copyright 2025 Growth Crystal, Inc.

---

<p align="center">
  <strong>Outclaw</strong> — AI marketing, structured like a real team.<br/>
  <a href="https://outmarkhq.com/outclaw">Website</a> · <a href="https://outmarkhq.com/outclaw/docs">Documentation</a> · <a href="https://command.outmarkhq.com">Cloud</a> · <a href="mailto:nihal@outmarkhq.com">Contact</a>
</p>
