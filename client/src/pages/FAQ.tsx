/*
 * Outclaw — FAQ Page
 * Descriptive agent naming, 21 agents, Claude, AlphaClaw + browser-harness
 */
import DocPage from "@/components/DocPage";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Outclaw?",
        a: "A 21-agent AI marketing team built on AlphaClaw with browser-harness for native web access. It follows a proven B2B marketing org structure with the Chief Marketing Agent as the lead, three sub-function leads (Product Marketing Lead, Content & Brand Lead, Growth Marketing Lead), two producer agents (Campaign Producer, Marketing Ops), and fifteen specialist agents."
      },
      {
        q: "Do I need all 21 agents?",
        a: "No. You can start with just the Chief Marketing Agent and one or two sub-function leads. The system is modular \u2014 add specialists as you need them. However, the full 21-agent configuration is recommended for comprehensive marketing coverage."
      },
      {
        q: "How much does it cost to run?",
        a: "The main cost is LLM API usage. With the three-tier model strategy (Claude Opus for the lead and sub-function leads, Claude Sonnet for producers, Claude Haiku for specialists), a typical GACCS brief costs $0.02\u20130.10 depending on complexity. Estimated monthly cost for moderate usage (50-100 briefs): $170\u2013460. The infrastructure itself is free and open-source."
      },
      {
        q: "Can I use my own LLM provider?",
        a: "Yes, any OpenAI-compatible API works. This includes Anthropic (Claude), OpenAI (GPT), Google (Gemini), OpenRouter, Together AI, Groq, and local models via Ollama or LM Studio. You can mix providers across tiers."
      },
      {
        q: "What is the GACCS framework?",
        a: "GACCS stands for Goals, Audience, Creative, Channels, and Stakeholders. It\u2019s a structured brief format for marketing tasks. Instead of typing free-form requests into a chat, you fill out a GACCS brief that ensures the Chief Marketing Agent has all the context needed to route and execute the task correctly."
      },
    ],
  },
  {
    category: "Deployment",
    items: [
      {
        q: "What platforms are supported?",
        a: "Windows 11 (native or WSL2), macOS, Linux (Ubuntu/Debian), and cloud VMs (AWS, GCP, Azure, DigitalOcean, Hetzner). The Deployment page has step-by-step guides for each platform."
      },
      {
        q: "Do I need Docker?",
        a: "No. The npm direct install mode works without Docker on any platform. Docker is only recommended for cloud deployments where you want container isolation and easier management."
      },
      {
        q: "Why do I need the model remapping proxy?",
        a: "AlphaClaw's model remapping proxy handles provider compatibility automatically. It remaps model names and converts non-streaming responses to SSE format. The setup wizard configures this during onboarding."
      },
      {
        q: "What are the minimum system requirements?",
        a: "2 CPU cores, 4 GB RAM, 2 GB disk space, Python 3.9+, and Node.js 24+ (auto-installed by setup.sh). For production, we recommend 4+ cores, 8+ GB RAM, and a low-latency internet connection for LLM API calls."
      },
    ],
  },
  {
    category: "Agents & Configuration",
    items: [
      {
        q: "How do I add a new specialist agent?",
        a: "Use the agent hiring template in templates/agent-hiring/new-agent-template.md. Create a new workspace directory under workspaces/, add SOUL.md and AGENTS.md files, register the agent in the AlphaClaw config under the appropriate sub-function lead, and restart the gateway."
      },
      {
        q: "How do I customize agent behavior?",
        a: "Edit the agent\u2019s SOUL.md file. This defines the agent\u2019s personality, expertise, behavioral rules, and output format preferences. Changes take effect after restarting the gateway."
      },
      {
        q: "What is the knowledge base and how do I populate it?",
        a: "The knowledge base is a set of markdown files in the knowledge-base/ directory, organized by domain (company, brand, product, market, competitors, campaigns, customers). Fill in the templates with your actual company information. The Chief Marketing Agent enriches every request with relevant context from these files."
      },
      {
        q: "Why are agent names descriptive instead of creative?",
        a: "Descriptive names are intentional. Names like Content Writer Agent, Competitive Intel Agent, and SEO Agent tell you exactly what the agent does without needing to memorize a mapping. The hierarchy is shown by grouping (Lead > Producer > Specialist), not encoded in names."
      },
    ],
  },
  {
    category: "Command Center & Dashboard",
    items: [
      {
        q: "What is the difference between the Setup UI and the Command Center?",
        a: "The Setup UI is AlphaClaw\u2019s built-in management interface \u2014 it handles gateway status, provider credentials, channel pairing, and agent monitoring. The Command Center is the outer control layer: it provides visibility, governance, budgets, audit trail, and top-level kickoff. AlphaClaw remains the real manager \u2014 it owns delegation, chain of command, review, and feedback loops. The Command Center sits above AlphaClaw, not inside it."
      },
      {
        q: "Do I need the Command Center from day one?",
        a: "No. Start with AlphaClaw\u2019s built-in Setup UI for testing and initial setup. Use the Command Center once you\u2019re running real campaigns with multiple stakeholders and need task tracking, approvals, and cost monitoring. The key rule: AlphaClaw owns all internal delegation and review. The Command Center provides the dashboard and governance layer on top."
      },
      {
        q: "Can I self-host the Command Center?",
        a: "Yes. The Command Center is available both as a hosted SaaS version and a self-hosted deployment. The self-hosted version connects to your AlphaClaw gateway through its API and auto-discovers all registered agents."
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-900">{q}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <DocPage
      title="Frequently Asked Questions"
      subtitle="Common questions about Outclaw, deployment, agents, and the dashboard."
      icon={<HelpCircle size={24} />}
      prevPage={{ path: "/troubleshooting", label: "Troubleshooting" }}
    >
      {faqs.map((section) => (
        <div key={section.category} className="mb-10">
          <h2>{section.category}</h2>
          <div className="space-y-3">
            {section.items.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      ))}
    </DocPage>
  );
}
