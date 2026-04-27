/*
 * Outclaw — Architecture Page
 * Clean architecture: AlphaClaw = the harness (setup, observability, management)
 * Command Center = outer control layer (visibility, governance, kickoff)
 */
import { Layers } from "lucide-react";
import DocPage from "@/components/DocPage";
import { motion } from "framer-motion";

const ARCH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306550909/iuGjwtGPwe2tLuJLPpTZVn/architecture-diagram-bg-BNMLc3DYTV2ffnbDmJFEHf.webp";

const layers = [
  {
    name: "Layer 1 — Lead Agent",
    agents: "Chief Marketing Agent",
    modelTier: "Leader tier (Claude Opus / GPT-4.1 / Gemini 2.5 Pro)",
    color: "bg-slate-800",
    description: "The Chief Marketing Agent is the primary interface between humans and the agent team. It receives all incoming requests (via chat or GACCS briefs), enriches them with company context from the knowledge base, routes tasks to the appropriate sub-function lead, and reviews all deliverables before they reach humans. It maintains the annual marketing plan and ensures all work aligns with strategic goals.",
  },
  {
    name: "Layer 2 — Sub-Function Leads",
    agents: "Product Marketing Lead, Content & Brand Lead, Growth Marketing Lead",
    modelTier: "Leader tier (Claude Sonnet / GPT-4.1-mini / Gemini 2.5 Flash)",
    color: "bg-teal-600",
    description: "Three leads map directly to the three core B2B marketing sub-functions. The Product Marketing Lead Agent owns audience research, positioning, competitive intel, and launches. The Content & Brand Lead Agent owns content strategy, brand voice, and creative direction. The Growth Marketing Lead Agent owns channel strategy, funnel optimization, paid media, and lifecycle. Each lead delegates specialist work to their team and reviews output before escalating.",
  },
  {
    name: "Layer 3 — Producer Agents",
    agents: "Campaign Producer Agent, Marketing Ops Agent",
    modelTier: "Advanced tier (Claude Sonnet / GPT-4.1-mini)",
    color: "bg-violet-600",
    description: "The Campaign Producer Agent orchestrates campaigns that span multiple sub-functions — managing GACCS briefs, timelines, and stakeholder coordination. The Marketing Ops Agent owns data infrastructure, reporting, attribution, and tool integrations. Both report directly to the Chief Marketing Agent and serve all three sub-functions.",
  },
  {
    name: "Layer 4 — Specialist Agents",
    agents: "15 specialists across all sub-functions",
    modelTier: "Standard tier (Claude Haiku / GPT-4.1-nano / Gemini 2.5 Flash)",
    color: "bg-amber-500",
    description: "Specialists execute the actual marketing work. Product Marketing has the Competitive Intel Agent, Audience Research Agent, Sales Enablement Agent, and Product Launch Agent. Content & Brand has the Content Writer Agent, Content Repurposing Agent, Designer Agent, Social Media Agent, and PR & Comms Agent. Growth Marketing has the SEO Agent, Paid Media Agent, Lifecycle Email Agent, Social Listening Agent, and Growth Analyst Agent. The Ecosystem Agent handles cross-functional partner marketing.",
  },
];

