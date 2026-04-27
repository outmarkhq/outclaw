import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Bot,
  Brain,
  Loader2,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const TIER_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  leader: { label: "Lead", color: "text-[#F5C542]", bgColor: "bg-[#F5C542]/10" },
  coordinator: { label: "Coordinator", color: "text-blue-400", bgColor: "bg-blue-400/10" },
  specialist: { label: "Specialist", color: "text-muted-foreground", bgColor: "bg-muted" },
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  error: "bg-red-400",
  offline: "bg-gray-400",
};

export default function CCAgents() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const workspacesQuery = trpc.workspace.list.useQuery(undefined, { enabled: !!user });
  const workspaces = workspacesQuery.data ?? [];
  const ws = workspaces[0];

  const agentsQuery = trpc.agents.list.useQuery(
    { workspaceId: ws?.id ?? 0 },
    { enabled: !!ws }
  );
  const agents = agentsQuery.data ?? [];

  useEffect(() => {
    if (!loading && user && !workspacesQuery.isLoading && workspaces.length === 0) {
      setLocation("/onboarding");
    }
  }, [loading, user, workspacesQuery.isLoading, workspaces.length, setLocation]);

  // Prevent flash: show loading while auth or workspace data is resolving
  if (loading || !user || workspacesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (workspaces.length === 0) return null;

  // Group agents by sub-function
  const subFunctions = Array.from(new Set(agents.map((a) => a.subFunction ?? "Other")));
  const grouped = subFunctions.map((sf) => ({
    name: sf,
    agents: agents.filter((a) => (a.subFunction ?? "Other") === sf),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Agent Squad</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {agents.length} agents across {subFunctions.length} sub-functions
          </p>
        </div>

        {agentsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20">
            <Bot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No agents provisioned</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((group) => (
              <div key={group.name}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {group.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.agents.map((agent) => {
                    const tierCfg = TIER_CONFIG[agent.tier] ?? TIER_CONFIG.specialist;
                    return (
                      <div
                        key={agent.id}
                        className="p-4 bg-card border border-border rounded-lg hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tierCfg.bgColor}`}
                          >
                            {agent.tier === "leader" ? (
                              <Brain className={`w-5 h-5 ${tierCfg.color}`} />
                            ) : agent.tier === "coordinator" ? (
                              <Zap className={`w-5 h-5 ${tierCfg.color}`} />
                            ) : (
                              <Bot className={`w-5 h-5 ${tierCfg.color}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold truncate">
                                {agent.name}
                              </p>
                              <div
                                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                  STATUS_COLORS[agent.status] ?? "bg-gray-400"
                                }`}
                              />
                            </div>
                            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-2">
                              {agent.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                          <span
                            className={`text-[10px] font-semibold uppercase tracking-wider ${tierCfg.color}`}
                          >
                            {tierCfg.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {agent.totalTasksCompleted} tasks
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
