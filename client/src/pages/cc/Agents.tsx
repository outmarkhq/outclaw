import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  Bot,
  Brain,
  Loader2,
  MessageSquare,
  Shield,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const TIER_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  leader: {
    label: "Lead",
    color: "text-[#F5C542]",
    bgColor: "bg-[#F5C542]/10",
  },
  coordinator: {
    label: "Coordinator",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  specialist: {
    label: "Specialist",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-400",
  idle: "bg-amber-400",
  error: "bg-red-400",
  offline: "bg-gray-400",
};

export default function CCAgents() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: !!user,
  });
  const workspaces = workspacesQuery.data ?? [];
  const ws = workspaces[0];

  const agentsQuery = trpc.agents.list.useQuery(
    { workspaceId: ws?.id ?? 0 },
    { enabled: !!ws }
  );
  const agents = agentsQuery.data ?? [];

  useEffect(() => {
    if (
      !loading &&
      user &&
      !workspacesQuery.isLoading &&
      workspaces.length === 0
    ) {
      navigate("/onboarding");
    }
  }, [loading, user, workspacesQuery.isLoading, workspaces.length, navigate]);

  if (loading || !user || workspacesQuery.isLoading)
    return <DashboardLayoutSkeleton />;
  if (workspaces.length === 0) return null;

  // Group agents by sub-function
  const subFunctions = Array.from(
    new Set(agents.map((a) => a.subFunction ?? "Other"))
  );
  const grouped = subFunctions.map((sf) => ({
    name: sf,
    agents: agents.filter((a) => (a.subFunction ?? "Other") === sf),
  }));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Agent Roster
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {agents.length} agents across {subFunctions.length} sub-functions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-green-500/30 text-green-400 text-[10px]"
          >
            {agents.filter((a) => a.status === "active").length} active
          </Badge>
          <Badge
            variant="outline"
            className="border-white/10 text-white/30 text-[10px]"
          >
            {agents.filter((a) => a.status === "idle").length} idle
          </Badge>
        </div>
      </div>

      {agentsQuery.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20">
          <Bot className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/30">No agents provisioned</p>
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((group) => (
            <div key={group.name}>
              <h2 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">
                {group.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.agents.map((agent) => {
                  const tierCfg =
                    TIER_CONFIG[agent.tier] ?? TIER_CONFIG.specialist;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent)}
                      className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg hover:border-[oklch(0.87_0.29_142)]/30 hover:bg-white/[0.04] transition-all text-left"
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
                            <p className="text-sm font-semibold text-white truncate">
                              {agent.name}
                            </p>
                            <div
                              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                STATUS_COLORS[agent.status] ?? "bg-gray-400"
                              }`}
                            />
                          </div>
                          <p className="text-[12px] text-white/30 mt-0.5 line-clamp-2">
                            {agent.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${tierCfg.color}`}
                        >
                          {tierCfg.label}
                        </span>
                        <span className="text-[10px] text-white/20 ml-auto">
                          {agent.totalTasksCompleted} tasks
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agent Detail Dialog */}
      <Dialog
        open={!!selectedAgent}
        onOpenChange={(open) => !open && setSelectedAgent(null)}
      >
        <DialogContent className="bg-[#111] border-white/10 max-w-md">
          {selectedAgent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  {selectedAgent.tier === "leader" ? (
                    <Brain className="w-5 h-5 text-[#F5C542]" />
                  ) : selectedAgent.tier === "coordinator" ? (
                    <Zap className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Bot className="w-5 h-5 text-white/40" />
                  )}
                  {selectedAgent.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">
                    Role
                  </p>
                  <p className="text-sm text-white/70">{selectedAgent.role}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white/[0.03] rounded-lg text-center">
                    <p className="text-lg font-bold text-white">
                      {selectedAgent.totalTasksCompleted}
                    </p>
                    <p className="text-[10px] text-white/25">Tasks Done</p>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg text-center">
                    <p className="text-lg font-bold text-white capitalize">
                      {selectedAgent.status}
                    </p>
                    <p className="text-[10px] text-white/25">Status</p>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg text-center">
                    <p className="text-lg font-bold text-white capitalize">
                      {selectedAgent.tier}
                    </p>
                    <p className="text-[10px] text-white/25">Tier</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-white/20" />
                  <p className="text-[11px] text-white/30">
                    Sub-function: {selectedAgent.subFunction ?? "General"}
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      setSelectedAgent(null);
                      navigate("/cc/chat");
                    }}
                    className="flex-1 gap-2 bg-[oklch(0.87_0.29_142)] text-black hover:brightness-110"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat with Agent
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
