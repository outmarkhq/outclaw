import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Palette,
  TrendingUp,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import DocPage from "@/components/DocPage";

interface Agent {
  name: string;
  id: string;
  layer: "Lead" | "Sub-Function Lead" | "Producer" | "Specialist";
  subFunction: "Strategy" | "Product Marketing" | "Content & Brand" | "Growth Marketing" | "Cross-Functional";
  description: string;
  modelTier: "Leader" | "Advanced" | "Standard";
  keyTasks: string[];
}

const agents: Agent[] = [
  {
    name: "Chief Marketing Agent",
    id: "chief-marketing",
    layer: "Lead",
    subFunction: "Strategy",
    description: "The lead agent. Routes incoming tasks to the right sub-function, enriches requests with company context from the knowledge base, reviews deliverables before they reach humans, and sets priorities based on quarterly goals.",
    modelTier: "Leader",
    keyTasks: ["Task routing & delegation", "Context enrichment", "Output quality review", "Priority setting"],
  },
  {
    name: "Product Marketing Lead Agent",
    id: "product-marketing-lead",
    layer: "Sub-Function Lead",
    subFunction: "Product Marketing",
    description: "Owns audience research, positioning, competitive intelligence, and go-to-market strategy. Coordinates the specialists who handle competitive intel, audience research, sales enablement, and product launches.",
    modelTier: "Leader",
    keyTasks: ["Positioning strategy", "Competitive oversight", "GTM coordination", "Specialist delegation"],
  },
  {
    name: "Content & Brand Lead Agent",
    id: "content-brand-lead",
    layer: "Sub-Function Lead",
    subFunction: "Content & Brand",
    description: "Owns content strategy, brand voice, and creative direction. Ensures all fuel (content, copy, design) is consistent, on-brand, and built for the right engine (channels).",
    modelTier: "Leader",
    keyTasks: ["Content calendar", "Brand voice governance", "Creative direction", "Fuel-engine alignment"],
  },
  {
    name: "Growth Marketing Lead Agent",
    id: "growth-marketing-lead",
    layer: "Sub-Function Lead",
    subFunction: "Growth Marketing",
    description: "Owns channel strategy, funnel optimization, and distribution. Ensures the engine is running efficiently and that growth specialists are testing, scaling, and measuring the right things.",
    modelTier: "Leader",
    keyTasks: ["Channel strategy", "Funnel optimization", "Growth experiments", "Engine performance"],
  },
  {
    name: "Campaign Producer Agent",
    id: "campaign-producer",
    layer: "Producer",
    subFunction: "Cross-Functional",
    description: "The connective tissue between fuel and engine. Orchestrates cross-functional campaigns by coordinating specialists from all three sub-functions. Creates and manages GACCS briefs for every campaign.",
    modelTier: "Advanced",
    keyTasks: ["Campaign orchestration", "GACCS brief creation", "Cross-team coordination", "Timeline management"],
  },
  {
    name: "Marketing Ops Agent",
    id: "marketing-ops",
    layer: "Producer",
    subFunction: "Cross-Functional",
    description: "Handles data, reporting, attribution, and tool integrations. Builds dashboards, tracks KPIs, and ensures the team has the analytics foundation to know what is working.",
    modelTier: "Advanced",
    keyTasks: ["KPI dashboards", "Attribution modeling", "Tool integrations", "Data hygiene"],
  },
  {
    name: "Competitive Intel Agent",
    id: "competitive-intel",
    layer: "Specialist",
    subFunction: "Product Marketing",
    description: "Monitors competitors, tracks market shifts, analyzes pricing changes, and produces competitive battle cards. One of the highest-value agents to deploy first.",
    modelTier: "Standard",
    keyTasks: ["Competitor monitoring", "Battle card creation", "Market shift alerts", "Pricing analysis"],
  },
  {
    name: "Audience Research Agent",
    id: "audience-research",
    layer: "Specialist",
    subFunction: "Product Marketing",
    description: "Conducts ICP and persona research, maps buyer journeys, identifies new segments, and synthesizes customer interview insights into actionable profiles.",
    modelTier: "Standard",
    keyTasks: ["ICP research", "Persona development", "Buyer journey mapping", "Segment identification"],
  },
  {
    name: "Sales Enablement Agent",
    id: "sales-enablement",
    layer: "Specialist",
    subFunction: "Product Marketing",
    description: "Creates battle cards, one-pagers, pitch decks, objection handling guides, and partner materials. Bridges the gap between marketing and sales.",
    modelTier: "Standard",
    keyTasks: ["Battle cards", "Pitch decks", "Objection handling", "Sales collateral"],
  },
  {
    name: "Product Launch Agent",
    id: "product-launch",
    layer: "Specialist",
    subFunction: "Product Marketing",
    description: "Plans and coordinates product launches and feature releases. Creates launch briefs, coordinates messaging across channels, and manages launch timelines.",
    modelTier: "Standard",
    keyTasks: ["Launch planning", "GTM execution", "Cross-channel messaging", "Launch retrospectives"],
  },
  {
    name: "Content Writer Agent",
    id: "content-writer",
    layer: "Specialist",
    subFunction: "Content & Brand",
    description: "Writes long-form content: blog posts, newsletters, thought leadership articles, whitepapers, and case studies. Follows brand voice guidelines and optimizes for the target audience.",
    modelTier: "Standard",
    keyTasks: ["Blog posts", "Thought leadership", "Whitepapers", "Case studies"],
  },
  {
    name: "Content Repurposing Agent",
    id: "content-repurposing",
    layer: "Specialist",
    subFunction: "Content & Brand",
    description: "Transforms long-form content into social posts, email snippets, video scripts, and ad copy. Maximizes the value of every piece of content you produce.",
    modelTier: "Standard",
    keyTasks: ["Social post extraction", "Email snippet creation", "Video script adaptation", "Ad copy derivation"],
  },
  {
    name: "Designer Agent",
    id: "designer",
    layer: "Specialist",
    subFunction: "Content & Brand",
    description: "Creates brand assets, campaign visuals, social graphics, presentation templates, and web design mockups. Maintains visual consistency across all touchpoints.",
    modelTier: "Standard",
    keyTasks: ["Campaign visuals", "Social graphics", "Presentation design", "Brand asset creation"],
  },
  {
    name: "Social Media Agent",
    id: "social-media",
    layer: "Specialist",
    subFunction: "Content & Brand",
    description: "Manages LinkedIn, X/Twitter, and community engagement. Drafts posts, schedules content, responds to comments, and tracks engagement metrics.",
    modelTier: "Standard",
    keyTasks: ["Post drafting", "Content scheduling", "Community engagement", "Engagement tracking"],
  },
  {
    name: "PR & Comms Agent",
    id: "pr-comms",
    layer: "Specialist",
    subFunction: "Content & Brand",
    description: "Writes press releases, media pitches, and executive communications. Monitors media coverage and identifies PR opportunities.",
    modelTier: "Standard",
    keyTasks: ["Press releases", "Media pitches", "Executive comms", "Coverage monitoring"],
  },
  {
    name: "SEO Agent",
    id: "seo",
    layer: "Specialist",
    subFunction: "Growth Marketing",
    description: "Handles technical SEO audits, keyword research, content optimization recommendations, and search performance tracking. Ensures organic content is discoverable.",
    modelTier: "Standard",
    keyTasks: ["Keyword research", "Technical SEO audits", "Content optimization", "Rank tracking"],
  },
  {
    name: "Paid Media Agent",
    id: "paid-media",
    layer: "Specialist",
    subFunction: "Growth Marketing",
    description: "Creates ad copy, manages campaign structure, runs A/B tests, and optimizes spend across Google Ads, LinkedIn Ads, and other paid channels.",
    modelTier: "Standard",
    keyTasks: ["Ad copywriting", "Campaign structure", "A/B testing", "Budget optimization"],
  },
  {
    name: "Lifecycle Email Agent",
    id: "lifecycle-email",
    layer: "Specialist",
    subFunction: "Growth Marketing",
    description: "Builds email sequences, drip campaigns, onboarding flows, and retention campaigns. Optimizes subject lines, send times, and segmentation.",
    modelTier: "Standard",
    keyTasks: ["Drip campaigns", "Onboarding flows", "Subject line testing", "Segmentation"],
  },
  {
    name: "Social Listening Agent",
    id: "social-listening",
    layer: "Specialist",
    subFunction: "Growth Marketing",
    description: "Monitors brand mentions, industry conversations, and competitor activity across social platforms. Surfaces insights and opportunities from public conversations.",
    modelTier: "Standard",
    keyTasks: ["Brand monitoring", "Sentiment analysis", "Trend detection", "Opportunity alerts"],
  },
  {
    name: "Growth Analyst Agent",
    id: "growth-analyst",
    layer: "Specialist",
    subFunction: "Growth Marketing",
    description: "Builds KPI dashboards, detects anomalies, produces weekly performance reports, and identifies growth opportunities. One of the highest-ROI agents for data-driven teams.",
    modelTier: "Standard",
    keyTasks: ["Weekly reports", "Anomaly detection", "KPI dashboards", "Growth opportunity identification"],
  },
  {
    name: "Ecosystem Agent",
    id: "ecosystem",
    layer: "Specialist",
    subFunction: "Cross-Functional",
    description: "Handles partner research, co-marketing campaigns, community management, and customer story development. Bridges external relationships with internal marketing efforts.",
    modelTier: "Standard",
    keyTasks: ["Partner research", "Co-marketing", "Community management", "Customer stories"],
  },
];

