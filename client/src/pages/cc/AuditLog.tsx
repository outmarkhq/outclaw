import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Bot,
  Clock,
  FileText,
  MessageSquare,
  RefreshCw,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const ACTION_CONFIG: Record<
  string,
  { icon: typeof Activity; label: string; color: string }
> = {
  "task.created": {
    icon: FileText,
    label: "Task Created",
    color: "text-blue-400",
  },
  "task.updated": {
    icon: FileText,
    label: "Task Updated",
    color: "text-blue-300",
  },
  "chat.message_sent": {
    icon: MessageSquare,
    label: "Chat Message",
    color: "text-green-400",
  },
  "agent.deployed": {
    icon: Bot,
    label: "Agent Deployed",
    color: "text-purple-400",
  },
  "cron.created": {
    icon: Clock,
    label: "Cron Created",
    color: "text-amber-400",
  },
  "cron.updated": {
    icon: Clock,
    label: "Cron Updated",
    color: "text-amber-300",
  },
  "cron.deleted": {
    icon: Clock,
    label: "Cron Deleted",
    color: "text-red-400",
  },
  "workspace.settings_updated": {
    icon: Settings,
    label: "Settings Changed",
    color: "text-white/60",
  },
  "member.invited": {
    icon: User,
    label: "Member Invited",
    color: "text-cyan-400",
  },
  "member.removed": {
    icon: User,
    label: "Member Removed",
    color: "text-red-400",
  },
  "auth.login": { icon: Shield, label: "Login", color: "text-green-300" },
};

function getActionConfig(action: string) {
  return (
    ACTION_CONFIG[action] ?? {
      icon: Activity,
      label: action,
      color: "text-white/40",
    }
  );
}

function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function AuditLog() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [limit, setLimit] = useState(50);

  const { data: workspaces, isLoading: wsLoading } =
    trpc.workspace.list.useQuery();
  const workspace = workspaces?.[0];

  const {
    data: entries,
    isLoading: auditLoading,
    refetch,
  } = trpc.audit.list.useQuery(
    { workspaceId: workspace?.id ?? 0, limit },
    { enabled: !!workspace }
  );

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!wsLoading && workspaces && workspaces.length === 0) {
      navigate("/onboarding");
    }
  }, [wsLoading, workspaces, navigate]);

  if (authLoading || wsLoading) return <DashboardLayoutSkeleton />;
  if (!user || !workspace) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <Activity className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Audit Log</h1>
            <p className="text-[11px] text-white/30">
              Full history of every action in your workspace
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </Button>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {auditLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-14 bg-white/[0.03] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : entries && entries.length > 0 ? (
          <div className="space-y-1">
            {entries.map((entry) => {
              const config = getActionConfig(entry.action);
              const Icon = config.icon;
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                >
                  <div
                    className={`w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/80 font-medium">
                        {config.label}
                      </span>
                      {entry.resource && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-4 border-white/10 text-white/30"
                        >
                          {entry.resource}
                          {entry.resourceId ? ` #${entry.resourceId}` : ""}
                        </Badge>
                      )}
                    </div>
                    {entry.details ? (
                      <p className="text-[11px] text-white/20 mt-0.5 truncate">
                        {JSON.stringify(entry.details)}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-[11px] text-white/20 flex-shrink-0">
                    {formatRelativeTime(entry.createdAt)}
                  </div>
                </div>
              );
            })}

            {/* Load more */}
            {entries.length >= limit && (
              <div className="pt-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLimit((l) => l + 50)}
                  className="text-white/30 hover:text-white/60"
                >
                  Load more entries
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Activity className="w-10 h-10 text-white/10 mb-3" />
            <p className="text-sm text-white/30">No audit entries yet</p>
            <p className="text-[11px] text-white/15 mt-1">
              Actions will appear here as your team uses the workspace
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
