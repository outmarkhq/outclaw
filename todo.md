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
- [x] Build static site for Cloudflare Pages: Outmark homepage + /outclaw landing + /outclaw/docs
- [ ] Prepare Railway deployment config: Dockerfile, env vars, health checks for command.outmarkhq.com
- [x] Status page setup (Betterstack API — monitors + status page + Cloudflare CNAME)

## GitHub Repos
- [x] Prepare public repo structure (github.com/outmarkhq/outclaw) — self-hostable single-tenant
- [x] Prepare private repo structure (github.com/outmarkhq/outclaw-private) — full source

## URL Structure Verification
- [x] outmarkhq.com — Outmark agency homepage (static, Cloudflare Pages)
- [x] outmarkhq.com/outclaw — Outclaw product landing page (static)
- [x] outmarkhq.com/outclaw/docs — Outclaw documentation (static)
- [x] command.outmarkhq.com — Outclaw SaaS app (Manus hosting, LIVE)
- [x] command.outmarkhq.com/api — API endpoint (built into app)
- [x] status.outmarkhq.com — Status page (Betterstack, CNAME live)
- [x] github.com/outmarkhq/outclaw — Public self-host repo
- [x] github.com/outmarkhq/outclaw-private — Private full source repo

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
- [x] Log into GitHub, create outmarkhq org
- [x] Create outmarkhq/outclaw public repo
- [x] Create outmarkhq/outclaw-private repo
- [x] Build self-hostable package (Dockerfile, docker-compose, local auth, .env.example)
- [x] Push self-hostable code to GitHub
- [x] Save checkpoint and publish SaaS app
- [x] Log into Cloudflare, set up CNAME for command.outmarkhq.com
- [x] Set up Cloudflare Pages for static site
- [x] Log into Betterstack, set up status page for command.outmarkhq.com (via API)
- [x] Push static site to GitHub (Cloudflare Pages deploy pending)

## Manus Publish + Cloudflare DNS + Betterstack
- [x] Publish SaaS app via Manus (published)
- [x] Set up Cloudflare CNAME: command → cname.manus.space (verified)
- [x] Set up Cloudflare Pages: outmark-site.pages.dev → outmarkhq.com (live)
- [x] Set up Betterstack status page monitoring command.outmarkhq.com at status.outmarkhq.com
- [x] LLM orchestration handled by AlphaClaw natively — no custom wiring needed

## Pre-Publish Audit & Deployment
- [x] Audit SaaS app: full self-serve flow (signup → onboarding → workspace → GACCS → dashboard) works without human intervention
- [x] Audit SaaS app: all tRPC routes functional, error handling, edge cases
- [x] Audit SaaS app: auth flow complete (login, logout, session persistence)
- [x] Audit SaaS app: admin dashboard accessible for owner
- [x] Fix SaaS app issues: WhatsApp token saved, error toasts, workspace redirect, Settings WhatsApp section
- [x] Run all tests and ensure passing (19/19)
- [x] Audit static site: fix all internal links (href targets, navigation)
- [x] Audit static site: ensure all pages render correctly
- [x] Deploy static site to Cloudflare Pages (outmark-site.pages.dev)
- [x] Remove Netlify CNAME from Cloudflare DNS
- [x] Update outmarkhq.com A/CNAME records for Cloudflare Pages
- [x] Push SaaS app changes to outclaw-private GitHub repo
- [x] Push static site changes to outmark-site GitHub repo
- [x] Push self-host changes to outclaw GitHub repo (already up to date)
- [x] Save checkpoint and publish SaaS app via Manus (openclawdocs-iugjwtgp.manus.space)
- [x] Create command.outmarkhq.com CNAME to cname.manus.space (verified, live)

## Full Visitor UX Audit
- [x] Audit outmarkhq.com homepage: content, messaging, navigation, links
- [x] Audit outmarkhq.com/outclaw landing page: content, messaging, navigation, links
- [x] Audit outmarkhq.com/outclaw/docs: content, navigation, accuracy
- [x] Audit command.outmarkhq.com: visitor flow, login, onboarding
- [x] Fix all issues found across all pages
- [x] Push fixes to GitHub repos (outmark-site + outclaw-private)

## Post-Audit Remaining Tasks
- [x] Verify republished SaaS app is live with latest fixes (HTTP 200)
- [x] Email already configured — Google Workspace MX records in place
- [x] Sync public outclaw repo — 12 files fixed, pushed to GitHub

## SaaS App Restructure — Pure App Flow
- [x] Strip marketing landing page from command.outmarkhq.com Home.tsx
- [x] Implement auth gate: unauthenticated → login page, authenticated no workspace → onboarding, authenticated with workspace → dashboard
- [x] Build clean login/signup page (branded, minimal, links to outmarkhq.com for marketing)
- [x] Fix App.tsx routing: remove all docs/marketing routes from SaaS app
- [x] Ensure all SaaS app internal navigation is correct (CC dashboard, settings, admin)
- [x] Move any unique marketing content from SaaS app to static site if missing (already covered)
- [x] Update static site /outclaw page CTAs already point to command.outmarkhq.com
- [x] Run tests and verify full flow (19/19 passing)
- [x] Push fixes to outclaw-private GitHub repo