const layerConfig: Record<string, { color: string; badge: string }> = {
  Lead: { color: "bg-slate-800", badge: "bg-slate-100 text-slate-800" },
  "Sub-Function Lead": { color: "bg-teal-600", badge: "bg-teal-50 text-teal-700" },
  Producer: { color: "bg-violet-600", badge: "bg-violet-50 text-violet-700" },
  Specialist: { color: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
};

const subFunctionConfig: Record<string, { icon: typeof Brain; color: string }> = {
  Strategy: { icon: Brain, color: "text-slate-600" },
  "Product Marketing": { icon: Target, color: "text-teal-600" },
  "Content & Brand": { icon: Palette, color: "text-rose-500" },
  "Growth Marketing": { icon: TrendingUp, color: "text-amber-600" },
  "Cross-Functional": { icon: Layers, color: "text-violet-600" },
};

const tierColors: Record<string, string> = {
  Leader: "bg-amber-100 text-amber-800",
  Advanced: "bg-blue-100 text-blue-800",
  Standard: "bg-slate-100 text-slate-700",
};

const subFunctionOrder = ["Strategy", "Product Marketing", "Content & Brand", "Growth Marketing", "Cross-Functional"];

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLayer, setFilterLayer] = useState<string>("All");
  const [filterSubFunction, setFilterSubFunction] = useState<string>("All");
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const filtered = agents.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLayer = filterLayer === "All" || a.layer === filterLayer;
    const matchesSF = filterSubFunction === "All" || a.subFunction === filterSubFunction;
    return matchesSearch && matchesLayer && matchesSF;
  });

  const grouped = filtered.reduce(
    (acc, agent) => {
      const key = agent.subFunction;
      if (!acc[key]) acc[key] = [];
      acc[key].push(agent);
      return acc;
    },
    {} as Record<string, Agent[]>
  );

  return (
    <DocPage
      title="Agent Roster"
      subtitle="21 agents organized into the three sub-functions every B2B marketing team needs. Every agent has native browser access via browser-harness."
    >
      {/* Naming Philosophy */}
      <div className="mb-10 p-6 rounded-xl bg-slate-50 border border-slate-200 not-prose">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Why descriptive names</h3>
        <p className="text-slate-600 leading-relaxed">
          Every agent is named by
          what it does &mdash; <strong>Competitive Intel Agent</strong>, not &ldquo;Scout&rdquo;.
          Hierarchy is shown by grouping (Lead &rarr; Producer &rarr; Specialist), not
          encoded in the name. Human titles stay distinct: your human is &ldquo;Head of
          Product Marketing&rdquo;, the agent is &ldquo;Product Marketing Lead Agent&rdquo;.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 not-prose">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
        <select
          value={filterLayer}
          onChange={(e) => setFilterLayer(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        >
          <option value="All">All Layers</option>
          <option value="Lead">Lead</option>
          <option value="Sub-Function Lead">Sub-Function Lead</option>
          <option value="Producer">Producer</option>
          <option value="Specialist">Specialist</option>
        </select>
        <select
          value={filterSubFunction}
          onChange={(e) => setFilterSubFunction(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        >
          <option value="All">All Sub-Functions</option>
          <option value="Strategy">Strategy</option>
          <option value="Product Marketing">Product Marketing</option>
          <option value="Content & Brand">Content & Brand</option>
          <option value="Growth Marketing">Growth Marketing</option>
          <option value="Cross-Functional">Cross-Functional</option>
        </select>
      </div>

      <p className="text-sm text-slate-500 mb-6 not-prose">
        Showing {filtered.length} of {agents.length} agents
      </p>

      {/* Agent Groups */}
      <div className="space-y-10 not-prose">
        {subFunctionOrder.map((sf) => {
          const group = grouped[sf];
          if (!group || group.length === 0) return null;
          const config = subFunctionConfig[sf];
          const Icon = config.icon;

          return (
            <div key={sf}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <h2 className="text-xl font-bold text-slate-900">{sf}</h2>
                <span className="text-sm text-slate-400">({group.length})</span>
              </div>
              <div className="space-y-3">
                {group.map((agent, i) => {
                  const lc = layerConfig[agent.layer];
                  const isExpanded = expandedAgent === agent.id;
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`rounded-xl border ${isExpanded ? "border-teal-200 shadow-md" : "border-slate-200"} bg-white overflow-hidden transition-all`}
                    >
                      <button
                        onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
                      >
                        <div className={`w-2 h-10 rounded-full ${lc.color} flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-slate-900">{agent.name}</h3>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${lc.badge}`}>
                              {agent.layer}
                            </span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${tierColors[agent.modelTier]}`}>
                              {agent.modelTier} Tier
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5 truncate">{agent.description}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                          <div className="grid sm:grid-cols-2 gap-6 mt-4">
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">{agent.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Tasks</h4>
                              <ul className="space-y-1">
                                {agent.keyTasks.map((task) => (
                                  <li key={task} className="text-sm text-slate-600 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                            <span>Agent ID: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{agent.id}</code></span>
                            <span>Model Tier: <strong className="text-slate-700">{agent.modelTier}</strong></span>
                            <span>Workspace: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">workspaces/{agent.id}/</code></span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workspace Files */}
      <div className="mt-12 p-6 rounded-xl bg-slate-50 border border-slate-200 not-prose">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Agent workspace structure</h3>
        <p className="text-sm text-slate-600 mb-4">
          Each agent has a workspace directory with these files:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { file: "SOUL.md", desc: "Identity, personality, expertise, and behavioral rules" },
            { file: "AGENTS.md", desc: "Operational instructions, tool access, and delegation rules" },
            { file: "MEMORY.md", desc: "Persistent memory for context across sessions" },
            { file: "skills/", desc: "Reusable skill files (Markdown) the agent can reference" },
            { file: "training/", desc: "Few-shot examples and calibration data" },
            { file: "browser-harness/", desc: "Browser access via CDP — research, scrape, monitor, interact with the web" },
          ].map((item) => (
            <div key={item.file} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200">
              <code className="text-xs font-mono bg-teal-50 text-teal-700 px-2 py-1 rounded flex-shrink-0">
                {item.file}
              </code>
              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </DocPage>
  );
}