export default function Architecture() {
  return (
    <DocPage
      title="Architecture"
      subtitle="Four-layer hierarchy modeled on how the best B2B marketing teams actually operate"
      icon={<Layers size={24} />}
      prevPage={{ path: "/getting-started", label: "Getting Started" }}
      nextPage={{ path: "/agents", label: "Agent Roster" }}
    >
      <h2>Design Philosophy</h2>
      <p>
        Outclaw's architecture follows a core principle: every marketing team,
        regardless of size, needs three sub-functions — <strong>Product Marketing</strong>,
        <strong> Content &amp; Brand</strong>, and <strong>Growth Marketing</strong>. These aren't
        arbitrary divisions; they represent the fundamental types of marketing work that must happen
        for a B2B company to succeed.
      </p>
      <p>
        The four-layer hierarchy adds structure on top of these sub-functions. The lead agent
        provides strategic oversight. Sub-function leads own their domain. Producer agents handle
        work that spans multiple sub-functions. And specialist agents execute the actual tasks.
        This mirrors how real marketing teams scale, from a 3-person startup team to a 25+ person
        department.
      </p>

      <h2>The Core Decision: Who Is the Real Manager?</h2>
      <p>
        When you have two systems — AlphaClaw (the agent harness) and the Command Center
        (the management dashboard) — the most important architectural decision is:
        <strong> who is the real manager?</strong>
      </p>
      <p>
        For Outclaw, the answer is clear:
      </p>
      <blockquote>
        <p>
          <strong>AlphaClaw is the true manager.</strong> It owns delegation, chain of command,
          review, feedback loops, and escalation. The full hierarchy lives inside AlphaClaw.
          <br /><br />
          <strong>The Command Center is the outer control layer.</strong> It provides visibility,
          governance, budgets, audit trail, and top-level kickoff. It sits above AlphaClaw,
          not inside it.
        </p>
      </blockquote>
      <p>
        If both systems try to act like the manager, the org becomes blurry. You stop
        knowing who is actually assigning work, who is allowed to bypass whom, who reviews
        what, and who has final responsibility. That creates broken chain of command, weak
        review flow, and outputs reaching the human before proper refinement.
      </p>

      <h2>How a Task Flows Through the System</h2>
      <p>
        The full delegation and review chain lives inside AlphaClaw. The Command Center passes the
        task in at the top and receives the final output at the end. Everything in between
        is managed by the agent hierarchy.
      </p>

      <div className="not-prose my-8 bg-slate-50 border border-slate-200 p-5 sm:p-6 text-sm">
        <div className="font-mono text-xs text-slate-400 mb-4 uppercase tracking-wider">Task Flow</div>
        <div className="space-y-1.5">
          <div className="text-slate-500">Human submits GACCS brief</div>
          <div className="text-slate-400 pl-4">↓</div>
          <div className="text-slate-500">Command Center passes it to Chief Marketing Agent</div>
          <div className="text-slate-400 pl-4">↓</div>
          <div className="text-slate-900 font-semibold">Chief Marketing Agent decides which sub-function owns this</div>
          <div className="text-slate-400 pl-4">↓</div>
          <div className="text-slate-900 font-semibold">Sub-Function Lead refines the request</div>
          <div className="text-slate-400 pl-4">↓</div>
          <div className="text-slate-900 font-semibold">Specialist executes the work</div>
          <div className="text-slate-400 pl-4">↓</div>
          <div className="text-slate-400 pl-4 italic">— then back up the same chain for review —</div>
          <div className="text-slate-400 pl-4">↑</div>
          <div className="text-slate-900 font-semibold">Sub-Function Lead reviews</div>
          <div className="text-slate-400 pl-4">↑</div>
          <div className="text-slate-900 font-semibold">Chief Marketing Agent reviews and synthesizes</div>
          <div className="text-slate-400 pl-4">↑</div>
          <div className="text-slate-500">Final output returned to human via Command Center</div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-400">
          Bold items = inside AlphaClaw. Every output is reviewed at every level before it reaches the human.
        </div>
      </div>

      <p>
        This preserves both <strong>authority</strong> and <strong>quality control</strong>.
        No agent bypasses its reporting line. No specialist sends raw work directly to the
        human. If a reviewer sends work back for revision, it goes to the right agent — not
        back to the human.
      </p>

      {/* Architecture visual */}
      <div className="my-10 overflow-hidden border border-slate-200 shadow-lg not-prose">
        <img src={ARCH_IMG} alt="Outclaw architecture diagram" className="w-full" />
      </div>

      {/* Layer breakdown */}
      <h2>Layer Breakdown</h2>
      <div className="space-y-6 not-prose my-8">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-white border border-slate-200 overflow-hidden"
          >
            <div className={`${layer.color} px-5 py-3`}>
              <h3 className="text-white font-bold tracking-tight text-base">{layer.name}</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-4 mb-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-900">Agents: </span>
                  <span className="text-slate-600">{layer.agents}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Models: </span>
                  <span className="text-slate-600">{layer.modelTier}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{layer.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <h2>Communication Patterns</h2>
      <p>
        Agents communicate through AlphaClaw's built-in delegation tools. The key patterns are:
      </p>
      <ul>
        <li><strong>Top-down delegation:</strong> The Chief Marketing Agent delegates to sub-function leads via <code>sessions_spawn</code>. Leads delegate to specialists the same way.</li>
        <li><strong>Bottom-up review:</strong> Specialists return completed work to their lead. Leads review, then return to the Chief Marketing Agent. The Chief Marketing Agent reviews and synthesizes before returning to the human. Work flows back up the same chain it came down.</li>
        <li><strong>Cross-functional coordination:</strong> The Campaign Producer Agent can spawn tasks across any sub-function for campaigns that need multiple specialists.</li>
        <li><strong>Feedback loops:</strong> If a reviewer sends work back for revision, it goes to the right agent inside AlphaClaw — not back to the human. Revision stays inside the org until the output meets quality standards.</li>
        <li><strong>Human-in-the-loop:</strong> The Chief Marketing Agent flags deliverables for human review based on GACCS brief stakeholder fields and configured approval thresholds.</li>
      </ul>

      <h2>Knowledge Base Architecture</h2>
      <p>
        All agents share access to a centralized knowledge base organized into domains:
      </p>
      <table>
        <thead>
          <tr><th>Domain</th><th>Contents</th><th>Primary Consumers</th></tr>
        </thead>
        <tbody>
          <tr><td><code>company/</code></td><td>Mission, values, history, team, goals</td><td>All agents</td></tr>
          <tr><td><code>brand/</code></td><td>Voice guidelines, visual identity, messaging</td><td>Content & Brand Lead, Content Writer, Designer, Social Media</td></tr>
          <tr><td><code>product/</code></td><td>Features, pricing, roadmap, technical specs</td><td>Product Marketing Lead, Sales Enablement, Product Launch</td></tr>
          <tr><td><code>market/</code></td><td>ICP profiles, personas, buyer journeys</td><td>Product Marketing Lead, Audience Research, Paid Media</td></tr>
          <tr><td><code>competitors/</code></td><td>Competitive landscape, battle cards</td><td>Competitive Intel, Sales Enablement, Product Marketing Lead</td></tr>
          <tr><td><code>campaigns/</code></td><td>Active campaigns, past results, calendars</td><td>Campaign Producer, Growth Marketing Lead, all specialists</td></tr>
          <tr><td><code>customers/</code></td><td>Case studies, testimonials, success stories</td><td>Ecosystem, Sales Enablement, Content Writer</td></tr>
        </tbody>
      </table>

      <h2>Model Tier Strategy</h2>
      <p>
        Outclaw uses a multi-provider, multi-tier model strategy. Higher-layer agents that make
        strategic decisions use more capable (and expensive) models, while specialist agents use
        cost-effective models for execution tasks:
      </p>
      <table>
        <thead>
          <tr><th>Tier</th><th>Used By</th><th>Recommended Models</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Leader</strong></td><td>Chief Marketing Agent, Sub-Function Leads</td><td>Claude Opus, GPT-4.1, Gemini 2.5 Pro</td></tr>
          <tr><td><strong>Advanced</strong></td><td>Campaign Producer, Marketing Ops</td><td>Claude Sonnet, GPT-4.1-mini</td></tr>
          <tr><td><strong>Standard</strong></td><td>All 15 Specialist Agents</td><td>Claude Haiku, GPT-4.1-nano, Gemini 2.5 Flash</td></tr>
        </tbody>
      </table>
    </DocPage>
  );
}
