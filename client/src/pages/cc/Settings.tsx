import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { LLM_PROVIDERS, getProvider, getDefaultModel } from "@shared/llmProviders";
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
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  ExternalLink,
  Key,
  Loader2,
  Lock,
  MessageSquare,
  Save,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type SettingsTab = "llm" | "channels" | "members" | "security";

const TABS: { id: SettingsTab; label: string; icon: typeof Sparkles }[] = [
  { id: "llm", label: "LLM Provider", icon: Sparkles },
  { id: "channels", label: "Channels", icon: MessageSquare },
  { id: "members", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
];

export default function CCSettings() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SettingsTab>("llm");

  const workspacesQuery = trpc.workspace.list.useQuery(undefined, { enabled: !!user });
  const workspaces = workspacesQuery.data ?? [];
  const ws = workspaces[0];

  const wsQuery = trpc.workspace.get.useQuery(
    { id: ws?.id ?? 0 },
    { enabled: !!ws }
  );
  const workspace = wsQuery.data;

  const membersQuery = trpc.members.list.useQuery(
    { workspaceId: ws?.id ?? 0 },
    { enabled: !!ws && activeTab === "members" }
  );

  const auditQuery = trpc.audit.list.useQuery(
    { workspaceId: ws?.id ?? 0, limit: 20 },
    { enabled: !!ws && activeTab === "security" }
  );

  useEffect(() => {
    if (!loading && user && !workspacesQuery.isLoading && workspaces.length === 0) {
      setLocation("/onboarding");
    }
  }, [loading, user, workspacesQuery.isLoading, workspaces.length, setLocation]);

  if (loading || !user || workspacesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (workspaces.length === 0) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {workspace?.name ?? "Loading..."}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-card border border-border rounded-lg p-6">
          {activeTab === "llm" && workspace && (
            <LLMSettings workspace={workspace} />
          )}
          {activeTab === "channels" && workspace && (
            <ChannelSettings workspace={workspace} />
          )}
          {activeTab === "members" && ws && (
            <MemberSettings
              workspaceId={ws.id}
              members={membersQuery.data ?? []}
              isLoading={membersQuery.isLoading}
            />
          )}
          {activeTab === "security" && ws && workspace && (
            <SecuritySettings
              workspace={workspace}
              auditLog={auditQuery.data ?? []}
              isLoading={auditQuery.isLoading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ── LLM Settings ────────────────────────────────────────────────────── */

function LLMSettings({ workspace }: { workspace: any }) {
  const [provider, setProvider] = useState(workspace.llmProvider ?? "openai");
  const [model, setModel] = useState(workspace.llmModel ?? "");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(workspace.llmBaseUrl ?? "");
  const [showKey, setShowKey] = useState(false);

  const providerConfig = getProvider(provider);

  const updateSettings = trpc.workspace.updateSettings.useMutation({
    onSuccess: () => toast.success("LLM settings saved"),
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateSettings.mutate({
      workspaceId: workspace.id,
      llmProvider: provider,
      llmModel: model || undefined,
      llmApiKey: apiKey || undefined,
      llmBaseUrl: baseUrl || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">LLM Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your AI model provider. Keys are encrypted at rest.
        </p>
      </div>

      <div className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label>Provider</Label>
          <Select value={provider} onValueChange={(v) => {
            setProvider(v);
            setModel("");
            setBaseUrl("");
          }}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LLM_PROVIDERS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {providerConfig?.docsUrl && (
            <a
              href={providerConfig.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
            >
              {providerConfig.name} docs <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* API Key — not needed for Ollama */}
        {provider !== "ollama" && (
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={workspace.llmApiKeyEncrypted ? "••••••••••••" : (providerConfig?.apiKeyPlaceholder || "sk-...")}
                className="h-11 pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Model <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={getDefaultModel(provider) || "model-name"}
            className="h-11"
          />
        </div>

        {/* Base URL — only for custom, azure, ollama */}
        {(provider === "custom" || provider === "azure" || provider === "ollama") && (
          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={
                provider === "ollama"
                  ? "http://localhost:11434/v1"
                  : provider === "azure"
                  ? "https://your-resource.openai.azure.com/openai/deployments/your-deployment"
                  : "https://api.example.com/v1"
              }
              className="h-11"
            />
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="font-bold"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* ── Channel Settings ────────────────────────────────────────────────── */

function ChannelSettings({ workspace }: { workspace: any }) {
  const [telegramToken, setTelegramToken] = useState(workspace.telegramBotToken ?? "");
  const [telegramEnabled, setTelegramEnabled] = useState(workspace.telegramEnabled ?? false);
  const [slackToken, setSlackToken] = useState(workspace.slackBotToken ?? "");
  const [slackEnabled, setSlackEnabled] = useState(workspace.slackEnabled ?? false);
  const [whatsappToken, setWhatsappToken] = useState(workspace.whatsappToken ?? "");
  const [whatsappEnabled, setWhatsappEnabled] = useState(workspace.whatsappEnabled ?? false);

  const updateSettings = trpc.workspace.updateSettings.useMutation({
    onSuccess: () => toast.success("Channel settings saved"),
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateSettings.mutate({
      workspaceId: workspace.id,
      telegramBotToken: telegramToken || undefined,
      telegramEnabled,
      slackBotToken: slackToken || undefined,
      slackEnabled,
      whatsappToken: whatsappToken || undefined,
      whatsappEnabled,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Channel Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect messaging channels so your team can interact with agents directly.
        </p>
      </div>

      <div className="space-y-6 max-w-lg">
        {/* Telegram */}
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-sm">Telegram</span>
            </div>
            <Switch checked={telegramEnabled} onCheckedChange={setTelegramEnabled} />
          </div>
          {telegramEnabled && (
            <Input
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              placeholder="Bot token from @BotFather"
              className="h-10"
            />
          )}
        </div>

        {/* Slack */}
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-sm">Slack</span>
            </div>
            <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
          </div>
          {slackEnabled && (
            <Input
              value={slackToken}
              onChange={(e) => setSlackToken(e.target.value)}
              placeholder="xoxb-... Bot OAuth Token"
              className="h-10"
            />
          )}
        </div>

        {/* WhatsApp */}
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span className="font-semibold text-sm">WhatsApp</span>
            </div>
            <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
          </div>
          {whatsappEnabled && (
            <Input
              value={whatsappToken}
              onChange={(e) => setWhatsappToken(e.target.value)}
              placeholder="WhatsApp Business API token"
              className="h-10"
            />
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="font-bold"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* ── Member Settings ─────────────────────────────────────────────────── */

function MemberSettings({
  workspaceId,
  members,
  isLoading,
}: {
  workspaceId: number;
  members: any[];
  isLoading: boolean;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const utils = trpc.useUtils();

  const inviteMember = trpc.members.invite.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent");
      setInviteEmail("");
      utils.members.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Team Members</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage who has access to this workspace.
        </p>
      </div>

      {/* Invite form */}
      <div className="flex gap-2 max-w-lg">
        <Input
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="colleague@company.com"
          className="h-10 flex-1"
        />
        <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as typeof inviteRole)}>
          <SelectTrigger className="h-10 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            if (!inviteEmail.trim()) return;
            inviteMember.mutate({ workspaceId, email: inviteEmail, role: inviteRole });
          }}
          disabled={inviteMember.isPending || !inviteEmail.trim()}
          className="h-10 font-bold"
        >
          Invite
        </Button>
      </div>

      {/* Members list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="divide-y divide-border">
          {members.map((m) => (
            <div key={m.id} className="py-3 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                {(m.userName ?? m.inviteEmail ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {m.userName ?? m.inviteEmail ?? "Unknown"}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {m.userEmail ?? m.inviteEmail}
                </p>
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                  m.role === "admin"
                    ? "text-[#F5C542] bg-[#F5C542]/10"
                    : "text-muted-foreground bg-muted"
                }`}
              >
                {m.role}
              </span>
              {!m.inviteAccepted && (
                <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded font-semibold">
                  Pending
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Security Settings (addresses OpenClaw criticisms) ───────────────── */

function SecuritySettings({
  workspace,
  auditLog,
  isLoading,
}: {
  workspace: any;
  auditLog: any[];
  isLoading: boolean;
}) {
  // Parse existing settings or use defaults
  const settings = (workspace.settings as any) ?? {};
  const [requireHumanApproval, setRequireHumanApproval] = useState(
    settings.requireHumanApproval ?? false
  );
  const [deterministicMode, setDeterministicMode] = useState(
    settings.deterministicMode ?? false
  );
  const [sandboxIsolation, setSandboxIsolation] = useState<"standard" | "strict" | "air-gapped">(
    settings.sandboxIsolation ?? "standard"
  );
  const [maxRetries, setMaxRetries] = useState(settings.maxAgentRetries ?? 3);
  const [toolPermissions, setToolPermissions] = useState({
    fileSystem: settings.toolPermissions?.fileSystem ?? true,
    shell: settings.toolPermissions?.shell ?? false,
    browser: settings.toolPermissions?.browser ?? true,
    apiCalls: settings.toolPermissions?.apiCalls ?? true,
    codeExecution: settings.toolPermissions?.codeExecution ?? false,
    imageGeneration: settings.toolPermissions?.imageGeneration ?? true,
  });

  const updateSettings = trpc.workspace.updateSettings.useMutation({
    onSuccess: () => toast.success("Security settings saved"),
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateSettings.mutate({
      workspaceId: workspace.id,
      settings: {
        ...settings,
        requireHumanApproval,
        deterministicMode,
        sandboxIsolation,
        maxAgentRetries: maxRetries,
        toolPermissions,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* ── Execution Controls ── */}
      <div>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          Execution Controls
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control how agents execute tasks. These settings address common concerns about AI agent autonomy and predictability.
        </p>
      </div>

      <div className="space-y-5 max-w-xl">
        {/* Human Approval Gate */}
        <div className="p-4 border border-border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Require Human Approval</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                All tasks pause at the "human_review" stage before completion. No agent output is finalized without your sign-off.
              </p>
            </div>
            <Switch checked={requireHumanApproval} onCheckedChange={setRequireHumanApproval} />
          </div>
          {requireHumanApproval && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded text-[11px] text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>Tasks will queue in "Review" until a human approves them. This adds latency but ensures every output is validated.</span>
            </div>
          )}
        </div>

        {/* Deterministic Mode */}
        <div className="p-4 border border-border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Deterministic Execution</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Agents use temperature=0, fixed seeds, and structured output schemas. Reduces creative variance but increases reproducibility.
              </p>
            </div>
            <Switch checked={deterministicMode} onCheckedChange={setDeterministicMode} />
          </div>
        </div>

        {/* Max Retries */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Max Agent Retries</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Limit how many times an agent can retry a failed step before escalating. Prevents runaway reasoning loops.
              </p>
            </div>
            <Select value={String(maxRetries)} onValueChange={(v) => setMaxRetries(Number(v))}>
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Sandbox Isolation */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Sandbox Isolation Level</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Controls how tightly agents are sandboxed during execution.
              </p>
            </div>
            <Select value={sandboxIsolation} onValueChange={(v) => setSandboxIsolation(v as any)}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="strict">Strict</SelectItem>
                <SelectItem value="air-gapped">Air-gapped</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {sandboxIsolation === "standard" && "Agents can access approved tools and APIs within the workspace boundary."}
            {sandboxIsolation === "strict" && "Agents run in isolated containers with no network access. Only pre-approved tool calls are allowed."}
            {sandboxIsolation === "air-gapped" && "Full isolation: no network, no file system, no external APIs. Agents can only process in-memory data."}
          </div>
        </div>
      </div>

      {/* ── Tool Permissions (Manifest) ── */}
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Agent Tool Permissions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control which capabilities agents can use. Disabled tools are completely unavailable to all agents in this workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
        {[
          { key: "fileSystem" as const, label: "File System Access", desc: "Read/write workspace files", risk: "low" },
          { key: "browser" as const, label: "Web Browsing", desc: "Navigate and scrape web pages", risk: "medium" },
          { key: "apiCalls" as const, label: "External API Calls", desc: "Call third-party APIs", risk: "medium" },
          { key: "imageGeneration" as const, label: "Image Generation", desc: "Generate images via AI", risk: "low" },
          { key: "shell" as const, label: "Shell Execution", desc: "Run shell commands", risk: "high" },
          { key: "codeExecution" as const, label: "Code Execution", desc: "Execute generated code", risk: "high" },
        ].map((tool) => (
          <div key={tool.key} className="p-3 border border-border rounded-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{tool.label}</p>
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  tool.risk === "high" ? "text-red-400 bg-red-400/10" :
                  tool.risk === "medium" ? "text-amber-400 bg-amber-400/10" :
                  "text-emerald-400 bg-emerald-400/10"
                }`}>
                  {tool.risk}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{tool.desc}</p>
            </div>
            <Switch
              checked={toolPermissions[tool.key]}
              onCheckedChange={(v) => setToolPermissions({ ...toolPermissions, [tool.key]: v })}
            />
          </div>
        ))}
      </div>

      <div className="max-w-xl">
        <Button
          onClick={handleSave}
          disabled={updateSettings.isPending}
          className="font-bold"
        >
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <Save className="w-4 h-4 mr-1" />
          )}
          Save Security Settings
        </Button>
      </div>

      {/* ── Recent Audit Log ── */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Every agent action is logged for full transparency.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = "/cc/audit"}
          >
            View Full Log
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : auditLog.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No audit entries yet
          </p>
        ) : (
          <div className="divide-y divide-border">
            {auditLog.slice(0, 10).map((entry) => (
              <div key={entry.id} className="py-3 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{entry.action}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {entry.resource}
                    {entry.resourceId ? ` #${entry.resourceId}` : ""}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
