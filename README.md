<p align="center">
  <img src=".github/assets/outclaw-github-banner.png" alt="Outclaw — AI Marketing Command Center" width="100%" />
</p>

<p align="center">
  <strong>The open-source AI marketing command center. 21 agents. Three sub-functions. One dashboard.</strong>
</p>

<p align="center">
  <a href="https://github.com/outmarkhq/outclaw/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://github.com/outmarkhq/outclaw/stargazers"><img src="https://img.shields.io/github/stars/outmarkhq/outclaw?style=social" alt="GitHub Stars" /></a>
  <a href="https://github.com/outmarkhq/outclaw/issues"><img src="https://img.shields.io/github/issues/outmarkhq/outclaw" alt="Issues" /></a>
  <a href="https://github.com/outmarkhq/outclaw/pulls"><img src="https://img.shields.io/github/issues-pr/outmarkhq/outclaw" alt="Pull Requests" /></a>
</p>

<p align="center">
  <a href="https://outmarkhq.com/outclaw">Website</a> · <a href="https://outmarkhq.com/outclaw/docs">Documentation</a> · <a href="https://command.outmarkhq.com">Live Demo</a> · <a href="https://github.com/outmarkhq/outclaw/issues">Report Bug</a> · <a href="https://github.com/outmarkhq/outclaw/issues">Request Feature</a>
</p>

---

## What is Outclaw?

Outclaw is an **open-source AI marketing command center** that gives B2B marketing teams a structured, agent-based operating system. Instead of a single chatbot that writes blog posts, Outclaw deploys **21 specialized AI agents** organized into three sub-functions — Product Marketing, Content & Brand, and Growth Marketing — that coordinate through structured briefs, share context, and deliver work where strategy connects to execution.

Built for marketers who want AI that works like a real team, not a toy.

<p align="center">
  <img src=".github/assets/outclaw-screenshot-dashboard.png" alt="Outclaw Command Center Dashboard" width="90%" />
</p>

## Key Features

### 21 AI Marketing Agents

Outclaw ships with a complete marketing org chart out of the box. Each agent has a defined role, sub-function, and tier — from the Chief Marketing Agent that routes tasks and reviews output, to specialists like the Competitive Intel Agent, Content Writer, and SEO Agent.

| Sub-Function | Lead | Specialists |
|---|---|---|
| **Product Marketing** | Product Marketing Lead | Competitive Intel, Audience Research, Sales Enablement, Product Launch |
| **Content & Brand** | Content & Brand Lead | Content Writer, Content Repurposing, Designer, Social Media, PR & Comms |
| **Growth Marketing** | Growth Marketing Lead | SEO, Paid Media, Lifecycle Email, Social Listening, Growth Analyst |
| **Operations** | — | Campaign Producer, Marketing Ops, Ecosystem |

### GACCS Briefing System

Submit structured marketing briefs with **Goals, Audience, Creative, Channels, and Stakeholders**. The Chief Marketing Agent decomposes your brief, routes tasks to the right agents, and coordinates delivery across the team.

### Bring Your Own LLM

Connect any OpenAI-compatible provider. Outclaw supports **13 providers** out of the box:

| Provider | Models |
|---|---|
| OpenAI | GPT-4o, GPT-4o-mini, o1, o3-mini |
| Anthropic | Claude 4 Sonnet, Claude 3.5 Sonnet, Claude 3 Opus |
| Google | Gemini 2.0 Flash, Gemini 1.5 Pro |
| xAI | Grok 3, Grok 3 Mini |
| DeepSeek | DeepSeek Chat, DeepSeek Reasoner |
| Mistral | Mistral Large, Mistral Small |
| Together AI | Llama 3.1 405B, Llama 3.1 70B |
| Fireworks AI | Llama 3.1 405B, Llama 3.1 70B |
| OpenRouter | Any model via OpenRouter |
| Ollama | Any local model |
| Azure OpenAI | Your Azure deployment |
| Kimi (Moonshot) | Moonshot v1 |
| Custom | Any OpenAI-compatible endpoint |

### Multi-Channel Distribution

Deploy agents across **Telegram**, **Slack**, and **WhatsApp** — or use the built-in web chat. Each channel connects to the same agent hierarchy, so context is never lost.

### Self-Hosted & Private

Your data stays on your infrastructure. No vendor lock-in, no usage tracking, no third-party data sharing. Deploy on any server that runs Node.js and MySQL.

