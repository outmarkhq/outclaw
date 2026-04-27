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
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import {
  Eye,
  EyeOff,
  Key,
  Loader2,
  MessageSquare,
  Save,
  Shield,
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

  // Prevent flash while auth/workspace loads
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
          {activeTab === "security" && ws && (
            <SecuritySettings
              auditLog={auditQuery.data ?? []}
              isLoading={auditQuery.isLoading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function LLMSettings({ workspace }: { workspace: any }) {
  const [provider, setProvider] = useState(workspace.llmProvider ?? "openai");
  const [model, setModel] = useState(workspace.llmModel ?? "");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

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
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4)</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
              <SelectItem value="google">Google (Gemini)</SelectItem>
              <SelectItem value="openrouter">OpenRouter</SelectItem>
              <SelectItem value="custom">Custom (OpenAI-compatible)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>API Key</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={workspace.llmApiKeyEncrypted ? "••••••••••••" : "sk-..."}
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

        <div className="space-y-2">
          <Label>Model <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={
              provider === "anthropic" ? "claude-sonnet-4-20250514" :
              provider === "google" ? "gemini-2.5-pro" : "gpt-4o"
            }
            className="h-11"
          />
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

function ChannelSettings({ workspace }: { workspace: any }) {
  const [telegramToken, setTelegramToken] = useState(workspace.telegramBotToken ?? "");
  const [telegramEnabled, setTelegramEnabled] = useState(workspace.telegramEnabled ?? false);
  const [slackToken, setSlackToken] = useState(workspace.slackBotToken ?? "");
  const [slackEnabled, setSlackEnabled] = useState(workspace.slackEnabled ?? false);

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
            <div className="space-y-2">
              <Label className="text-[12px]">Bot Token</Label>
              <Input
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="123456:ABC-DEF..."
                className="h-10"
              />
            </div>
          )}
        </div>

        {/* Slack */}
        <div className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-sm">Slack</span>
            </div>
            <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
          </div>
          {slackEnabled && (
            <div className="space-y-2">
              <Label className="text-[12px]">Bot Token</Label>
              <Input
                value={slackToken}
                onChange={(e) => setSlackToken(e.target.value)}
                placeholder="xoxb-..."
                className="h-10"
              />
            </div>
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

  const inviteMember = trpc.members.invite.useMutation({
    onSuccess: () => {
      toast.success("Invite sent");
      setInviteEmail("");
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

function SecuritySettings({
  auditLog,
  isLoading,
}: {
  auditLog: any[];
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Security & Audit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Recent activity in this workspace.
        </p>
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
          {auditLog.map((entry) => (
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
  );
}
