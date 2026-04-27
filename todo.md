# Outclaw Command Center — SaaS Platform TODO

## Infrastructure
- [x] Design database schema (workspaces, workspace_members, onboarding_state, billing, agents, tasks)
- [x] Push database migrations
- [x] Build tRPC routers for all SaaS features

## Onboarding Flow
- [x] Signup/Login via Manus OAuth (already wired)
- [x] Onboarding wizard: Step 1 — Create workspace (name, slug)
- [x] Onboarding wizard: Step 2 — Connect LLM via Portkey (provider, API key, model)
- [x] Onboarding wizard: Step 3 — Connect channels (Telegram bot token, Slack, WhatsApp)
- [x] Onboarding wizard: Step 4 — Provision Command Center (auto-create agents, confirm)
- [x] Workspace provisioning backend (create OC config, register agents)

## Command Center (User Dashboard)
- [x] Task board (Kanban: Inbox → Assigned → Active → Review → Done)
- [x] Agent squad sidebar with status indicators
- [x] New Request form (popup, routes to agents)
- [x] Settings: LLM configuration (Portkey)
- [x] Settings: Channel management (Telegram/Slack/WhatsApp)
- [x] Settings: Team members (invite, roles: admin/member)
- [x] Settings: Security & Keys

## Admin Dashboard (Platform Operator)
- [x] Customer/workspace list with search, filters, status
- [x] Workspace detail view (owner, plan, agents, usage, channels)
- [x] System health monitoring (charts, metrics)
- [ ] Billing management (plans, usage tracking) — future phase
- [ ] User management (promote/demote, suspend) — future phase

## Auth & Roles
- [x] Replace prototype AuthContext with real useAuth + tRPC
- [x] Role-based access: admin vs member
- [x] Admin-only routes protection (backend + frontend)
- [x] Workspace-scoped data isolation

## UI/UX
- [x] Dark theme (sim.ai inspired design language)
- [x] Responsive layout
- [x] DashboardLayout for admin and command center
- [x] Landing page with "Get Started" CTA linking to signup

