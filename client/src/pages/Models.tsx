/*
 * Outclaw — Model Tier Strategy Page
 * Multi-provider strategy with Claude, GPT, and Gemini — descriptive naming
 */
import { Cpu } from "lucide-react";
import DocPage from "@/components/DocPage";

export default function Models() {
  return (
    <DocPage
      title="Model Tier Strategy"
      subtitle="Multi-provider model allocation across agent layers — Claude, GPT, and Gemini"
      icon={<Cpu size={24} />}
      prevPage={{ path: "/command-center", label: "Command Center" }}
      nextPage={{ path: "/deployment", label: "Deployment" }}
    >
      <h2>Why Multi-Tier?</h2>
      <p>
        Not every agent needs the most capable (and expensive) model. The Chief Marketing Agent
        makes complex strategic decisions that benefit from frontier-class reasoning. A specialist
        like the Content Writer Agent mostly needs to write well within clear guidelines — a smaller,
        faster model handles that effectively. The tier system matches model capability to task
        complexity, keeping costs manageable while maintaining quality where it matters most.
      </p>

      <h2>Tier Definitions</h2>
      <table>
        <thead>
          <tr><th>Tier</th><th>Agents</th><th>Task Profile</th><th>Key Requirements</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Leader</strong></td>
            <td>Chief Marketing Agent + 3 Sub-Function Leads</td>
            <td>Strategic routing, context synthesis, multi-step planning, deliverable review</td>
            <td>Strong reasoning, large context window, reliable tool use</td>
          </tr>
          <tr>
            <td><strong>Advanced</strong></td>
            <td>Campaign Producer Agent, Marketing Ops Agent</td>
            <td>Cross-functional coordination, GACCS brief parsing, data analysis, reporting</td>
            <td>Structured output, analytical capability, consistency</td>
          </tr>
          <tr>
            <td><strong>Standard</strong></td>
            <td>All 15 Specialist Agents</td>
            <td>Content creation, research execution, data processing, creative production</td>
            <td>Fast execution, instruction following, cost efficiency</td>
          </tr>
        </tbody>
      </table>

      <h2>Recommended Models by Provider</h2>
      <p>
        Outclaw supports any OpenAI-compatible API endpoint, which means you can mix providers
        freely. Here are the recommended models for each tier across three major providers:
      </p>

      <h3>Anthropic (Claude)</h3>
      <table>
        <thead>
          <tr><th>Tier</th><th>Model</th><th>Strengths</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader</td><td><code>claude-opus-4</code></td><td>Exceptional reasoning, nuanced instruction following, strong at complex multi-step tasks</td></tr>
          <tr><td>Advanced</td><td><code>claude-sonnet-4</code></td><td>Reliable structured output, good analytical capability, strong writing</td></tr>
          <tr><td>Standard</td><td><code>claude-haiku-3.5</code></td><td>Fast, cost-effective, good instruction following for execution tasks</td></tr>
        </tbody>
      </table>

      <h3>OpenAI (GPT)</h3>
      <table>
        <thead>
          <tr><th>Tier</th><th>Model</th><th>Strengths</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader</td><td><code>gpt-4.1</code></td><td>Strong tool use, reliable JSON output, good at complex delegation chains</td></tr>
          <tr><td>Advanced</td><td><code>gpt-4.1-mini</code></td><td>Fast reasoning, cost-effective for coordination tasks, solid writing</td></tr>
          <tr><td>Standard</td><td><code>gpt-4.1-nano</code></td><td>Extremely fast and cheap, sufficient for well-scoped execution tasks</td></tr>
        </tbody>
      </table>

      <h3>Google (Gemini)</h3>
      <table>
        <thead>
          <tr><th>Tier</th><th>Model</th><th>Strengths</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader</td><td><code>gemini-2.5-pro</code></td><td>Large context window, strong reasoning, good at synthesizing long documents</td></tr>
          <tr><td>Advanced</td><td><code>gemini-2.5-flash</code></td><td>Very fast, large context, cost-effective for coordination</td></tr>
          <tr><td>Standard</td><td><code>gemini-2.5-flash</code></td><td>Cost-effective with large context, good for research-heavy specialist work</td></tr>
        </tbody>
      </table>

      <h2>Configuration Example</h2>
      <p>
        In <code>alphaclaw.json</code>, models are configured in the <code>models.providers</code> section.
        The <code>agents.defaults.models</code> section sets the default model for all agents, and individual
        agents can override it in <code>agents.list</code>.
      </p>
      <pre className="bg-slate-800 text-slate-100 p-5 rounded-xl text-sm overflow-x-auto my-6">
{`{
  "models": {
    "providers": {
      "openai": {
        "baseUrl": "http://127.0.0.1:18792/v1",
        "models": {
          "gpt-4.1-mini": {},
          "gpt-4.1-nano": {}
        }
      }
    }
  },
  "agents": {
    "defaults": {
      "models": {
        "primary": { "alias": "openai/gpt-4.1-mini" }
      }
    },
    "list": [
      { "id": "chief-marketing", "models": { "primary": { "alias": "openai/gpt-4.1-mini" } } },
      { "id": "content-writer", "models": { "primary": { "alias": "openai/gpt-4.1-nano" } } }
    ]
  }
}`}
      </pre>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 my-6 not-prose">
        <div className="flex items-start gap-3">
          <Cpu size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sm text-slate-900">Important: Embedded Slug-Gen Agent</strong>
            <p className="text-sm mt-1 mb-0 text-slate-600">
              AlphaClaw has an internal embedded agent (slug-gen) that hardcodes <code className="text-xs bg-amber-100 px-1 rounded">openai/gpt-4.1</code> regardless
              of your config. If your provider does not serve that exact model, you <strong>must</strong> use the model
              remapping proxy to map <code className="text-xs bg-amber-100 px-1 rounded">gpt-4.1</code> to a model your provider supports
              (e.g., <code className="text-xs bg-amber-100 px-1 rounded">gpt-4.1-mini</code>).
            </p>
          </div>
        </div>
      </div>

      <h2>Mixed-Provider Strategy</h2>
      <p>
        You can mix providers across tiers — for example, using Claude Opus for the Chief Marketing Agent
        Agent, GPT-4.1-mini for the Campaign Producer, and Gemini Flash for specialists. This lets
        you optimize for each tier's specific needs:
      </p>
      <table>
        <thead>
          <tr><th>Tier</th><th>Recommended Mix</th><th>Rationale</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader</td><td>Claude Opus</td><td>Best reasoning and nuance for strategic decisions</td></tr>
          <tr><td>Advanced</td><td>Claude Sonnet or GPT-4.1-mini</td><td>Strong analytical capability for coordination and review</td></tr>
          <tr><td>Standard</td><td>Gemini 2.5 Flash</td><td>Large context + low cost for execution tasks</td></tr>
        </tbody>
      </table>

      <h2>Cost Estimation</h2>
      <p>
        Approximate monthly costs depend heavily on usage volume. Here is a rough estimate for a
        moderate-usage deployment (50-100 GACCS briefs per month):
      </p>
      <table>
        <thead>
          <tr><th>Tier</th><th>Agents</th><th>Estimated Monthly Cost</th></tr>
        </thead>
        <tbody>
          <tr><td>Leader (4 agents)</td><td>Chief Marketing Agent + 3 Sub-Function Leads</td><td>$120 - $300</td></tr>
          <tr><td>Advanced (2 agents)</td><td>Campaign Producer + Marketing Ops</td><td>$20 - $60</td></tr>
          <tr><td>Standard (15 agents)</td><td>All Specialists</td><td>$30 - $100</td></tr>
          <tr><td colSpan={2}><strong>Total</strong></td><td><strong>$170 - $460 / month</strong></td></tr>
        </tbody>
      </table>
      <p>
        These estimates assume Claude Opus for leaders, Claude Sonnet for advanced, and Claude Haiku
        for standard. Substituting GPT or Gemini models can reduce costs further. Using frontier
        models across all tiers increases costs but provides noticeably better quality throughout.
      </p>
    </DocPage>
  );
}
