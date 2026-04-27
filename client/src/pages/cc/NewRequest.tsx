import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Megaphone,
  Palette,
  Send,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const GACCS_SECTIONS = [
  {
    key: "goals" as const,
    letter: "G",
    label: "Goals",
    icon: Target,
    color: "bg-emerald-500",
    placeholder:
      "What business outcome are you targeting? Include specific metrics or KPIs if possible.\n\nExample: Increase inbound demo requests by 25% in Q3 through a competitive positioning campaign targeting mid-market SaaS buyers.",
    hint: "Be specific about the business outcome, not just the deliverable. 'Write a blog post' is a deliverable. 'Drive 500 organic visits/month to our pricing page' is a goal.",
    required: false,
  },
  {
    key: "audience" as const,
    letter: "A",
    label: "Audience",
    icon: Users,
    color: "bg-blue-500",
    placeholder:
      "Who is this for? Reference your ICP profiles, buyer personas, or specific segments.\n\nExample: VP of Engineering at Series B-D SaaS companies (50-500 employees) who are evaluating build-vs-buy for internal tooling.",
    hint: "The more specific the audience, the better the output. Include job titles, company stage, pain points, and where they consume content.",
    required: false,
  },
  {
    key: "creative" as const,
    letter: "C",
    label: "Creative",
    icon: Palette,
    color: "bg-violet-500",
    placeholder:
      "What does the output look like? Format, tone, length, style, and any brand guidelines.\n\nExample: 2,000-word long-form blog post. Authoritative but approachable tone. Include 2-3 data points. Follow our brand voice guide. No jargon.",
    hint: "Specify format (blog, one-pager, email sequence), tone (formal, conversational), length, and any brand constraints.",
    required: false,
  },
  {
    key: "channels" as const,
    letter: "C",
    label: "Channels",
    icon: Megaphone,
    color: "bg-amber-500",
    placeholder:
      "Where does this get distributed? Primary and secondary channels.\n\nExample: Primary: Company blog + LinkedIn organic. Secondary: Repurpose into 3 LinkedIn posts, 1 Twitter thread, and an email to our nurture list.",
    hint: "Think about primary distribution and repurposing. The Content Repurposing Agent can help turn one asset into many.",
    required: false,
  },
  {
    key: "stakeholders" as const,
    letter: "S",
    label: "Stakeholders",
    icon: FileText,
    color: "bg-rose-500",
    placeholder:
      "Who reviews and approves before this goes live? Any dependencies or sign-offs needed?\n\nExample: Product Marketing Lead reviews positioning accuracy. VP Marketing gives final approval. Legal review needed if we reference competitor names.",
    hint: "The CMA and sub-function leads are always in the review loop. Add any human stakeholders who need to sign off.",
    required: false,
  },
];