## Docs Integration
- [ ] Keep existing docs pages at /docs/* routes — deferred (docs pages removed during upgrade)
- [ ] Add "Launch Command Center" button to docs sidebar — deferred

## Stripe Billing
- [ ] Add Stripe integration (future phase)

## Tests
- [x] Vitest tests for auth.logout
- [x] Vitest tests for auth.me, workspace.list, admin.stats, admin.workspaces, admin.users

## Rebuild — MKT1-grounded Outclaw
- [x] Read all MKT1 knowledge base files for positioning and philosophy
- [x] Rebuild homepage with deep B2B marketing knowledge, MKT1 philosophy, why 21 agents, why GACCS
- [x] Rebuild GACCS brief form with structured fields (Goals, Audience, Creative, Channels, Stakeholders) — not all required
- [x] Build CMA orchestration: GACCS → CMA → Function Head → Specialist → review chain
- [x] CMA always in approval loop for every task
- [x] Separate docs: SaaS users (GACCS writing, agent config, channel setup, API key troubleshooting)
- [x] Separate docs: Self-hosted users (installation, env setup, database config, deployment, customization)
- [x] Update CC Dashboard to show orchestration status and task flow
- [x] Tests and checkpoint (19 tests passing)

## AlphaClaw Replacement & Browser Harness Integration
- [x] Research AlphaClaw repo (https://github.com/chrysb/alphaclaw) — architecture, config format, capabilities
- [x] Research Browser Harness repo (https://github.com/browser-use/browser-harness) — how it provides browser access
- [x] Replace all OpenClaw references with AlphaClaw across entire codebase
- [x] Customize AlphaClaw config for MKT1 21-agent marketing team
- [x] Integrate browser-harness as default browser capability for all agents
- [x] Verify Command Center / Mission Control UI is intact
- [x] Update documentation (SaaS + Self-Host) to reference AlphaClaw and browser-harness
- [x] Run tests and save checkpoint (19 tests passing)

## Outclaw Rename & Chatwoot-Style Self-Hosted Docs
- [x] Research Chatwoot self-hosted docs structure and style
- [x] Rename Mothership → Outclaw across entire codebase
- [x] Update branding: command.outmarkhq.com, Growth Crystal Inc., nihal@outmarkhq.com
- [x] Add dual LICENSE files (MIT core + proprietary enterprise)
- [x] Rebuild self-hosted docs in Chatwoot style (Docker, Linux, Heroku, env config, upgrade paths)
- [x] Ensure future compatibility with AlphaClaw/OpenClaw/browser-harness (shared/orchestration.ts abstraction layer)
- [x] Update homepage with Outclaw branding
- [x] Run tests and save checkpoint (19 tests passing)

## Outmark Branding Alignment
- [x] Study Outmark homepage HTML for colors, typography, copy tone, design language
- [x] Align Outclaw color palette to Outmark branding (Fraunces serif, IBM Plex Mono, gold #F5C542, dark cream #0B0D0F)
- [x] Match copy tone and messaging style to Outmark (editorial, direct, confident)
- [x] Update homepage with Outmark-aligned branding

## Bug Fixes
- [x] Fix onboarding flash/flicker — landing page and dashboard flash before settling on onboarding
- [x] Fix URL slug field overflow — command.outmarkhq.com prefix overflows the input container

## Deployment & Hosting
- [ ] Build static site for Cloudflare Pages: Outmark homepage + /outclaw landing + /outclaw/docs
- [ ] Prepare Railway deployment config: Dockerfile, env vars, health checks for command.outmarkhq.com
- [ ] Status page setup instructions (Betterstack/Instatus for status.outmarkhq.com)

## GitHub Repos
- [ ] Prepare public repo structure (github.com/outmarkhq/outclaw) — self-hostable single-tenant
- [ ] Prepare private repo structure (github.com/outmarkhq/outclaw-private) — full source

## URL Structure Verification
- [ ] outmarkhq.com — Outmark agency homepage (static)
- [ ] outmarkhq.com/outclaw — Outclaw product landing page (static)
- [ ] outmarkhq.com/outclaw/docs — Outclaw documentation (static)
- [ ] command.outmarkhq.com — Outclaw SaaS app (Railway)
- [ ] command.outmarkhq.com/api — API endpoint (built into app)
- [ ] status.outmarkhq.com — Status page
- [ ] github.com/outmarkhq/outclaw — Public self-host repo
- [ ] github.com/outmarkhq/outclaw-private — Private full source repo

## Previous Requests Audit
- [x] Replace OpenClaw with AlphaClaw
- [x] Integrate browser-harness as default browser access
- [x] Command Center / Mission Control UI preserved
- [x] Self-hosted version modeled after Chatwoot (dual license, easy deploy)
- [x] Rename to Outclaw
- [x] Match Outmark branding (colors, typography, copy tone)
- [x] Dual license: MIT core + proprietary enterprise
- [x] Self-hosted = single-tenant, cloud = multi-tenant
- [x] Users bring their own LLM keys in both versions
- [x] GACCS briefs → CMA → Function Head → Specialist → review chain
- [x] CMA always in approval loop
- [x] 21 agents organized into 3 sub-functions
- [x] Org chart for 21 agents (delivered as PNG)

## Full Deployment
- [ ] Log into GitHub, create outmarkhq org
- [ ] Create outmarkhq/outclaw public repo
- [ ] Create outmarkhq/outclaw-private repo
- [ ] Build self-hostable package (Dockerfile, docker-compose, local auth, .env.example)
- [ ] Push self-hostable code to GitHub
- [ ] Save checkpoint and publish SaaS app
- [ ] Log into Cloudflare, set up CNAME for command.outmarkhq.com
- [ ] Set up Cloudflare Pages for static site
- [ ] Log into Betterstack, set up status page for command.outmarkhq.com
- [ ] Push static site to GitHub and deploy via Cloudflare Pages
