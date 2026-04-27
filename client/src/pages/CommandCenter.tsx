/*
 * Outclaw — Command Center Page
 * Clean architecture: AlphaClaw = the harness (agent management, observability, self-healing)
 * Command Center = outer control layer (visibility, governance, kickoff)
 */
import { Monitor, AlertCircle, ArrowDown, ArrowUp } from "lucide-react";
import DocPage from "@/components/DocPage";

const MC_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663306550909/iuGjwtGPwe2tLuJLPpTZVn/command-center-illustration_269c169c.png";

const commandCenterJobs = [
  { title: "Visibility", desc: "See the full agent org chart, who is active, and what they are working on." },
  { title: "Task Records", desc: "Every GACCS brief becomes a trackable ticket with status, assignees, and audit trail." },
  { title: "Governance", desc: "Configure human-in-the-loop checkpoints, budget limits, and approval gates." },
  { title: "Cost Tracking", desc: "Monitor token usage and API costs per agent, per campaign, and per time period." },
  { title: "Top-Level Kickoff", desc: "Submit GACCS briefs through a structured form. The Command Center passes them to the Chief Marketing Agent." },
  { title: "Pause / Resume", desc: "High-level workflow control — pause a campaign, resume it, or cancel it from the outside." },
  { title: "Audit Trail", desc: "Full log of every task, delegation, review, and human decision." },
  { title: "Multi-User Access", desc: "Role-based access control: admin, reviewer, viewer. Invite team members." },
];

const alphaclawJobs = [
  { title: "Delegation", desc: "The Chief Marketing Agent decides who should do the work and routes it to the right sub-function lead." },
  { title: "Chain of Command", desc: "Work flows down the hierarchy: Chief → Lead → Specialist. No skipping levels." },
  { title: "Instruction Refinement", desc: "Each level refines the task before passing it down. A vague request becomes a specific brief." },
  { title: "Output Collection", desc: "Specialists produce deliverables and return them to their lead." },
  { title: "Review Chain", desc: "Work flows back up the same chain: Specialist → Lead → Chief → Human. Every level reviews." },
  { title: "Feedback & Revision", desc: "If a reviewer sends work back, it goes to the right agent for revision — not back to the human." },
  { title: "Escalation", desc: "If a specialist cannot complete a task, it escalates to their lead, not to the human directly." },
  { title: "Final Packaging", desc: "The Chief Marketing Agent synthesizes the final output before it reaches the human." },
  { title: "Browser Access", desc: "Every agent has native browser access via browser-harness — research, monitor, scrape, and interact with the web." },
  { title: "Self-Healing", desc: "Built-in watchdog monitors agent health, detects crashes, auto-repairs, and sends notifications." },
];

const comparisonRows = [
  ["Who assigns work to specialists?", "No", "Yes — through chain of command"],
  ["Who reviews outputs?", "No", "Yes — back up the same chain"],
  ["Who handles feedback loops?", "No", "Yes — revision stays inside the org"],
  ["Who decides which agent does what?", "No", "Yes — leads delegate to their team"],
  ["Who tracks task status?", "Yes — ticket system", "No — internal only"],
  ["Who enforces budget limits?", "Yes — cost controls", "No"],
  ["Who provides the dashboard?", "Yes — full UI", "No — CLI / API only"],
  ["Who handles human approvals?", "Yes — approval gates", "No"],
  ["Who manages team access?", "Yes — RBAC", "No"],
  ["Who gives agents browser access?", "No", "Yes — via browser-harness"],
  ["Who monitors agent health?", "No", "Yes — watchdog + auto-repair"],
];

