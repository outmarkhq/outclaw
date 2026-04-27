/*
 * Outclaw — GACCS Briefs Page
 * The structured task request format — Goals, Audience, Creative, Channels, Stakeholders
 */
import { FileText, CheckCircle } from "lucide-react";
import DocPage from "@/components/DocPage";

export default function GACCS() {
  return (
    <DocPage
      title="GACCS Briefs"
      subtitle="The structured task request format — Goals, Audience, Creative, Channels, Stakeholders"
      icon={<FileText size={24} />}
      prevPage={{ path: "/agents", label: "Agent Roster" }}
      nextPage={{ path: "/command-center", label: "Command Center" }}
    >
      <h2>Why GACCS?</h2>
      <p>
        The GACCS framework is the standard way to scope any marketing project. Instead
        of ad-hoc chat messages like "write me a blog post," GACCS briefs force clarity upfront:
        what are we trying to achieve, who are we targeting, what does the creative look like, where
        does it get distributed, and who needs to approve it?
      </p>
      <p>
        In Outclaw, GACCS briefs serve as the <strong>primary task request format</strong> alongside
        the chat interface. When a human submits a GACCS brief, the Chief Marketing Agent parses it, enriches it
        with knowledge base context, and routes the work to the right sub-function lead with all the
        information they need to execute.
      </p>

      <h2>The Five Fields</h2>

      <div className="space-y-6 not-prose my-8">
        {[
          {
            letter: "G",
            title: "Goals",
            color: "bg-orange-500",
            description: "What are we trying to achieve? Be specific about the business outcome, not just the deliverable. Include metrics where possible.",
            examples: [
              "Generate 50 qualified leads from mid-market SaaS companies in Q3",
              "Increase organic traffic to the pricing page by 40% in 60 days",
              "Establish thought leadership positioning in the data observability space",
            ],
          },
          {
            letter: "A",
            title: "Audience",
            color: "bg-teal-500",
            description: "Who is this for? Reference existing ICP profiles and personas from the knowledge base, or describe the target segment in detail.",
            examples: [
              "VP of Engineering at Series B-D companies (100-500 employees)",
              "Technical decision-makers evaluating data pipeline solutions",
              "Existing customers eligible for upsell to enterprise tier",
            ],
          },
          {
            letter: "C",
            title: "Creative",
            color: "bg-amber-500",
            description: "What does the output look like? Describe the format, tone, length, and any specific requirements or constraints.",
            examples: [
              "2,000-word blog post, technical but accessible, with code examples",
              "LinkedIn carousel (8-10 slides), data-driven, clean design",
              "Email nurture sequence (5 emails over 14 days), conversational tone",
            ],
          },
          {
            letter: "C",
            title: "Channels",
            color: "bg-slate-800",
            description: "Where does this get distributed? Specify primary and secondary channels, and any platform-specific requirements.",
            examples: [
              "Primary: company blog + LinkedIn. Secondary: email newsletter",
              "Google Ads (search + display), LinkedIn Ads (sponsored content)",
              "Product Hunt launch + Hacker News + Twitter/X thread",
            ],
          },
          {
            letter: "S",
            title: "Stakeholders",
            color: "bg-orange-500",
            description: "Who needs to review or approve this before it goes live? This determines the human-in-the-loop checkpoints.",
            examples: [
              "Marketing lead reviews draft. CEO approves final version.",
              "Product team validates technical accuracy. Legal reviews claims.",
              "No approval needed — publish directly after agent QA.",
            ],
          },
        ].map((field) => (
          <div key={field.title + field.letter} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className={`${field.color} px-5 py-3 flex items-center gap-3`}>
              <span className="text-white text-2xl font-extrabold tracking-tight">{field.letter}</span>
              <h3 className="text-white font-bold tracking-tight text-base">{field.title}</h3>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {field.description}
              </p>
              <div className="space-y-2">
                {field.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="text-teal-500 mt-0.5 shrink-0" />
                    <span className="text-slate-800">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>How Briefs Flow Through the System</h2>
      <ol>
        <li><strong>Human submits a GACCS brief</strong> — either through the chat interface or a structured form in Command Center.</li>
        <li><strong>Chief Marketing Agent receives and enriches</strong> — pulls relevant context from the knowledge base (ICP data, brand guidelines, active campaigns) and attaches it to the brief.</li>
        <li><strong>Routing to sub-function lead</strong> — based on the Creative and Channels fields, the Chief Marketing Agent determines which lead(s) should own the work. Multi-channel campaigns go to the Campaign Producer Agent.</li>
        <li><strong>Lead decomposes into tasks</strong> — the sub-function lead breaks the brief into specific specialist assignments. A blog post brief might spawn tasks for the Content Writer (writing), SEO Agent (optimization), and Social Media Agent (distribution).</li>
        <li><strong>Specialists execute</strong> — each specialist produces their deliverable and returns it to their lead.</li>
        <li><strong>Review chain</strong> — the lead reviews, then the Chief Marketing Agent reviews, then human stakeholders review (per the S field).</li>
        <li><strong>Delivery</strong> — approved output is returned to the human with a summary of what was produced and any recommendations for next steps.</li>
      </ol>

      <h2>Example Brief</h2>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 my-6 not-prose">
        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Sample GACCS Brief</div>
        <div className="space-y-4 text-sm">
          <div>
            <div className="font-bold text-slate-900 mb-1">Goals</div>
            <div className="text-slate-600">
              Generate 30 marketing-qualified leads from mid-market fintech companies by end of Q2.
              Secondary goal: establish brand awareness in the payments infrastructure space.
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">Audience</div>
            <div className="text-slate-600">
              VP of Engineering and CTO at fintech companies (50-300 employees, Series A-C).
              Pain points: compliance complexity, integration overhead, scaling payment processing.
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">Creative</div>
            <div className="text-slate-600">
              Thought leadership blog post (2,500 words) on "The Hidden Costs of Building Payment
              Infrastructure In-House." Technical but accessible. Include data points, a comparison
              framework, and a soft CTA to book a demo. Also create a LinkedIn carousel summarizing
              the key findings (8 slides).
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">Channels</div>
            <div className="text-slate-600">
              Primary: company blog (SEO-optimized) + LinkedIn organic post + LinkedIn carousel.
              Secondary: email to existing newsletter subscribers (3,200 contacts). Paid: LinkedIn
              sponsored content targeting fintech engineering leaders.
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">Stakeholders</div>
            <div className="text-slate-600">
              Head of Marketing reviews content strategy and messaging. CTO reviews technical accuracy.
              No legal review needed for blog content. Paid media budget approved up to $2,000.
            </div>
          </div>
        </div>
      </div>

      <h2>Chat vs. GACCS Briefs</h2>
      <p>
        Both interfaces are valid ways to interact with Outclaw. The chat interface is better for
        quick questions, status checks, and exploratory conversations. GACCS briefs are better for
        scoped projects that need clear deliverables, timelines, and accountability.
      </p>
      <table>
        <thead>
          <tr><th>Use Chat When...</th><th>Use GACCS Brief When...</th></tr>
        </thead>
        <tbody>
          <tr><td>Asking a quick question about competitors</td><td>Launching a new content campaign</td></tr>
          <tr><td>Checking the status of active campaigns</td><td>Requesting a product launch plan</td></tr>
          <tr><td>Brainstorming ideas or getting recommendations</td><td>Creating a multi-channel campaign</td></tr>
          <tr><td>Requesting a single, simple deliverable</td><td>Any project with multiple stakeholders</td></tr>
        </tbody>
      </table>
    </DocPage>
  );
}
