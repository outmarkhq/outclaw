/**
 * Outclaw — Homepage
 * Branding aligned with Outmark: Fraunces serif headings, IBM Plex Mono labels,
 * warm gold accent, dark cream palette, editorial copy tone.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  ArrowRight,
  Brain,
  Target,
  Palette,
  TrendingUp,
  ChevronDown,
  Users,
  FileText,
  Zap,
  Eye,
  BarChart3,
  PenTool,
  Megaphone,
  Search,
  Mail,
  Globe,
  Handshake,
  Shield,
  Mic,
  MousePointerClick,
  Rocket,
  Layers,
  GitBranch,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

/* ── Colors (Outmark palette) ── */
const C = {
  bg: "#0B0D0F",
  bgRaised: "#111317",
  fg: "#F5F1E8",
  fgDim: "rgba(245,241,232,0.62)",
  fgFaint: "rgba(245,241,232,0.35)",
  fgMuted: "rgba(245,241,232,0.18)",
  accent: "#F5C542",
  accentDim: "rgba(245,197,66,0.15)",
  rule: "rgba(245,241,232,0.12)",
  ruleStrong: "rgba(245,241,232,0.22)",
};

/* ── Org tree data ── */
type AgentNode = {
  name: string;
  role: string;
  icon: typeof Brain;
  children?: AgentNode[];
};

const orgTree: AgentNode = {
  name: "Chief Marketing Agent",
  role: "Routes tasks, enriches context, reviews all output",
  icon: Brain,
  children: [
    {
      name: "Product Marketing Lead",
      role: "Positioning, competitive intel, launches",
      icon: Target,
      children: [
        { name: "Competitive Intel Agent", role: "Monitors competitors, pricing, market shifts", icon: Eye },
        { name: "Audience Research Agent", role: "ICP/persona research, buyer journey mapping", icon: Users },
        { name: "Sales Enablement Agent", role: "Battle cards, pitch decks, one-pagers", icon: Shield },
        { name: "Product Launch Agent", role: "Launch plans, GTM execution", icon: Rocket },
      ],
    },
    {
      name: "Content & Brand Lead",
      role: "Content strategy, brand voice, creative direction",
      icon: Palette,
      children: [
        { name: "Content Writer Agent", role: "Long-form articles, blogs, thought leadership", icon: FileText },
        { name: "Content Repurposing Agent", role: "Turns long-form into social posts, clips", icon: Layers },
        { name: "Designer Agent", role: "Brand assets, campaign creative, social graphics", icon: PenTool },
        { name: "Social Media Agent", role: "LinkedIn, X, community engagement", icon: Megaphone },
        { name: "PR & Comms Agent", role: "Press releases, media outreach", icon: Mic },
      ],
    },
    {
      name: "Growth Marketing Lead",
      role: "Channel strategy, funnel optimization, distribution",
      icon: TrendingUp,
      children: [
        { name: "SEO Agent", role: "Technical SEO, keyword strategy", icon: Search },
        { name: "Paid Media Agent", role: "Ad copy, campaign setup, A/B testing", icon: MousePointerClick },
        { name: "Lifecycle Email Agent", role: "Sequences, drip campaigns, retention", icon: Mail },
        { name: "Social Listening Agent", role: "Monitor mentions, sentiment, conversations", icon: Globe },
        { name: "Growth Analyst Agent", role: "KPI dashboards, anomaly detection", icon: BarChart3 },
      ],
    },
    { name: "Campaign Producer Agent", role: "Cross-functional orchestration, GACCS briefs", icon: Layers },
    { name: "Marketing Ops Agent", role: "Data, reporting, attribution, tool integrations", icon: BarChart3 },
    { name: "Ecosystem Agent", role: "Partner research, co-marketing, customer stories", icon: Handshake },
  ],
};

