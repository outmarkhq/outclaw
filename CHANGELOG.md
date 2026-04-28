# Changelog

All notable changes to Outclaw are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-04-28

### Added

- **21 AI Marketing Agents** organized into three sub-functions: Product Marketing, Content & Brand, and Growth Marketing.
- **Command Center dashboard** with agent status overview, task management, and workspace settings.
- **GACCS briefing system** for structured marketing requests (Goals, Audience, Creative, Channels, Stakeholders).
- **Agent chat interface** with real-time conversation, markdown rendering, and context-aware routing.
- **Multi-provider LLM support** for 13 providers including OpenAI, Anthropic, Google, xAI, DeepSeek, Mistral, Together AI, Fireworks AI, OpenRouter, Ollama, Azure OpenAI, Kimi, and custom endpoints.
- **Workspace system** with onboarding wizard (workspace creation, LLM configuration, channel setup, deployment).
- **Email/password authentication** with registration, login, password reset, and session management.
- **Channel integrations** for Telegram, Slack, and WhatsApp bots.
- **Admin panel** with workspace management, user monitoring, and system oversight.
- **Audit log** for tracking agent actions and workspace activity.
- **Cron job management** for scheduled agent tasks.
- **Transactional email** via Loops (welcome emails, password reset).
- **S3 file storage** for workspace assets.
- **Full documentation** at outmarkhq.com/outclaw/docs.

### Technical

- React 19 + Tailwind CSS 4 + shadcn/ui frontend.
- Node.js + Express 4 + tRPC 11 backend.
- MySQL / TiDB database with Drizzle ORM.
- TypeScript end-to-end with Zod validation.
- Vitest test suite for server procedures.