export default function CommandCenter() {
  return (
    <DocPage
      title="Command Center"
      subtitle="How the Command Center and AlphaClaw divide responsibility — and why it matters."
      icon={<Monitor size={24} />}
      prevPage={{ path: "/gaccs", label: "GACCS Briefs" }}
      nextPage={{ path: "/models", label: "Model Strategy" }}
    >
      <h2>The Core Question</h2>
      <p>
        When you have two systems — AlphaClaw (the agent harness) and the Command Center
        (the management dashboard) — the most important design decision is:{" "}
        <strong>who is the real manager?</strong>
      </p>
      <p>
        If both systems try to act like the manager, the org becomes blurry. You
        stop knowing who is actually assigning work, who is allowed to bypass
        whom, who reviews what, and who has final responsibility. That creates
        broken chain of command, weak review flow, confused responsibility, bad
        handoffs, and outputs reaching the human before proper refinement.
      </p>
      <p>
        The answer for Outclaw is clear:
      </p>
      <blockquote>
        <p>
          <strong>AlphaClaw is the true manager.</strong> It owns delegation, chain
          of command, review, feedback loops, and escalation.
          <br />
          <strong>The Command Center is the outer control layer.</strong> It provides
          visibility, governance, budgets, audit trail, and top-level kickoff.
        </p>
      </blockquote>

      <h2>The Clean Architecture</h2>
      <p>
        The full delegation and review chain lives inside AlphaClaw. The Command Center
        sits above it, not inside it. Here is how a task flows through the
        system:
      </p>

      <div className="not-prose my-8 bg-slate-50 border border-slate-200 p-6">
        <div className="space-y-3 text-sm">
          {[
            { step: "1", text: "Human submits a GACCS brief", where: "Command Center" },
            { step: "2", text: "Command Center passes it to the Chief Marketing Agent", where: "Command Center → AlphaClaw" },
            { step: "3", text: "Chief Marketing Agent decides this belongs with Product Marketing", where: "AlphaClaw" },
            { step: "4", text: "Product Marketing Lead Agent refines the request", where: "AlphaClaw" },
            { step: "5", text: "Campaign Producer Agent structures the work and creates sub-briefs", where: "AlphaClaw" },
            { step: "6", text: "Content Writer Agent drafts the output (with browser-harness for research)", where: "AlphaClaw" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-900 font-medium">{item.text}</span>
                <span className="text-slate-400 text-xs ml-2">({item.where})</span>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 py-2 pl-9">
            <ArrowDown size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">then back up the same chain for review</span>
            <ArrowUp size={14} className="text-slate-400" />
          </div>

          {[
            { step: "7", text: "Content Writer returns draft to Campaign Producer", where: "AlphaClaw" },
            { step: "8", text: "Campaign Producer reviews and passes to Product Marketing Lead", where: "AlphaClaw" },
            { step: "9", text: "Product Marketing Lead reviews and passes to Chief Marketing Agent", where: "AlphaClaw" },
            { step: "10", text: "Chief Marketing Agent synthesizes final output", where: "AlphaClaw" },
            { step: "11", text: "Final output returned to the human", where: "AlphaClaw → Command Center" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-900 font-medium">{item.text}</span>
                <span className="text-slate-400 text-xs ml-2">({item.where})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p>
        This preserves both <strong>authority</strong> and <strong>quality control</strong>.
        Every output is reviewed at every level before it reaches the human. No agent
        bypasses its reporting line. No specialist sends raw work directly to the human.
      </p>

      <h2>What AlphaClaw Owns</h2>
      <p>
        AlphaClaw handles the real management work — everything that happens inside
        the agent org chart. It wraps the agent framework with a setup wizard,
        self-healing watchdog, Git-backed rollback, and browser-based observability.
        Every agent gets native browser access via{" "}
        <a href="https://github.com/browser-use/browser-harness" target="_blank" rel="noopener noreferrer">
          browser-harness
        </a>{" "}
        — enabling research, monitoring, scraping, and web interaction out of the box.
      </p>
      <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {alphaclawJobs.map((job) => (
          <div key={job.title} className="bg-white border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-1">{job.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{job.desc}</p>
          </div>
        ))}
      </div>

      <h2>What the Command Center Owns</h2>
      <p>
        The Command Center handles the outer-layer jobs — everything the human needs to see,
        control, and govern from outside the org. It is the wrapper, dashboard, and
        control shell.
      </p>
      <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {commandCenterJobs.map((job) => (
          <div key={job.title} className="bg-white border border-slate-200 p-4">
            <h4 className="text-sm font-bold text-slate-900 mb-1">{job.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{job.desc}</p>
          </div>
        ))}
      </div>

      <h2>What Not to Do</h2>
      <p>
        Do not let the Command Center assign work directly to specialists if that skips
        the chain of command. Do not let the Command Center choose specialists just because
        they have the capability. Do not let the Command Center bypass reporting lines, send
        raw work to the human before manager review, or share orchestration
        responsibility with AlphaClaw at the same level.
      </p>
      <p>
        When two systems both think they are the manager, the result is broken
        chain of command, weak review flow, confused responsibility, bad handoffs,
        and outputs reaching the human before proper refinement.
      </p>

      <h2>Responsibility Matrix</h2>
      <div className="overflow-x-auto not-prose my-6">
        <table className="w-full text-sm border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2.5 pr-4 font-semibold text-slate-900">Responsibility</th>
              <th className="text-left py-2.5 pr-4 font-semibold text-slate-900">Command Center</th>
              <th className="text-left py-2.5 font-semibold text-slate-900">AlphaClaw</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row[0]} className="border-b border-slate-100">
                <td className="py-2 pr-4 text-slate-700">{row[0]}</td>
                <td className="py-2 pr-4 text-slate-500">{row[1]}</td>
                <td className="py-2 text-slate-700 font-medium">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The One-Line Rule</h2>
      <blockquote>
        <p>
          AlphaClaw owns delegation and review. The Command Center sits above it, not inside it.
        </p>
      </blockquote>

      <h2>Setup</h2>
      <p>
        AlphaClaw connects to your agent gateway and manages the full lifecycle. You set it
        up during initial deployment:
      </p>
      <ol>
        <li>Deploy AlphaClaw via Docker or Railway/Render template.</li>
        <li>Set your <code>SETUP_PASSWORD</code> and visit the deployment URL.</li>
        <li>The welcome wizard handles model selection, provider credentials, GitHub repo, and channel pairing.</li>
        <li>Browser-harness is auto-installed for all agents during provisioning.</li>
        <li>Configure GACCS brief templates and approval workflows in the Command Center.</li>
        <li>Invite team members who need dashboard access.</li>
      </ol>

      <pre className="bg-slate-800 text-slate-100 p-4 text-sm overflow-x-auto my-6 whitespace-pre-wrap break-words">
        {[
          "# Quick start with Docker",
          "docker run -d \\",
          "  -p 3000:3000 \\",
          "  -e SETUP_PASSWORD=your-password \\",
          "  -e GITHUB_TOKEN=your-github-pat \\",
          "  -e GITHUB_WORKSPACE_REPO=your-org/outclaw-workspace \\",
          "  chrysb/alphaclaw:latest",
          "",
          "# Or install via npm",
          "npm install @chrysb/alphaclaw",
          "npx alphaclaw start",
        ].join("\n")}
      </pre>

      <h2>Practical Consequence</h2>
      <p>
        In practice, the best setup is: <strong>one Command Center-facing top-level
        entry point</strong> (the Chief Marketing Agent), and underneath that, a
        full <strong>AlphaClaw hierarchy</strong> that handles all delegation,
        review, and feedback internally. Every agent has browser access via
        browser-harness for research, monitoring, and web interaction.
      </p>
      <p>
        Not: the Command Center assigning work across the whole marketing org directly.
        Not: the Command Center and AlphaClaw both trying to manage the same org at once.
      </p>
      <p>
        Start with AlphaClaw's built-in Setup UI for initial testing and agent
        verification. Once you are running real campaigns with multiple
        stakeholders, use the full Command Center for the dashboard experience.
        The Setup UI remains useful as a quick-access management interface even after
        the Command Center is configured.
      </p>
    </DocPage>
  );
}