/* ── Org chart node ── */
function OrgNode({ agent, depth = 0 }: { agent: AgentNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = agent.children && agent.children.length > 0;
  const Icon = agent.icon;

  return (
    <div className={depth > 0 ? "ml-5 mt-1" : ""}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`flex items-start gap-3 w-full text-left px-3 py-2 transition-all ${
          hasChildren ? "cursor-pointer" : "cursor-default"
        }`}
        style={{ borderRadius: 4 }}
        onMouseEnter={(e) => hasChildren && (e.currentTarget.style.background = "rgba(245,241,232,0.04)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: depth === 0 ? C.accent : depth === 1 ? C.fgDim : C.fgFaint }} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-[13px]"
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: depth === 0 ? 500 : 400,
                color: depth === 0 ? C.fg : depth === 1 ? C.fgDim : C.fgFaint,
              }}
            >
              {agent.name}
            </span>
            {hasChildren && (
              <ChevronDown
                size={12}
                style={{ color: C.fgMuted, transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}
              />
            )}
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: C.fgMuted, fontFamily: "'IBM Plex Mono', monospace" }}>
            {agent.role}
          </p>
        </div>
      </button>
      {hasChildren && expanded && (
        <div className="ml-[22px]" style={{ borderLeft: `1px solid ${C.rule}` }}>
          {agent.children!.map((child) => (
            <OrgNode key={child.name} agent={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Section tag component (01 /, 02 /) ── */
function SectionTag({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span
        className="text-[11px] uppercase tracking-[0.06em]"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.accent }}
      >
        {num}
      </span>
      <span
        className="text-[11px] uppercase tracking-[0.06em]"
        style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: C.fgFaint }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/cc");
    }
  }, [loading, isAuthenticated, setLocation]);

  // Prevent flash: show nothing while auth is resolving or user is authenticated (about to redirect)
  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.accent} transparent ${C.accent} ${C.accent}` }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.fg }}>

      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ background: `${C.bg}cc`, borderBottom: `1px solid ${C.rule}` }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span
              className="text-xl"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.02em", color: C.fg }}
            >
              Outclaw<span style={{ color: C.accent }}>.</span>
            </span>
          </a>
          <div className="flex items-center gap-5">
            <a
              href="/docs/saas"
              className="hidden sm:block text-[13px] transition-colors"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: C.fgFaint }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.fgFaint)}
            >
              Docs
            </a>
            <a
              href="https://github.com/outmarkhq/outclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-[13px] transition-colors"
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 400, color: C.fgFaint }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.fgFaint)}
            >
              GitHub
            </a>
            <button
              onClick={() => { window.location.href = getLoginUrl(); }}
              className="h-9 px-5 text-[13px] transition-all"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                background: C.accent,
                color: C.bg,
                borderRadius: 999,
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${C.accentDim}`)}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span
                className="text-[11px] uppercase tracking-[0.06em]"
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.accent }}
              >
                AI Marketing Command Center
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.035em" }}
            >
              21 agents. Three sub-functions.{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>One command chain.</em>
            </h1>

            <p
              className="mt-6 text-base lg:text-lg leading-relaxed max-w-2xl"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim }}
            >
              A self-hostable, interconnected B2B marketing agent team — built on the MKT1 org
              structure. They coordinate through structured briefs, share a knowledge base, and
              deliver work where strategy connects to execution. Your keys, your data, your
              infrastructure.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => { window.location.href = getLoginUrl(); }}
                className="h-12 px-8 text-[13px] transition-all flex items-center gap-2"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  background: C.accent,
                  color: C.bg,
                  borderRadius: 999,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 24px ${C.accentDim}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Start free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => { window.open("https://github.com/outmarkhq/outclaw", "_blank"); }}
                className="h-12 px-8 text-[13px] transition-all flex items-center gap-2"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 400,
                  background: "transparent",
                  color: C.fgDim,
                  borderRadius: 999,
                  border: `1px solid ${C.ruleStrong}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.fgDim)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.ruleStrong)}
              >
                Self-host (open source)
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6">
              {[
                { icon: Zap, label: "BYO LLM keys" },
                { icon: Users, label: "21 agents" },
                { icon: Shield, label: "$0.02–0.10 per brief" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 text-[12px]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE PROBLEM ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16">
            <div>
              <SectionTag num="01 /" label="The gap" />
              <h2
                className="text-3xl sm:text-4xl leading-[1.12]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
              >
                Most AI marketing tools are{" "}
                <em style={{ fontStyle: "italic", color: C.accent }}>a single chatbot.</em>
              </h2>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim, lineHeight: 1.7 }}>
              <p className="mb-4">
                Marketing is not one job. It is three sub-functions that need to work together. A chatbot
                that writes blog posts does not know about your competitive landscape, your ICP, or your
                brand voice. It cannot coordinate a product launch across SEO, paid media, and email.
              </p>
              <p className="mb-4">
                <strong style={{ fontWeight: 500, color: C.fg }}>It does not review its own work.</strong>
              </p>
              <p style={{ color: C.fgFaint }}>
                The FOMO doesn't stop. The outputs don't change. Most teams stop at "try." Outclaw goes
                the distance.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-px mt-14" style={{ background: C.rule }}>
            {[
              { problem: "No structure", detail: "Ad-hoc prompts produce inconsistent output. No one reviews quality. No one holds company context." },
              { problem: "No specialization", detail: "One model tries to do competitive intel, write blog posts, and run paid ads. It does none of them well." },
              { problem: "No coordination", detail: "Content gets created without knowing the channel strategy. Campaigns launch without competitive context." },
            ].map((item) => (
              <div key={item.problem} className="p-6" style={{ background: C.bgRaised }}>
                <h3 className="text-sm mb-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: C.fg }}>
                  {item.problem}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THREE SUB-FUNCTIONS ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTag num="02 /" label="The team" />
          <h2
            className="text-3xl sm:text-4xl leading-[1.12] mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
          >
            Three sub-functions.{" "}
            <em style={{ fontStyle: "italic", color: C.accent }}>One command chain.</em>
          </h2>
          <p className="max-w-3xl mb-14" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
            Every B2B marketing team needs exactly three sub-functions. These are not arbitrary — they
            represent the fundamental types of marketing work. Outclaw mirrors this structure with
            dedicated AI agents for each.
          </p>

          <div className="grid lg:grid-cols-3 gap-px" style={{ background: C.rule }}>
            {[
              {
                icon: Target,
                name: "Product Marketing",
                lead: "Product Marketing Lead Agent",
                agents: ["Competitive Intel", "Audience Research", "Sales Enablement", "Product Launch"],
                desc: "Positioning, competitive intelligence, audience research, and go-to-market. The fuel that powers every campaign.",
              },
              {
                icon: Palette,
                name: "Content & Brand",
                lead: "Content & Brand Lead Agent",
                agents: ["Content Writer", "Content Repurposing", "Designer", "Social Media", "PR & Comms"],
                desc: "Content strategy, brand voice, creative direction. Turns product marketing insights into assets that resonate.",
              },
              {
                icon: TrendingUp,
                name: "Growth Marketing",
                lead: "Growth Marketing Lead Agent",
                agents: ["SEO", "Paid Media", "Lifecycle Email", "Social Listening", "Growth Analyst"],
                desc: "Channel strategy, funnel optimization, distribution. The engine that takes content to market and measures what works.",
              },
            ].map((sf) => (
              <div key={sf.name} className="p-8" style={{ background: C.bgRaised }}>
                <sf.icon className="w-5 h-5 mb-4" style={{ color: C.accent }} />
                <h3 className="text-lg mb-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: C.fg }}>
                  {sf.name}
                </h3>
                <p className="text-[11px] mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}>
                  Led by {sf.lead}
                </p>
                <p className="text-[13px] leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
                  {sf.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sf.agents.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-2 py-1"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        border: `1px solid ${C.rule}`,
                        color: C.fgFaint,
                        borderRadius: 2,
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[
              { name: "Chief Marketing Agent", role: "Routes, enriches, reviews everything", tier: "Leader" },
              { name: "Campaign Producer", role: "Cross-functional orchestration", tier: "Coordinator" },
              { name: "Marketing Ops", role: "Data, reporting, attribution", tier: "Coordinator" },
            ].map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 px-4 py-3"
                style={{ border: `1px solid ${C.rule}`, borderRadius: 2 }}
              >
                <Brain className="w-4 h-4 flex-shrink-0" style={{ color: C.accent }} />
                <div>
                  <span className="text-[12px]" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: C.fgDim }}>
                    {a.name}
                  </span>
                  <p className="text-[10px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}>
                    {a.role}
                  </p>
                </div>
                <span
                  className="ml-auto text-[9px] uppercase tracking-wider"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}
                >
                  {a.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GACCS FRAMEWORK ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 mb-14">
            <div>
              <SectionTag num="03 /" label="The framework" />
              <h2
                className="text-3xl sm:text-4xl leading-[1.12]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
              >
                GACCS: structured briefs,{" "}
                <em style={{ fontStyle: "italic", color: C.accent }}>not ad-hoc prompts.</em>
              </h2>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim, lineHeight: 1.7, paddingTop: "0.5rem" }}>
              <p>
                Instead of typing free-form requests into a chat, you submit a GACCS brief. It forces
                clarity upfront so the Chief Marketing Agent has everything it needs to route and execute
                correctly. Not every field is required — but the structure ensures nothing important is
                left out.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-5 gap-px" style={{ background: C.rule }}>
            {[
              { letter: "G", label: "Goals", desc: "What business outcome? Include metrics and KPIs." },
              { letter: "A", label: "Audience", desc: "Who is this for? Reference your ICP profiles." },
              { letter: "C", label: "Creative", desc: "What does the output look like? Format, tone, length." },
              { letter: "C", label: "Channels", desc: "Where does it get distributed? Primary and secondary." },
              { letter: "S", label: "Stakeholders", desc: "Who reviews and approves before it goes live?" },
            ].map((g, i) => (
              <div key={i} className="text-center p-6" style={{ background: C.bgRaised }}>
                <div
                  className="w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 400,
                    background: C.accent,
                    color: C.bg,
                    borderRadius: 2,
                  }}
                >
                  {g.letter}
                </div>
                <h3 className="text-sm mb-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: C.fg }}>
                  {g.label}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ORCHESTRATION FLOW ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTag num="04 /" label="Orchestration" />
          <h2
            className="text-3xl sm:text-4xl leading-[1.12] mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
          >
            The CMA runs the show.{" "}
            <em style={{ fontStyle: "italic", color: C.accent }}>You review the output.</em>
          </h2>
          <p className="max-w-3xl mb-14" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
            Every GACCS brief goes to the Chief Marketing Agent first. It enriches the request with
            company context, routes it to the right sub-function lead, and stays in the approval loop
            for every deliverable. Because the CMA cares about the company.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Flow steps */}
            <div>
              {[
                { step: "01", title: "You submit a GACCS brief", desc: "Structured request with goals, audience, creative specs, channels, and stakeholders.", icon: FileText },
                { step: "02", title: "CMA receives and enriches", desc: "Pulls knowledge base context, company data, and past campaign learnings. Decides which sub-function owns this.", icon: Brain },
                { step: "03", title: "Lead decomposes the work", desc: "The sub-function lead breaks the brief into specialist tasks. Content Writer gets the blog. SEO Agent gets the optimization.", icon: GitBranch },
                { step: "04", title: "Specialists execute", desc: "Each agent works within its domain. The Content Writer follows brand voice. The Paid Media Agent follows channel strategy.", icon: Zap },
                { step: "05", title: "Review chain back up", desc: "Output flows back: Specialist \u2192 Lead review \u2192 CMA approval \u2192 You. Nothing ships without the CMA signing off.", icon: CheckCircle2 },
              ].map((s) => (
                <div
                  key={s.step}
                  className="flex gap-4 py-4"
                  style={{ borderBottom: `1px solid ${C.rule}` }}
                >
                  <span
                    className="text-[11px] tracking-wider mt-1 w-6 flex-shrink-0"
                    style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.accent }}
                  >
                    {s.step}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon size={14} style={{ color: C.fgFaint }} />
                      <h3 className="text-sm" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: C.fg }}>
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Org tree */}
            <div
              className="p-4 lg:sticky lg:top-24"
              style={{ background: C.bgRaised, border: `1px solid ${C.ruleStrong}`, borderRadius: 4 }}
            >
              <div className="flex items-center gap-2 mb-4 px-3">
                <span
                  className="text-[11px] uppercase tracking-[0.06em]"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.accent }}
                >
                  Agent hierarchy
                </span>
              </div>
              <OrgNode agent={orgTree} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ECONOMICS ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 mb-14">
            <div>
              <SectionTag num="05 /" label="Economics" />
              <h2
                className="text-3xl sm:text-4xl leading-[1.12]"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
              >
                Three model tiers.{" "}
                <em style={{ fontStyle: "italic", color: C.accent }}>You bring the keys.</em>
              </h2>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim, lineHeight: 1.7, paddingTop: "0.5rem" }}>
              <p>
                Not every agent needs the most expensive model. The CMA and sub-function leads use
                top-tier models for judgment. Coordinators use mid-tier. Specialists use fast, cheap
                models for execution. You bring your own API keys — Anthropic, OpenAI, Google, or any
                OpenAI-compatible provider.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr style={{ background: C.bgRaised }}>
                  {["Tier", "Agents", "Recommended Model", "Role"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-[11px] uppercase tracking-[0.06em]"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.fgDim, borderBottom: `1px solid ${C.ruleStrong}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Leader", agents: "CMA + 3 Leads", model: "Claude Opus / GPT-4", role: "Strategy, routing, review" },
                  { tier: "Coordinator", agents: "Campaign Producer, Marketing Ops", model: "Claude Sonnet / GPT-4o", role: "Orchestration, data" },
                  { tier: "Specialist", agents: "15 execution agents", model: "Claude Haiku / GPT-4o-mini", role: "Content, research, analysis" },
                ].map((row) => (
                  <tr key={row.tier} style={{ borderBottom: `1px solid ${C.rule}` }}>
                    <td className="py-3 px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500, color: C.fg }}>{row.tier}</td>
                    <td className="py-3 px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>{row.agents}</td>
                    <td className="py-3 px-4" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.85rem", color: C.fgFaint }}>{row.model}</td>
                    <td className="py-3 px-4" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-3 gap-px" style={{ background: C.rule }}>
            {[
              { value: "$0.02\u20130.10", label: "Per GACCS brief" },
              { value: "$170\u2013460", label: "Monthly (50\u2013100 briefs)" },
              { value: "Any provider", label: "Anthropic, OpenAI, Google, Ollama" },
            ].map((item) => (
              <div key={item.label} className="p-6" style={{ background: C.bgRaised }}>
                <p className="text-2xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: C.fg }}>
                  {item.value}
                </p>
                <p className="text-[13px] mt-1" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TWO WAYS TO RUN ═══ */}
      <section className="py-20 lg:py-28" style={{ borderBottom: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <SectionTag num="06 /" label="Get started" />
          <h2
            className="text-3xl sm:text-4xl leading-[1.12] mb-14"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em" }}
          >
            Two ways to run{" "}
            <em style={{ fontStyle: "italic", color: C.accent }}>Outclaw.</em>
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* SaaS */}
            <div
              className="p-8"
              style={{
                background: C.bgRaised,
                border: `1px solid ${C.ruleStrong}`,
                borderRadius: 4,
                backgroundImage: `radial-gradient(ellipse at top left, ${C.accentDim}, transparent 60%)`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4" style={{ color: C.accent }} />
                <h3 className="text-lg" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: C.fg }}>
                  Cloud
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim }}>
                Sign up, create a workspace, add your LLM API key, and submit your first GACCS brief.
                All 21 agents are provisioned automatically. We handle infrastructure, updates, and scaling.
              </p>
              <div className="space-y-2 mb-6">
                {["Create account (30 seconds)", "Add your LLM API key", "Submit your first GACCS brief", "Agents start working immediately"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgFaint }}>
                    <span style={{ color: C.accent, fontWeight: 500 }}>{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { window.location.href = getLoginUrl(); }}
                className="h-10 px-6 text-[13px] flex items-center gap-2 transition-all"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  background: C.accent,
                  color: C.bg,
                  borderRadius: 999,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${C.accentDim}`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                Start free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Self-hosted */}
            <div
              className="p-8"
              style={{ background: C.bgRaised, border: `1px solid ${C.ruleStrong}`, borderRadius: 4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4" style={{ color: C.fgDim }} />
                <h3 className="text-lg" style={{ fontFamily: "'Fraunces', serif", fontWeight: 400, color: C.fg }}>
                  Self-hosted (open source)
                </h3>
              </div>
              <p className="text-[14px] leading-relaxed mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgDim }}>
                Clone the repo, deploy on your own infrastructure. Same 21-agent MKT1 structure, same
                GACCS framework, same orchestration. Powered by AlphaClaw with browser-harness for
                native web access. You own the data, the infra, and the customization.
              </p>
              <div className="space-y-2 mb-6">
                {["Clone the GitHub repo", "Run setup.sh (installs AlphaClaw + browser-harness)", "Configure your LLM provider", "Access your Command Center"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgFaint }}>
                    <span style={{ color: C.fgMuted, fontWeight: 500 }}>{String(i + 1).padStart(2, "0")}</span>
                    {s}
                  </div>
                ))}
              </div>
              <button
                onClick={() => { window.open("https://github.com/outmarkhq/outclaw", "_blank"); }}
                className="h-10 px-6 text-[13px] flex items-center gap-2 transition-all"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 400,
                  background: "transparent",
                  color: C.fgDim,
                  borderRadius: 999,
                  border: `1px solid ${C.ruleStrong}`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.fgDim)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.ruleStrong)}
              >
                View on GitHub
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 lg:py-24" style={{ background: C.accent }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl mb-4"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, letterSpacing: "-0.03em", color: C.bg }}
          >
            Stop prompting. Start briefing.
          </h2>
          <p
            className="mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: "rgba(11,13,15,0.55)" }}
          >
            Your marketing team should not be a chatbot. It should be 21 agents with clear roles,
            a chain of command, and a review process. Start with Outclaw.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => { window.location.href = getLoginUrl(); }}
              className="h-12 px-8 text-[13px] flex items-center gap-2 transition-all"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
                background: C.bg,
                color: C.fg,
                borderRadius: 999,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => { window.open("https://github.com/outmarkhq/outclaw", "_blank"); }}
              className="h-12 px-8 text-[13px] flex items-center gap-2 transition-all"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 400,
                background: "transparent",
                color: C.bg,
                borderRadius: 999,
                border: `1px solid rgba(11,13,15,0.25)`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(11,13,15,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(11,13,15,0.25)")}
            >
              Self-host
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12" style={{ borderTop: `1px solid ${C.rule}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-8 items-start">
            <div>
              <span
                className="text-lg"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: C.fg }}
              >
                Outclaw<span style={{ color: C.accent }}>.</span>
              </span>
              <p className="text-[13px] mt-1" style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}>
                An AI marketing command center.
              </p>
            </div>
            {[
              {
                label: "Product",
                links: [
                  { text: "SaaS Docs", href: "/docs/saas" },
                  { text: "Self-Host Docs", href: "/docs/self-hosted" },
                  { text: "Agent Roster", href: "/agents" },
                ],
              },
              {
                label: "Open",
                links: [
                  { text: "GitHub", href: "https://github.com/outmarkhq/outclaw" },
                  { text: "AlphaClaw", href: "https://github.com/chrysb/alphaclaw" },
                  { text: "Browser Harness", href: "https://github.com/browser-use/browser-harness" },
                ],
              },
              {
                label: "Contact",
                links: [
                  { text: "nihal@outmarkhq.com", href: "mailto:nihal@outmarkhq.com" },
                  { text: "outmarkhq.com", href: "https://outmarkhq.com" },
                ],
              },
            ].map((col) => (
              <div key={col.label}>
                <span
                  className="text-[11px] uppercase tracking-[0.06em] block mb-3"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, color: C.fgMuted }}
                >
                  {col.label}
                </span>
                {col.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block text-[13px] mb-1.5 transition-colors"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300, color: C.fgFaint }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.fgDim)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.fgFaint)}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div
            className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
            style={{ borderTop: `1px solid ${C.rule}` }}
          >
            <span className="text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}>
              &copy; 2026 Growth Crystal, Inc.
            </span>
            <span className="text-[12px]" style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.fgMuted }}>
              command.outmarkhq.com
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
