import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  GitBranch,
  Plus,
  UserCheck,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const ORCHESTRATION_STAGES = [
  { key: "cma_review", label: "CMA Review", icon: Brain, color: "bg-violet-500" },
  { key: "lead_assignment", label: "Lead Assignment", icon: GitBranch, color: "bg-blue-500" },
  { key: "specialist_work", label: "Specialist Work", icon: Zap, color: "bg-amber-500" },
  { key: "lead_review", label: "Lead Review", icon: Eye, color: "bg-teal-500" },
  { key: "cma_approval", label: "CMA Approval", icon: CheckCircle2, color: "bg-emerald-500" },
  { key: "human_review", label: "Your Review", icon: UserCheck, color: "bg-rose-500" },
];

export default function CCDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: !!user,
  });

  const workspaces = workspacesQuery.data ?? [];
  const activeWorkspace = workspaces[0];

  const agentsQuery = trpc.agents.list.useQuery(
    { workspaceId: activeWorkspace?.id ?? 0 },
    { enabled: !!activeWorkspace }
  );

  const tasksQuery = trpc.tasks.list.useQuery(
    { workspaceId: activeWorkspace?.id ?? 0 },
    { enabled: !!activeWorkspace }
  );

  const agents = agentsQuery.data ?? [];
  const tasks = tasksQuery.data ?? [];

  // Redirect to onboarding if no workspace
  useEffect(() => {
    if (!loading && user && !workspacesQuery.isLoading && workspaces.length === 0) {
      setLocation("/onboarding");
    }
  }, [loading, user, workspacesQuery.isLoading, workspaces.length, setLocation]);

  const activeAgents = agents.filter((a) => a.status === "active").length;
  const activeTasks = tasks.filter((t) => !["done", "archived"].includes(t.status));
  const completedTasks = tasks.filter((t) => t.status === "done");

  // Count tasks per orchestration stage
  const stageCounts = ORCHESTRATION_STAGES.map((stage) => ({
    ...stage,
    count: activeTasks.filter((t) => (t as any).orchestrationStage === stage.key).length,
  }));

  // Find agent name by ID
  const getAgentName = (agentId: number | null) => {
    if (!agentId) return "Unassigned";
    const agent = agents.find((a) => a.id === agentId);
    return agent?.name ?? `Agent #${agentId}`;
  };

  const getStageLabel = (stage: string | null) => {
    const found = ORCHESTRATION_STAGES.find((s) => s.key === stage);
    return found?.label ?? "Queued";
  };

  const getStageColor = (stage: string | null) => {
    const found = ORCHESTRATION_STAGES.find((s) => s.key === stage);
    return found?.color ?? "bg-muted";
  };

  // Prevent flash: show loading while auth or workspace data is resolving
  if (loading || !user || workspacesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect happens via useEffect above — return null while it processes
  if (workspaces.length === 0) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Command Center
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeWorkspace?.name ?? "Loading..."}
            </p>
          </div>
          <button
            onClick={() => setLocation("/cc/new-request")}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all rounded-md"
          >
            <Plus className="w-4 h-4" /> New GACCS Brief
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Active Agents",
              value: activeAgents,
              total: agents.length,
              icon: Bot,
              color: "text-[#F5C542]",
            },
            {
              label: "In Pipeline",
              value: activeTasks.length,
              icon: Activity,
              color: "text-blue-400",
            },
            {
              label: "Awaiting Review",
              value: activeTasks.filter(
                (t) =>
                  (t as any).orchestrationStage === "human_review" ||
                  (t as any).orchestrationStage === "cma_approval"
              ).length,
              icon: Eye,
              color: "text-amber-400",
            },
            {
              label: "Completed",
              value: completedTasks.length,
              icon: CheckCircle2,
              color: "text-emerald-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                {"total" in stat && stat.total !== undefined && (
                  <span className="text-[11px] text-muted-foreground">
                    /{stat.total}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Orchestration Pipeline */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Orchestration Pipeline</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Every GACCS brief flows through this chain: CMA → Lead → Specialist → Review → Approval
            </p>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {stageCounts.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <div key={stage.key} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[100px]">
                      <div
                        className={`w-10 h-10 ${stage.color} rounded-lg flex items-center justify-center mb-1.5`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-[11px] font-semibold text-center leading-tight">
                        {stage.label}
                      </p>
                      <p className="text-lg font-bold mt-0.5">{stage.count}</p>
                    </div>
                    {i < stageCounts.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-1 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Briefs */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Active Briefs</h2>
            <button
              onClick={() => setLocation("/cc/tasks")}
              className="text-[12px] text-primary hover:underline"
            >
              View all
            </button>
          </div>
          {activeTasks.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active briefs</p>
              <p className="text-[12px] text-muted-foreground mt-1">
                Submit a GACCS brief to get started
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeTasks.slice(0, 8).map((task) => {
                const stage = (task as any).orchestrationStage;
                return (
                  <div
                    key={task.id}
                    className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setLocation("/cc/tasks")}
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${getStageColor(stage)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        {getAgentName(task.assignedAgentId)} &middot;{" "}
                        {task.priority}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${getStageColor(
                          stage
                        )} text-white`}
                      >
                        {getStageLabel(stage)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Agent Squad — leaders and leads only */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Command Chain</h2>
            <button
              onClick={() => setLocation("/cc/agents")}
              className="text-[12px] text-primary hover:underline"
            >
              View all 21 agents
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {agents
              .filter((a) => a.tier === "leader" || a.tier === "coordinator")
              .slice(0, 8)
              .map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 bg-card flex items-start gap-3"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      agent.tier === "leader"
                        ? "bg-[#F5C542]/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    {agent.tier === "leader" ? (
                      <Brain className="w-4 h-4 text-[#F5C542]" />
                    ) : (
                      <Zap className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {agent.subFunction}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === "active"
                            ? "bg-emerald-400"
                            : agent.status === "idle"
                            ? "bg-amber-400"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {agent.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