export default function CCNewRequest() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"urgent" | "high" | "normal" | "low">("normal");
  const [gaccsGoals, setGaccsGoals] = useState("");
  const [gaccsAudience, setGaccsAudience] = useState("");
  const [gaccsCreative, setGaccsCreative] = useState("");
  const [gaccsChannels, setGaccsChannels] = useState("");
  const [gaccsStakeholders, setGaccsStakeholders] = useState("");

  // UI state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["goals"])
  );
  const [showGaccsGuide, setShowGaccsGuide] = useState(false);

  const workspacesQuery = trpc.workspace.list.useQuery(undefined, { enabled: !!user });
  const workspaces = workspacesQuery.data ?? [];
  const ws = workspaces[0];

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("GACCS brief submitted — routed to Chief Marketing Agent");
      setLocation("/cc/tasks");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit brief");
    },
  });

  const gaccsSetters: Record<string, (v: string) => void> = {
    goals: setGaccsGoals,
    audience: setGaccsAudience,
    creative: setGaccsCreative,
    channels: setGaccsChannels,
    stakeholders: setGaccsStakeholders,
  };

  const gaccsValues: Record<string, string> = {
    goals: gaccsGoals,
    audience: gaccsAudience,
    creative: gaccsCreative,
    channels: gaccsChannels,
    stakeholders: gaccsStakeholders,
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filledSections = GACCS_SECTIONS.filter(
    (s) => gaccsValues[s.key]?.trim()
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !title.trim()) return;

    createTask.mutate({
      workspaceId: ws.id,
      title: title.trim(),
      description: description.trim() || undefined,
      gaccsGoals: gaccsGoals.trim() || undefined,
      gaccsAudience: gaccsAudience.trim() || undefined,
      gaccsCreative: gaccsCreative.trim() || undefined,
      gaccsChannels: gaccsChannels.trim() || undefined,
      gaccsStakeholders: gaccsStakeholders.trim() || undefined,
      priority,
      source: "form",
    });
  };

  // Prevent flash while workspace loads
  if (!user || workspacesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (workspaces.length === 0) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/cc")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              New GACCS Brief
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Submit a structured marketing request. The Chief Marketing Agent
              will analyze, enrich, and route it to the right sub-function.
            </p>
          </div>
        </div>

        {/* Orchestration info banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">
              How this works
            </p>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              Your brief goes to the <strong>Chief Marketing Agent</strong>{" "}
              first. The CMA enriches it with company context, decides which
              sub-function owns it (Product Marketing, Content & Brand, or
              Growth), and routes it to the right lead. The lead then delegates
              to specialists. Output flows back up through lead review and CMA
              approval before reaching you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Description */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Brief Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Competitive analysis for Q3 product launch"
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Context / Background
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any additional context the CMA should know — company background, recent changes, competitive landscape, past campaigns..."
                className="min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as typeof priority)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">
                    Urgent — needs immediate attention
                  </SelectItem>
                  <SelectItem value="high">
                    High — this week
                  </SelectItem>
                  <SelectItem value="normal">
                    Normal — standard queue
                  </SelectItem>
                  <SelectItem value="low">
                    Low — when capacity allows
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GACCS Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">GACCS Brief</h2>
                <p className="text-sm text-muted-foreground">
                  {filledSections}/5 sections filled — more detail = better
                  routing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGaccsGuide(!showGaccsGuide)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                {showGaccsGuide ? "Hide guide" : "What is GACCS?"}
              </button>
            </div>

            {showGaccsGuide && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  <strong>GACCS</strong> stands for{" "}
                  <strong>Goals, Audience, Creative, Channels, Stakeholders</strong>.
                  It is a structured brief format that forces clarity upfront so
                  the Chief Marketing Agent has everything it needs to route and
                  execute correctly.
                </p>
                <p className="mt-2">
                  Not all fields are required — the CMA can work with partial
                  briefs. But the more context you provide, the better the
                  output. At minimum, fill in Goals and Audience for the best
                  results.
                </p>
              </div>
            )}

            {/* GACCS progress bar */}
            <div className="flex gap-1">
              {GACCS_SECTIONS.map((s) => (
                <div
                  key={s.key}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    gaccsValues[s.key]?.trim()
                      ? s.color
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {GACCS_SECTIONS.map((section) => {
              const isExpanded = expandedSections.has(section.key);
              const hasContent = gaccsValues[section.key]?.trim();
              const Icon = section.icon;

              return (
                <div
                  key={section.key}
                  className={`border rounded-lg transition-all ${
                    hasContent
                      ? "border-primary/30 bg-primary/[0.02]"
                      : "border-border bg-card"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div
                      className={`w-8 h-8 ${section.color} text-white font-extrabold text-sm flex items-center justify-center rounded flex-shrink-0`}
                    >
                      {section.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {section.label}
                        </span>
                        {hasContent && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">
                            Filled
                          </span>
                        )}
                      </div>
                      {!isExpanded && hasContent && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {gaccsValues[section.key]}
                        </p>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      <Textarea
                        value={gaccsValues[section.key]}
                        onChange={(e) =>
                          gaccsSetters[section.key](e.target.value)
                        }
                        placeholder={section.placeholder}
                        className="min-h-[120px] resize-y text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {section.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <p className="text-xs text-muted-foreground">
              <Brain className="w-3.5 h-3.5 inline mr-1" />
              This brief will be routed to the Chief Marketing Agent for
              analysis and delegation.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/cc")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || createTask.isPending}
                className="bg-primary text-primary-foreground font-bold"
              >
                {createTask.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1" /> Submit GACCS Brief
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