## Architecture

<p align="center">
  <img src=".github/assets/architecture.png" alt="Outclaw Architecture" width="85%" />
</p>

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Tailwind CSS 4, shadcn/ui, Wouter |
| **Backend** | Node.js, Express 4, tRPC 11 |
| **Database** | MySQL / TiDB (via Drizzle ORM) |
| **Auth** | Email/password with bcrypt + JWT sessions |
| **LLM** | OpenAI-compatible API (any provider) |
| **Storage** | S3-compatible object storage |
| **Build** | Vite, esbuild, TypeScript |

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MySQL** >= 8.0 (or TiDB)
- **pnpm** (recommended) or npm

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/outmarkhq/outclaw.git
   cd outclaw
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your database credentials and at minimum:

   ```
   DATABASE_URL=mysql://user:password@localhost:3306/outclaw
   JWT_SECRET=your-secret-key-here
   ```

4. **Push database schema**

   ```bash
   pnpm db:push
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser** at `http://localhost:3000`

   Create your first workspace, connect an LLM provider, and start briefing your agents.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Secret for signing session tokens |
| `LOOPS_API_KEY` | No | Loops.so API key for transactional emails |
| `S3_BUCKET` | No | S3 bucket for file storage |
| `S3_REGION` | No | S3 region |
| `S3_ACCESS_KEY` | No | S3 access key |
| `S3_SECRET_KEY` | No | S3 secret key |

## Project Structure

```
outclaw/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   │   ├── Home.tsx    # Landing / login
│   │   │   ├── cc/         # Command Center pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Agents.tsx
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── Tasks.tsx
│   │   │   │   ├── AuditLog.tsx
│   │   │   │   ├── CronJobs.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── admin/      # Admin panel
│   │   ├── components/     # Reusable UI (shadcn/ui)
│   │   └── lib/            # tRPC client, utilities
│   └── index.html
├── server/                 # Express + tRPC backend
│   ├── routers.ts          # All tRPC procedures
│   ├── db.ts               # Database query helpers
│   ├── email.ts            # Transactional email
│   ├── storage.ts          # S3 file storage
│   └── _core/              # Framework internals
├── drizzle/                # Database schema & migrations
│   └── schema.ts           # Table definitions
├── shared/                 # Shared types & constants
│   └── llmProviders.ts     # LLM provider registry
└── package.json
```

## Documentation

Full documentation is available at **[outmarkhq.com/outclaw/docs](https://outmarkhq.com/outclaw/docs)**.

The docs cover:

- **Getting Started** — installation, first workspace, connecting your LLM
- **Architecture** — system design, agent hierarchy, data flow
- **Agents** — the 21-agent org chart, roles, and capabilities
- **GACCS Framework** — how structured briefs work
- **Command Center** — dashboard, chat, tasks, and settings
- **Deployment** — production setup, Docker, environment configuration
- **Troubleshooting** — common issues and solutions

## Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Docker (coming soon)

Docker and docker-compose support is on the roadmap. Track progress in [Issues](https://github.com/outmarkhq/outclaw/issues).

## Contributing

Contributions are welcome. Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** before submitting a pull request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit with a descriptive message
6. Push and open a pull request

## Security

If you discover a security vulnerability, please report it responsibly. See **[SECURITY.md](SECURITY.md)** for details.

## Community

- **Website**: [outmarkhq.com/outclaw](https://outmarkhq.com/outclaw)
- **Documentation**: [outmarkhq.com/outclaw/docs](https://outmarkhq.com/outclaw/docs)
- **Issues**: [GitHub Issues](https://github.com/outmarkhq/outclaw/issues)
- **LinkedIn**: [Outmark](https://linkedin.com/company/outmarkhq)

## Roadmap

- [ ] Docker & docker-compose deployment
- [ ] Plugin system for custom agents
- [ ] Webhook integrations
- [ ] Campaign analytics dashboard
- [ ] Multi-workspace team collaboration
- [ ] API documentation (OpenAPI spec)

## License

Outclaw is open-source software licensed under the **[MIT License](LICENSE)**.

The enterprise edition with additional features is available under a separate license. See [LICENSE.enterprise](LICENSE.enterprise) for details.

---

<p align="center">
  Built by <a href="https://outmarkhq.com">Outmark</a> — the AI marketing agency for B2B.
</p>