## White-Label Auth — Remove Manus OAuth
- [x] Add passwordHash field to users table in schema
- [x] Install bcrypt dependency
- [x] Build server auth routes: POST /api/auth/register, POST /api/auth/login
- [x] Build tRPC auth.register and auth.login procedures
- [x] Password hashing with bcrypt on registration
- [x] Password verification on login, issue JWT session cookie
- [x] Build frontend Login page with email/password form + register toggle
- [x] Replace all getLoginUrl() references with /login route
- [x] Update useAuth hook to redirect to /login instead of Manus OAuth
- [x] Update main.tsx unauthorized handler to redirect to /login
- [x] Keep Manus OAuth callback as hidden fallback (admin/platform use)
- [x] Write vitest tests for register and login (12 tests)
- [x] Test full flow end-to-end (curl verified: register, login, wrong password, duplicate email)
- [x] Strip passwordHash from all API responses (auth.me, register, login)
- [ ] Push to GitHub repos

## Remove All Manus References
- [x] Audit all files for "Manus" or "manus" references (grep)
- [x] Remove ManusDialog component and all imports/usages
- [x] Remove Manus OAuth portal URL references from user-facing code (getLoginUrl removed)
- [x] Remove/replace any "Manus" text in UI strings, comments, and docs
- [x] Remove Manus analytics references if user-facing (analytics is env-injected, not user-visible)
- [x] Ensure OAuth callback still works silently (no Manus branding)
- [x] Rename manusTypes.ts → authTypes.ts
- [x] Clean up debug-collector.js console messages ([Manus] → [Debug])
- [x] Update test fixtures (loginMethod: "manus" → "email")
- [x] Run tests and verify app still functions (31/31 passing)

## Full System Audit (Post-Publish)
- [ ] Test live site login page renders correctly (command.outmarkhq.com/login)
- [ ] Test registration flow with new email
- [ ] Test login flow with existing credentials
- [ ] Test onboarding wizard (all 4 steps)
- [ ] Test Command Center dashboard loads after onboarding
- [ ] Test all CC navigation (tasks, settings, agents)
- [ ] Test admin dashboard (platform admin)
- [ ] Test logout flow
- [ ] Test all internal navigation links/buttons
- [ ] Verify external links (outmarkhq.com, docs, GitHub)
- [ ] Verify GitHub repos are synced with latest code
- [ ] Fix any issues found

## DNS & Email Setup (Loops)
- [x] Add Loops MX record on Cloudflare (envelope.outmarkhq.com → 10 feedback-smtp.us-east-1.amazonses.com)
- [x] Add Loops SPF TXT record on Cloudflare (envelope.outmarkhq.com)
- [x] Add 3 Loops DKIM CNAME records on Cloudflare
- [x] Verify DNS propagation (all 5 records confirmed via API)

## LLM Provider Expansion
- [x] Add DeepSeek to provider dropdown and settings
- [x] Add xAI (Grok) to provider dropdown and settings
- [x] Add Kimi/Moonshot to provider dropdown and settings
- [x] Add Mistral to provider dropdown and settings
- [x] Add Together AI to provider dropdown and settings
- [x] Add Fireworks AI to provider dropdown and settings
- [x] Add Ollama (local) to provider dropdown and settings
- [x] Add Azure OpenAI to provider dropdown and settings
- [x] Update onboarding LLM step with new providers
- [x] Update settings LLM page with new providers

## Tier 1 Screens
- [x] Enhance Command Center Dashboard (real-time agent health, active tasks, recent activity, metrics)
- [x] Build Agent Chat screen (chat with CMA or any agent, message history, streaming)
- [x] Build per-agent chat route (/cc/chat/:agentId)
- [x] Improve Task Pipeline with kanban view and approval workflow (orchestration stage badges, approve/revise buttons)
- [x] GACCS Brief Form improvements

## Tier 2 Screens
- [x] Build Audit Log screen (full history of agent actions, searchable, filterable)
- [x] Build Cron Jobs screen (job management, calendar view, run history)
- [x] Enhance Agent Roster (capability management, channel bindings, detail view)

## White-Label Auth Emails (Loops)
- [x] Integrate Loops API for transactional emails
- [x] Build welcome/registration email (triggered on signup)
- [x] Build password reset flow (request, token, reset page)
- [x] Build password reset email template
- [x] All emails from noreply@outmarkhq.com (pending Loops template creation)

## OpenClaw Criticisms (Medium Article Fixes)
- [x] Permission isolation UI in agent settings (granular tool permissions with risk indicators)
- [x] Audit log for every agent action (full audit log page with filtering)
- [x] Approval chain in task pipeline (orchestration stages, human review gate, approve/revise)
- [ ] Usage/cost tracking dashboard (addresses resource usage criticism) — future phase
- [x] Clear error states instead of silent failures (toast notifications, error boundaries)

## Branding Fixes
- [ ] Fix VITE_APP_TITLE (requires manual update in Management UI → Settings → General)
- [x] Fix sign-out redirect bug (logout now redirects to /login)
- [x] Verify all pages show correct Outclaw branding

## GitHub Sync (Final)
- [ ] Push all changes to outmarkhq/outclaw (public)
- [ ] Push all changes to outmarkhq/outclaw-private
