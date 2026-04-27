/*
 * Mock data store for the Outclaw SaaS platform prototype.
 * In production, this would be backed by Mission Control's SQLite + API routes.
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner: string;
  ownerEmail: string;
  plan: "starter" | "pro" | "enterprise";
  status: "active" | "provisioning" | "suspended" | "error";
  agentCount: number;
  taskCount: number;
  monthlyTokens: number;
  monthlyCost: number;
  createdAt: string;
  lastActive: string;
  gatewayPort: number;
  dashboardPort: number;
  channels: { telegram?: boolean; slack?: boolean; whatsapp?: boolean };
  llmProvider: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  tier: "leader" | "coordinator" | "specialist";
  model: string;
  status: "online" | "idle" | "busy" | "error" | "offline";
  lastSeen: string;
  tasksCompleted: number;
  tokensUsed: number;
  tools: string[];
  reportsTo: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "backlog" | "todo" | "in_progress" | "review" | "done" | "blocked";
  priority: "critical" | "high" | "medium" | "low";
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface SystemMetric {
  timestamp: string;
  cpuPercent: number;
  memoryPercent: number;
  activeConnections: number;
  requestsPerMinute: number;
}

// ── Workspaces ──
export const workspaces: Workspace[] = [
  {
    id: "ws-001",
    name: "Acme Corp Marketing",
    slug: "acme-corp",
    owner: "Sarah Chen",
    ownerEmail: "sarah@acme.com",
    plan: "enterprise",
    status: "active",
    agentCount: 21,
    taskCount: 147,
    monthlyTokens: 2_450_000,
    monthlyCost: 342.50,
    createdAt: "2026-02-15",
    lastActive: "2 min ago",
    gatewayPort: 18789,
    dashboardPort: 3001,
    channels: { telegram: true, slack: true },
    llmProvider: "Anthropic (Claude Sonnet 4)",
  },
  {
    id: "ws-002",
    name: "TechStart B2B",
    slug: "techstart",
    owner: "Marcus Rivera",
    ownerEmail: "marcus@techstart.io",
    plan: "pro",
    status: "active",
    agentCount: 21,
    taskCount: 89,
    monthlyTokens: 1_120_000,
    monthlyCost: 156.80,
    createdAt: "2026-03-01",
    lastActive: "15 min ago",
    gatewayPort: 18790,
    dashboardPort: 3002,
    channels: { telegram: true },
    llmProvider: "OpenAI (GPT-4.1)",
  },
  {
    id: "ws-003",
    name: "GreenLeaf Digital",
    slug: "greenleaf",
    owner: "Priya Patel",
    ownerEmail: "priya@greenleaf.co",
    plan: "starter",
    status: "active",
    agentCount: 21,
    taskCount: 34,
    monthlyTokens: 450_000,
    monthlyCost: 63.00,
    createdAt: "2026-03-20",
    lastActive: "1 hr ago",
    gatewayPort: 18791,
    dashboardPort: 3003,
    channels: { slack: true, whatsapp: true },
    llmProvider: "Google (Gemini 2.5 Pro)",
  },
  {
    id: "ws-004",
    name: "NovaBrand Agency",
    slug: "novabrand",
    owner: "James Okafor",
    ownerEmail: "james@novabrand.agency",
    plan: "pro",
    status: "provisioning",
    agentCount: 0,
    taskCount: 0,
    monthlyTokens: 0,
    monthlyCost: 0,
    createdAt: "2026-04-02",
    lastActive: "Just now",
    gatewayPort: 18792,
    dashboardPort: 3004,
    channels: {},
    llmProvider: "Not configured",
  },
  {
    id: "ws-005",
    name: "Meridian Health",
    slug: "meridian",
    owner: "Dr. Lisa Wong",
    ownerEmail: "lwong@meridianhealth.org",
    plan: "enterprise",
    status: "suspended",
    agentCount: 21,
    taskCount: 203,
    monthlyTokens: 0,
    monthlyCost: 0,
    createdAt: "2026-01-10",
    lastActive: "5 days ago",
    gatewayPort: 18793,
    dashboardPort: 3005,
    channels: { telegram: true, slack: true, whatsapp: true },
    llmProvider: "Anthropic (Claude Opus 4)",
  },
];

// ── Agents (21 agents matching the mkt1 hierarchy) ──
export const agents: Agent[] = [
  // Tier 1: Leaders
  { id: "chief-marketing", name: "Chief Marketing Officer", role: "CMO", tier: "leader", model: "leader-model", status: "online", lastSeen: "Just now", tasksCompleted: 312, tokensUsed: 890_000, tools: ["read", "write", "browser", "sessions_spawn", "sessions_send"], reportsTo: null },
  { id: "product-marketing-lead", name: "Product Marketing Lead", role: "Product Marketing", tier: "leader", model: "leader-model", status: "online", lastSeen: "1 min ago", tasksCompleted: 245, tokensUsed: 720_000, tools: ["read", "write", "browser", "sessions_spawn", "sessions_send"], reportsTo: "chief-marketing" },
  { id: "content-brand-lead", name: "Content & Brand Lead", role: "Content & Brand", tier: "leader", model: "leader-model", status: "busy", lastSeen: "Just now", tasksCompleted: 198, tokensUsed: 650_000, tools: ["read", "write", "browser", "sessions_spawn", "sessions_send"], reportsTo: "chief-marketing" },
  { id: "growth-marketing-lead", name: "Growth Marketing Lead", role: "Growth Marketing", tier: "leader", model: "leader-model", status: "online", lastSeen: "3 min ago", tasksCompleted: 267, tokensUsed: 780_000, tools: ["read", "write", "browser", "sessions_spawn", "sessions_send"], reportsTo: "chief-marketing" },
  // Tier 2: Coordinators
  { id: "campaign-producer", name: "Campaign Producer", role: "Campaign Ops", tier: "coordinator", model: "advanced-model", status: "busy", lastSeen: "Just now", tasksCompleted: 156, tokensUsed: 420_000, tools: ["read", "write", "sessions_send"], reportsTo: "content-brand-lead" },
  { id: "marketing-ops", name: "Marketing Ops", role: "Operations", tier: "coordinator", model: "advanced-model", status: "online", lastSeen: "5 min ago", tasksCompleted: 189, tokensUsed: 510_000, tools: ["read", "write", "browser", "cron", "sessions_send"], reportsTo: "growth-marketing-lead" },
  // Tier 3: Specialists
  { id: "competitive-intel", name: "Competitive Intel", role: "Research", tier: "specialist", model: "standard-model", status: "idle", lastSeen: "10 min ago", tasksCompleted: 87, tokensUsed: 210_000, tools: ["read", "write", "browser"], reportsTo: "product-marketing-lead" },
  { id: "audience-research", name: "Audience Research", role: "Research", tier: "specialist", model: "standard-model", status: "online", lastSeen: "2 min ago", tasksCompleted: 94, tokensUsed: 230_000, tools: ["read", "write", "browser"], reportsTo: "product-marketing-lead" },
  { id: "sales-enablement", name: "Sales Enablement", role: "Sales", tier: "specialist", model: "standard-model", status: "idle", lastSeen: "20 min ago", tasksCompleted: 76, tokensUsed: 180_000, tools: ["read", "write", "browser"], reportsTo: "product-marketing-lead" },
  { id: "product-launch", name: "Product Launch", role: "Launch", tier: "specialist", model: "standard-model", status: "offline", lastSeen: "2 hrs ago", tasksCompleted: 45, tokensUsed: 120_000, tools: ["read", "write", "browser"], reportsTo: "product-marketing-lead" },
  { id: "content-writer", name: "Content Writer", role: "Content", tier: "specialist", model: "standard-model", status: "busy", lastSeen: "Just now", tasksCompleted: 234, tokensUsed: 560_000, tools: ["read", "write", "browser"], reportsTo: "content-brand-lead" },
  { id: "content-repurposing", name: "Content Repurposing", role: "Content", tier: "specialist", model: "standard-model", status: "online", lastSeen: "8 min ago", tasksCompleted: 167, tokensUsed: 340_000, tools: ["read", "write"], reportsTo: "content-brand-lead" },
  { id: "designer", name: "Designer", role: "Design", tier: "specialist", model: "standard-model", status: "busy", lastSeen: "Just now", tasksCompleted: 145, tokensUsed: 380_000, tools: ["read", "write", "browser", "generate_image"], reportsTo: "content-brand-lead" },
  { id: "social-media", name: "Social Media", role: "Social", tier: "specialist", model: "standard-model", status: "online", lastSeen: "4 min ago", tasksCompleted: 198, tokensUsed: 290_000, tools: ["read", "write", "browser"], reportsTo: "content-brand-lead" },
  { id: "pr-comms", name: "PR & Comms", role: "PR", tier: "specialist", model: "standard-model", status: "idle", lastSeen: "30 min ago", tasksCompleted: 67, tokensUsed: 150_000, tools: ["read", "write", "browser"], reportsTo: "content-brand-lead" },
  { id: "seo", name: "SEO Specialist", role: "SEO", tier: "specialist", model: "standard-model", status: "online", lastSeen: "6 min ago", tasksCompleted: 123, tokensUsed: 270_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
  { id: "paid-media", name: "Paid Media", role: "Paid", tier: "specialist", model: "standard-model", status: "idle", lastSeen: "15 min ago", tasksCompleted: 89, tokensUsed: 200_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
  { id: "lifecycle-email", name: "Lifecycle & Email", role: "Email", tier: "specialist", model: "standard-model", status: "online", lastSeen: "7 min ago", tasksCompleted: 156, tokensUsed: 310_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
  { id: "social-listening", name: "Social Listening", role: "Listening", tier: "specialist", model: "standard-model", status: "online", lastSeen: "3 min ago", tasksCompleted: 112, tokensUsed: 250_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
  { id: "growth-analyst", name: "Growth Analyst", role: "Analytics", tier: "specialist", model: "standard-model", status: "busy", lastSeen: "Just now", tasksCompleted: 178, tokensUsed: 420_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
  { id: "ecosystem", name: "Ecosystem & Partnerships", role: "Partnerships", tier: "specialist", model: "standard-model", status: "idle", lastSeen: "45 min ago", tasksCompleted: 56, tokensUsed: 130_000, tools: ["read", "write", "browser"], reportsTo: "growth-marketing-lead" },
];

// ── Tasks ──
export const tasks: Task[] = [
  { id: "T-001", title: "Q2 Product Launch Campaign", description: "Full campaign for the new enterprise tier launch", status: "in_progress", priority: "critical", assignedTo: "campaign-producer", createdBy: "chief-marketing", createdAt: "2026-03-28", updatedAt: "2026-04-03", tags: ["campaign", "launch"] },
  { id: "T-002", title: "Competitive Analysis: Jasper AI", description: "Deep dive on Jasper's new enterprise features", status: "in_progress", priority: "high", assignedTo: "competitive-intel", createdBy: "product-marketing-lead", createdAt: "2026-04-01", updatedAt: "2026-04-03", tags: ["research", "competitive"] },
  { id: "T-003", title: "Blog Post: AI Marketing Trends 2026", description: "Long-form thought leadership piece", status: "review", priority: "medium", assignedTo: "content-writer", createdBy: "content-brand-lead", createdAt: "2026-03-30", updatedAt: "2026-04-02", tags: ["content", "blog"] },
  { id: "T-004", title: "LinkedIn Ad Creatives — Batch 3", description: "5 new ad variants for the ABM campaign", status: "in_progress", priority: "high", assignedTo: "designer", createdBy: "paid-media", createdAt: "2026-04-02", updatedAt: "2026-04-03", tags: ["design", "ads"] },
  { id: "T-005", title: "SEO Audit: /pricing page", description: "Technical SEO review and content optimization", status: "todo", priority: "medium", assignedTo: "seo", createdBy: "growth-marketing-lead", createdAt: "2026-04-03", updatedAt: "2026-04-03", tags: ["seo", "audit"] },
  { id: "T-006", title: "Email Nurture Sequence v2", description: "Revise the 5-email onboarding sequence", status: "in_progress", priority: "high", assignedTo: "lifecycle-email", createdBy: "marketing-ops", createdAt: "2026-03-25", updatedAt: "2026-04-03", tags: ["email", "nurture"] },
  { id: "T-007", title: "Social Listening Report: March", description: "Monthly brand mention analysis", status: "done", priority: "low", assignedTo: "social-listening", createdBy: "content-brand-lead", createdAt: "2026-04-01", updatedAt: "2026-04-02", tags: ["social", "report"] },
  { id: "T-008", title: "Partner Co-Marketing: TechCrunch", description: "Coordinate sponsored content with TechCrunch", status: "blocked", priority: "high", assignedTo: "ecosystem", createdBy: "chief-marketing", createdAt: "2026-03-20", updatedAt: "2026-04-01", tags: ["partnerships", "pr"] },
  { id: "T-009", title: "Audience Persona Refresh", description: "Update ICP and buyer personas with Q1 data", status: "todo", priority: "medium", assignedTo: "audience-research", createdBy: "product-marketing-lead", createdAt: "2026-04-03", updatedAt: "2026-04-03", tags: ["research", "personas"] },
  { id: "T-010", title: "Sales Deck Update", description: "Refresh the main sales presentation with new case studies", status: "backlog", priority: "low", assignedTo: "sales-enablement", createdBy: "product-marketing-lead", createdAt: "2026-04-03", updatedAt: "2026-04-03", tags: ["sales", "content"] },
  { id: "T-011", title: "Twitter/X Thread: Product Update", description: "Create a 10-tweet thread for the product update", status: "todo", priority: "medium", assignedTo: "social-media", createdBy: "content-brand-lead", createdAt: "2026-04-03", updatedAt: "2026-04-03", tags: ["social", "content"] },
  { id: "T-012", title: "Growth Dashboard KPIs", description: "Set up weekly KPI tracking dashboard", status: "in_progress", priority: "high", assignedTo: "growth-analyst", createdBy: "growth-marketing-lead", createdAt: "2026-03-29", updatedAt: "2026-04-03", tags: ["analytics", "dashboard"] },
];

// ── System Metrics (last 24 hours, hourly) ──
export const systemMetrics: SystemMetric[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${String(i).padStart(2, "0")}:00`,
  cpuPercent: Math.round(15 + Math.random() * 35 + (i >= 9 && i <= 17 ? 20 : 0)),
  memoryPercent: Math.round(40 + Math.random() * 20),
  activeConnections: Math.round(5 + Math.random() * 15 + (i >= 9 && i <= 17 ? 10 : 0)),
  requestsPerMinute: Math.round(20 + Math.random() * 80 + (i >= 9 && i <= 17 ? 60 : 0)),
}));

// ── LLM Providers for Portkey config ──
export const llmProviders = [
  { id: "anthropic", name: "Anthropic", models: ["Claude Sonnet 4", "Claude Opus 4", "Claude Haiku 4.5"], icon: "🟣" },
  { id: "openai", name: "OpenAI", models: ["GPT-4.1", "GPT-4.1 Mini", "GPT-4.1 Nano", "Codex Mini"], icon: "🟢" },
  { id: "google", name: "Google", models: ["Gemini 2.5 Pro", "Gemini 2.5 Flash"], icon: "🔵" },
  { id: "groq", name: "Groq", models: ["Llama 3.3 70B", "Llama 3.1 8B Instant"], icon: "🟠" },
  { id: "ollama", name: "Ollama (Local)", models: ["DeepSeek R1 14B", "Llama 3.3 70B"], icon: "⚫" },
];

// ── Channel configs ──
export const channelTypes = [
  { id: "telegram", name: "Telegram", description: "Connect via BotFather token", configFields: ["Bot Token"] },
  { id: "slack", name: "Slack", description: "Connect via Slack App OAuth", configFields: ["App Token", "Bot Token", "Signing Secret"] },
  { id: "whatsapp", name: "WhatsApp", description: "Connect via WhatsApp Business API", configFields: ["Phone Number ID", "Access Token", "Verify Token"] },
];
