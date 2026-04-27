import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronRight,
  FileText,
  Key,
  Layers,
  MessageSquare,
  Settings,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

type DocSection = {
  id: string;
  title: string;
  icon: typeof Brain;
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
  return (
    <nav className="space-y-0.5">
      {sections.map((s) => {
        const Icon = s.icon;
        const isActive = activeId === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-all rounded-md ${
              isActive
                ? "bg-white/[0.06] text-white font-semibold"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {s.title}
          </button>
        );
      })}
    </nav>
  );
}

const sections: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Getting Started with Outclaw SaaS
          </h2>
          <p className="text-white/40 leading-relaxed">
            Outclaw is a 21-agent AI marketing team that mirrors a real B2B marketing
            organization. This guide walks you through setup in under 5 minutes.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">1. Create your account</h3>
          <p className="text-white/40 leading-relaxed">
            Sign up with Google or email. You will be taken to the onboarding wizard
            automatically.
          </p>

          <h3 className="text-lg font-bold">2. Create a workspace</h3>
          <p className="text-white/40 leading-relaxed">
            Your workspace is your isolated environment. Each workspace gets its own
            21 agents, knowledge base, and settings. Name it after your company or
            project (e.g., "Acme Marketing").
          </p>

          <h3 className="text-lg font-bold">3. Connect your LLM provider</h3>
          <p className="text-white/40 leading-relaxed">
            Outclaw uses your own LLM API keys. We support OpenAI, Anthropic,
            Google, OpenRouter, and any OpenAI-compatible provider. Enter your API key
            during onboarding — it is encrypted and never shared.
          </p>
          <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4 text-sm text-white/50">
            <p className="font-semibold text-white/70 mb-2">Recommended model tiers:</p>
            <ul className="space-y-1">
              <li><span className="text-white/70">Leaders (CMA + Leads):</span> Claude Opus / GPT-4</li>
              <li><span className="text-white/70">Coordinators:</span> Claude Sonnet / GPT-4o</li>
              <li><span className="text-white/70">Specialists:</span> Claude Haiku / GPT-4o-mini</li>
            </ul>
          </div>

          <h3 className="text-lg font-bold">4. Configure channels (optional)</h3>
          <p className="text-white/40 leading-relaxed">
            Connect Telegram, Slack, or WhatsApp to submit briefs from your existing
            tools. This step is optional — you can always submit briefs through the
            web interface.
          </p>

          <h3 className="text-lg font-bold">5. Submit your first GACCS brief</h3>
          <p className="text-white/40 leading-relaxed">
            Navigate to "New Request" in the Command Center and fill out a GACCS brief.
            The Chief Marketing Agent will analyze it, enrich it with context, and route
            it to the right sub-function. You will see it move through the orchestration
            pipeline in real time.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "gaccs",
    title: "Writing GACCS Briefs",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            How to Write Effective GACCS Briefs
          </h2>
          <p className="text-white/40 leading-relaxed">
            GACCS stands for Goals, Audience, Creative, Channels, Stakeholders. It is
            the structured brief format that replaces ad-hoc prompts and ensures the
            Chief Marketing Agent has everything it needs.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              letter: "G",
              label: "Goals",
              color: "bg-emerald-500",
              good: "Increase inbound demo requests by 25% in Q3 through a competitive positioning campaign targeting mid-market SaaS buyers.",
              bad: "Write some marketing content.",
              tip: "Be specific about the business outcome, not just the deliverable. Include metrics and timeframes.",
            },
            {
              letter: "A",
              label: "Audience",
              color: "bg-blue-500",
              good: "VP of Engineering at Series B-D SaaS companies (50-500 employees) evaluating build-vs-buy for internal tooling. They read Hacker News, follow engineering blogs, and attend DevOps conferences.",
              bad: "Tech people.",
              tip: "Include job titles, company stage, pain points, content consumption habits, and decision-making authority.",
            },
            {
              letter: "C",
              label: "Creative",
              color: "bg-violet-500",
              good: "2,000-word long-form blog post. Authoritative but approachable tone. Include 2-3 data points from industry reports. Follow our brand voice guide. No jargon.",
              bad: "A blog post.",
              tip: "Specify format, tone, length, style, data requirements, and any brand constraints.",
            },
            {
              letter: "C",
              label: "Channels",
              color: "bg-amber-500",
              good: "Primary: Company blog + LinkedIn organic. Secondary: Repurpose into 3 LinkedIn posts, 1 Twitter thread, and an email to our nurture list.",
              bad: "Social media.",
              tip: "Think about primary distribution and repurposing. The Content Repurposing Agent can turn one asset into many.",
            },
            {
              letter: "S",
              label: "Stakeholders",
              color: "bg-rose-500",
              good: "Product Marketing Lead reviews positioning accuracy. VP Marketing gives final approval. Legal review needed if we reference competitor names.",
              bad: "(left blank)",
              tip: "The CMA and sub-function leads are always in the review loop. Add any human stakeholders who need to sign off.",
            },
          ].map((g, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${g.color} text-white font-extrabold text-sm flex items-center justify-center rounded`}>
                  {g.letter}
                </div>
                <h3 className="font-bold text-lg">{g.label}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded p-3">
                  <p className="text-[11px] font-semibold text-emerald-400 mb-1">Good example</p>
                  <p className="text-sm text-white/50">{g.good}</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded p-3">
                  <p className="text-[11px] font-semibold text-red-400 mb-1">Weak example</p>
                  <p className="text-sm text-white/50">{g.bad}</p>
                </div>
              </div>
              <p className="text-sm text-white/30 flex items-start gap-2">
                <Target className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white/20" />
                {g.tip}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-white/50">
            <strong className="text-white/70">Not all fields are required.</strong>{" "}
            The CMA can work with partial briefs. But the more context you provide,
            the better the output. At minimum, fill in Goals and Audience for the
            best results.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "agents",
    title: "Understanding Agents",
    icon: Brain,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            The 21-Agent Team Structure
          </h2>
          <p className="text-white/40 leading-relaxed">
            Outclaw mirrors a real B2B marketing organization with three sub-functions,
            each led by a dedicated agent. The Chief Marketing Agent sits above all three
            and orchestrates everything.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">The Chief Marketing Agent (CMA)</h3>
          <p className="text-white/40 leading-relaxed">
            The CMA is the most important agent. It receives every GACCS brief, enriches
            it with company context, decides which sub-function owns the work, and stays
            in the approval loop for every deliverable. The CMA uses a top-tier model
            (Claude Opus / GPT-4) because its judgment directly affects output quality.
          </p>

          <h3 className="text-lg font-bold">Sub-Function Leads</h3>
          <p className="text-white/40 leading-relaxed">
            Each sub-function has a lead agent that manages its specialists. The lead
            decomposes briefs into specialist tasks, reviews specialist output, and
            escalates to the CMA for final approval.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Sub-Function</th>
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Lead</th>
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Specialists</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70 font-medium">Product Marketing</td>
                  <td className="py-2 px-3 text-white/40">Product Marketing Lead</td>
                  <td className="py-2 px-3 text-white/40">Competitive Intel, Audience Research, Sales Enablement, Product Launch</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70 font-medium">Content & Brand</td>
                  <td className="py-2 px-3 text-white/40">Content & Brand Lead</td>
                  <td className="py-2 px-3 text-white/40">Content Writer, Content Repurposing, Designer, Social Media, PR & Comms</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white/70 font-medium">Growth Marketing</td>
                  <td className="py-2 px-3 text-white/40">Growth Marketing Lead</td>
                  <td className="py-2 px-3 text-white/40">SEO, Paid Media, Lifecycle Email, Social Listening, Growth Analyst</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold">Coordinators</h3>
          <p className="text-white/40 leading-relaxed">
            Two cross-functional agents support the entire team: the Campaign Producer
            (orchestrates multi-channel campaigns) and Marketing Ops (data, reporting,
            attribution, tool integrations).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "orchestration",
    title: "Orchestration Flow",
    icon: Layers,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            How Orchestration Works
          </h2>
          <p className="text-white/40 leading-relaxed">
            Every GACCS brief follows a defined orchestration chain. This is not a
            flat chatbot interaction — it is a structured workflow with review gates
            at every level.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { step: "1", title: "CMA Review", desc: "The Chief Marketing Agent receives your brief, pulls knowledge base context, enriches the request, and decides which sub-function should own this work." },
            { step: "2", title: "Lead Assignment", desc: "The sub-function lead receives the enriched brief from the CMA. The lead decomposes it into specialist tasks — for example, a content campaign might need the Content Writer for the blog post and the Social Media Agent for distribution." },
            { step: "3", title: "Specialist Work", desc: "Each specialist executes within its domain. The Content Writer follows brand voice guidelines. The SEO Agent follows keyword strategy. The Paid Media Agent follows channel budgets." },
            { step: "4", title: "Lead Review", desc: "The sub-function lead reviews specialist output for quality, consistency, and alignment with the original brief." },
            { step: "5", title: "CMA Approval", desc: "The CMA reviews the final output against company-wide context. The CMA checks for consistency across sub-functions, brand alignment, and strategic fit." },
            { step: "6", title: "Human Review", desc: "The output is delivered to you for final sign-off. You can approve, request changes, or escalate." },
          ].map((s) => (
            <div key={s.step} className="flex gap-4 py-3 border-b border-white/[0.06] last:border-0">
              <span className="text-[#F5C542] font-bold text-sm w-6 flex-shrink-0 mt-0.5">
                {s.step}
              </span>
              <div>
                <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4">
          <p className="text-sm text-white/50">
            <strong className="text-white/70">Key principle:</strong> The CMA is always
            in the approval loop. It does not do the execution work most of the time,
            but it always has the greatest judgment because it holds company-wide context.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "api-keys",
    title: "API Keys & Models",
    icon: Key,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Configuring API Keys & Models
          </h2>
          <p className="text-white/40 leading-relaxed">
            Outclaw uses your own LLM API keys. This means you control costs,
            model selection, and data privacy.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Supported providers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Provider</th>
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Key format</th>
                  <th className="text-left py-2 px-3 text-white/60 font-semibold">Where to get it</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70">OpenAI</td>
                  <td className="py-2 px-3 text-white/40 font-mono text-xs">sk-...</td>
                  <td className="py-2 px-3 text-white/40">platform.openai.com/api-keys</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70">Anthropic</td>
                  <td className="py-2 px-3 text-white/40 font-mono text-xs">sk-ant-...</td>
                  <td className="py-2 px-3 text-white/40">console.anthropic.com</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70">Google</td>
                  <td className="py-2 px-3 text-white/40 font-mono text-xs">AIza...</td>
                  <td className="py-2 px-3 text-white/40">aistudio.google.com</td>
                </tr>
                <tr className="border-b border-white/[0.06]">
                  <td className="py-2 px-3 text-white/70">OpenRouter</td>
                  <td className="py-2 px-3 text-white/40 font-mono text-xs">sk-or-...</td>
                  <td className="py-2 px-3 text-white/40">openrouter.ai/keys</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white/70">Custom</td>
                  <td className="py-2 px-3 text-white/40 font-mono text-xs">varies</td>
                  <td className="py-2 px-3 text-white/40">Any OpenAI-compatible endpoint</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold">Cost estimates</h3>
          <p className="text-white/40 leading-relaxed">
            A typical GACCS brief costs $0.02–0.10 in LLM API usage, depending on
            the complexity and number of agents involved. For moderate usage (50–100
            briefs/month), expect $170–460/month in LLM costs.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "channels",
    title: "Channels & Integrations",
    icon: MessageSquare,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Connecting Channels
          </h2>
          <p className="text-white/40 leading-relaxed">
            Submit GACCS briefs from your existing tools. Channels are optional —
            you can always use the web interface.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Telegram</h3>
          <p className="text-white/40 leading-relaxed">
            Create a Telegram bot via @BotFather, copy the bot token, and paste it
            in Settings → Channels. Send GACCS briefs directly to your bot.
          </p>

          <h3 className="text-lg font-bold">Slack</h3>
          <p className="text-white/40 leading-relaxed">
            Create a Slack app, add a bot token with chat:write and channels:read
            scopes, and paste the token in Settings → Channels.
          </p>

          <h3 className="text-lg font-bold">WhatsApp</h3>
          <p className="text-white/40 leading-relaxed">
            Connect via the WhatsApp Business API. Paste your access token in
            Settings → Channels.
          </p>

          <h3 className="text-lg font-bold">API</h3>
          <p className="text-white/40 leading-relaxed">
            Use the REST API to submit briefs programmatically. See the API
            documentation for endpoint details and authentication.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    icon: Settings,
    content: (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Troubleshooting
          </h2>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "My API key is not working",
              a: "Verify the key is active in your provider's dashboard. Check that you have sufficient credits/balance. Ensure the key has the correct permissions (chat completions access).",
            },
            {
              q: "Agents are not responding to briefs",
              a: "Check the orchestration pipeline in the Dashboard. If tasks are stuck at 'CMA Review', verify your LLM API key is configured correctly in Settings → LLM.",
            },
            {
              q: "Output quality is poor",
              a: "Ensure you are using appropriate model tiers. Leaders should use top-tier models (Claude Opus / GPT-4). Also check your GACCS brief — more specific briefs produce better output.",
            },
            {
              q: "I cannot see my workspace",
              a: "You may need to be invited as a member. Ask your workspace admin to send you an invite.",
            },
            {
              q: "Channel messages are not being received",
              a: "Verify the bot token is correct and the bot has the necessary permissions. For Telegram, ensure the bot is added to the group. For Slack, check the app's OAuth scopes.",
            },
          ].map((item, i) => (
            <div key={i} className="border border-white/10 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2">{item.q}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function SaaSDocs() {
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState("getting-started");

  const currentSection = sections.find((s) => s.id === activeSection) ?? sections[0];

  return (
    <div className="min-h-screen bg-[oklch(0.05_0_0)] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[oklch(0.05_0_0)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-[#F5C542] flex items-center justify-center">
                <Brain className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">Outclaw</span>
            </button>
            <ChevronRight className="w-4 h-4 text-white/20" />
            <span className="text-sm text-white/40">SaaS Documentation</span>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-white/[0.06] p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <DocNav sections={sections} activeId={activeSection} onSelect={setActiveSection} />
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
          {/* Mobile nav */}
          <div className="lg:hidden mb-6">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 text-white rounded-md px-3 py-2 text-sm"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {currentSection.content}

          {/* Prev/Next */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/[0.06]">
            {(() => {
              const idx = sections.findIndex((s) => s.id === activeSection);
              const prev = idx > 0 ? sections[idx - 1] : null;
              const next = idx < sections.length - 1 ? sections[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <button
                      onClick={() => setActiveSection(prev.id)}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60"
                    >
                      <ArrowLeft className="w-4 h-4" /> {prev.title}
                    </button>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <button
                      onClick={() => setActiveSection(next.id)}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60"
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
        </main>
      </div>
    </div>
  );
}
