import { useAuth } from "@/_core/hooks/useAuth";
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
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  Check,
  Globe,
  Key,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { toast } from "sonner";
import { LLM_PROVIDERS, getProvider, getDefaultModel } from "@shared/llmProviders";

const STEPS = [
  { id: 1, title: "Workspace", icon: Globe, desc: "Name your workspace" },
  { id: 2, title: "LLM Provider", icon: Sparkles, desc: "Connect your AI model" },
  { id: 3, title: "Channels", icon: MessageSquare, desc: "Wire up messaging" },
  { id: 4, title: "Deploy", icon: Bot, desc: "Launch your agents" },
];

export default function Onboarding() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  // Form state
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [llmProvider, setLlmProvider] = useState("openai");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [llmModel, setLlmModel] = useState("");
  const [llmBaseUrl, setLlmBaseUrl] = useState("");
  const [telegramToken, setTelegramToken] = useState("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionComplete, setProvisionComplete] = useState(false);

  const createWorkspace = trpc.workspace.create.useMutation();
  const updateOnboarding = trpc.workspace.updateOnboarding.useMutation();
  const provisionWorkspace = trpc.workspace.provision.useMutation();
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  // Check if user already has a workspace — redirect to /cc
  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  useEffect(() => {
    if (workspacesQuery.data && workspacesQuery.data.length > 0) {
      setLocation("/cc");
    }
  }, [workspacesQuery.data, setLocation]);

  if (loading) return <DashboardLayoutSkeleton />;
  if (!user) return null;

  const autoSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (val: string) => {
    setWorkspaceName(val);
    setWorkspaceSlug(autoSlug(val));
  };

  const handleProvision = async () => {
    setIsProvisioning(true);
    try {
      // Create workspace if not yet created
      let wsId = workspaceId;
      if (!wsId) {
        const result = await createWorkspace.mutateAsync({
          name: workspaceName,
          slug: workspaceSlug,
        });
        wsId = result.id;
        setWorkspaceId(wsId);
      }

      // Save LLM config
      await updateOnboarding.mutateAsync({
        workspaceId: wsId,
        step: 2,
        data: { llmProvider, llmApiKey, llmModel, llmBaseUrl: llmBaseUrl || undefined },
      });

      // Save channel config (including WhatsApp)
      await updateOnboarding.mutateAsync({
        workspaceId: wsId,
        step: 3,
        data: {
          telegramBotToken: telegramToken || "",
          slackBotToken: slackWebhook || "",
          whatsappToken: whatsappToken || "",
        },
      });

      // Provision agents
      await provisionWorkspace.mutateAsync({ workspaceId: wsId });
      setProvisionComplete(true);
    } catch (err: any) {
      console.error("Provisioning failed:", err);
      toast.error(err?.message || "Provisioning failed. Please try again.");
    } finally {
      setIsProvisioning(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return workspaceName.length >= 2 && workspaceSlug.length >= 2;
      case 2:
        // Ollama doesn't need an API key; custom/azure need a base URL
        if (llmProvider === "ollama") return true;
        return llmApiKey.length > 0;
      case 3:
        return true; // channels are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.05_0_0)] text-white flex">
      {/* Left sidebar — steps */}
      <div className="hidden lg:flex w-80 border-r border-white/[0.06] flex-col p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 bg-[#F5C542] flex items-center justify-center">
            <Brain className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">Outclaw</span>
        </div>

        <div className="space-y-1">
          {STEPS.map((s) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div
                key={s.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/[0.06] text-white"
                    : isDone
                    ? "text-[#F5C542]"
                    : "text-white/25"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone
                      ? "bg-[#F5C542] text-black"
                      : isActive
                      ? "border-2 border-[#F5C542] text-[#F5C542]"
                      : "border border-white/15 text-white/25"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-[11px] text-white/25">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* Mobile step indicator */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1 flex-1 rounded-full ${
                  step >= s.id
                    ? "bg-[#F5C542]"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Workspace */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  Create your workspace
                </h2>
                <p className="text-sm text-white/40">
                  Your workspace is your isolated environment. Each workspace
                  gets its own agents, channels, and settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Workspace Name</Label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Acme Marketing"
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60">URL Slug</Label>
                  <div className="flex items-center gap-0 w-full">
                    <span className="text-xs sm:text-sm text-white/25 bg-white/[0.04] border border-white/10 border-r-0 px-2 sm:px-3 h-12 flex items-center rounded-l-md whitespace-nowrap shrink-0">
                      <span className="hidden sm:inline">command.outmarkhq.com/</span>
                      <span className="sm:hidden">cmd.../</span>
                    </span>
                    <Input
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value)}
                      placeholder="acme-marketing"
                      className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12 rounded-l-none flex-1 min-w-0"
                    />
                  </div>
                  <p className="text-[11px] text-white/20 sm:hidden">command.outmarkhq.com/{workspaceSlug || "your-slug"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: LLM Provider */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  Connect your LLM
                </h2>
                <p className="text-sm text-white/40">
                  Bring your own API key. We route through Portkey for
                  reliability, load balancing, and fallbacks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/60">Provider</Label>
                  <Select value={llmProvider} onValueChange={(v) => { setLlmProvider(v); setLlmModel(""); }}>
                    <SelectTrigger className="bg-white/[0.04] border-white/10 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {LLM_PROVIDERS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="font-medium">{p.name}</span>
                          <span className="text-white/40 ml-1.5 text-xs">{p.description}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <Input
                      type="password"
                      value={llmApiKey}
                      onChange={(e) => setLlmApiKey(e.target.value)}
                      placeholder={getProvider(llmProvider)?.apiKeyPlaceholder ?? "sk-..."}
                      className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60">
                    Model{" "}
                    <span className="text-white/20">(optional)</span>
                  </Label>
                  <Input
                    value={llmModel}
                    onChange={(e) => setLlmModel(e.target.value)}
                    placeholder={getDefaultModel(llmProvider) || "model-name"}
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                  />
                </div>

                {/* Base URL — only for custom, azure, ollama */}
                {(llmProvider === "custom" || llmProvider === "azure" || llmProvider === "ollama") && (
                  <div className="space-y-2">
                    <Label className="text-white/60">Base URL</Label>
                    <Input
                      value={llmBaseUrl}
                      onChange={(e) => setLlmBaseUrl(e.target.value)}
                      placeholder={
                        llmProvider === "ollama"
                          ? "http://localhost:11434/v1"
                          : llmProvider === "azure"
                          ? "https://your-resource.openai.azure.com/openai/deployments/your-deployment"
                          : "https://api.example.com/v1"
                      }
                      className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                    />
                  </div>
                )}
              </div>

              {/* Provider docs link */}
              {getProvider(llmProvider)?.docsUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={getProvider(llmProvider)!.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-[#F5C542] hover:underline"
                  >
                    Get your {getProvider(llmProvider)!.name} API key &rarr;
                  </a>
                </div>
              )}

              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <p className="text-[12px] text-white/30 leading-relaxed">
                  Your API key is encrypted at rest and never logged. Each
                  workspace has isolated credentials. You can change providers
                  or keys at any time from Settings.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Channels */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  Connect channels
                </h2>
                <p className="text-sm text-white/40">
                  Optional. You can always use the built-in request form. Add
                  messaging channels to let your team interact with agents
                  directly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/60 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Telegram Bot Token
                  </Label>
                  <Input
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="123456:ABC-DEF..."
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                  />
                  <p className="text-[11px] text-white/20">
                    Get from{" "}
                    <a
                      href="https://t.me/BotFather"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F5C542] underline"
                    >
                      @BotFather
                    </a>{" "}
                    on Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Slack Webhook URL
                  </Label>
                  <Input
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    placeholder="https://hooks.slack.com/..."
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white/60 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> WhatsApp Business
                    Token
                  </Label>
                  <Input
                    value={whatsappToken}
                    onChange={(e) => setWhatsappToken(e.target.value)}
                    placeholder="EAAx..."
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 h-12"
                  />
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                <p className="text-[12px] text-white/30 leading-relaxed">
                  No channels? No problem. Every workspace includes a built-in
                  request form at{" "}
                  <span className="text-white/50 font-mono">
                    /cc/new-request
                  </span>{" "}
                  that your team can use to submit tasks directly.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Deploy */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">
                  {provisionComplete
                    ? "Your Command Center is live!"
                    : "Ready to deploy"}
                </h2>
                <p className="text-sm text-white/40">
                  {provisionComplete
                    ? "Your workspace has been provisioned with dedicated infrastructure."
                    : "Review your configuration and deploy your AI agent team."}
                </p>
              </div>

              {!provisionComplete && (
                <div className="space-y-3">
                  <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] text-white/40 uppercase tracking-wider font-semibold">
                        Workspace
                      </span>
                      <span className="text-sm text-white font-medium">
                        {workspaceName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] text-white/40 uppercase tracking-wider font-semibold">
                        LLM
                      </span>
                      <span className="text-sm text-white font-medium">
                        {llmProvider} {llmModel && `(${llmModel})`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-white/40 uppercase tracking-wider font-semibold">
                        Channels
                      </span>
                      <span className="text-sm text-white font-medium">
                        {[
                          telegramToken && "Telegram",
                          slackWebhook && "Slack",
                          whatsappToken && "WhatsApp",
                        ]
                          .filter(Boolean)
                          .join(", ") || "Request Form only"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {provisionComplete && (
                <div className="space-y-4">
                  <div className="p-6 bg-[#F5C542]/10 border border-[#F5C542]/20 rounded-lg text-center">
                    <Check className="w-12 h-12 text-[#F5C542] mx-auto mb-3" />
                    <p className="text-sm text-white/60">
                      21 agents deployed. All systems operational.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 && !provisionComplete ? (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/10 text-white/60 bg-transparent hover:bg-white/[0.04]"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-[#F5C542] text-black font-bold hover:brightness-110"
              >
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : provisionComplete ? (
              <Button
                onClick={() => setLocation("/cc")}
                className="bg-[#F5C542] text-black font-bold hover:brightness-110"
              >
                Open Command Center <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleProvision}
                disabled={isProvisioning}
                className="bg-[#F5C542] text-black font-bold hover:brightness-110"
              >
                {isProvisioning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Provisioning...
                  </>
                ) : (
                  <>
                    Deploy Now <Sparkles className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
