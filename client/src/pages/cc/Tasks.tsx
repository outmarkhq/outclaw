import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Inbox,
  Loader2,
  Plus,
  ShieldCheck,
  UserCheck,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof Inbox }
> = {
  inbox: { label: "Inbox", color: "bg-amber-400", icon: Inbox },
  assigned: { label: "Assigned", color: "bg-orange-400", icon: Clock },
  active: { label: "Active", color: "bg-blue-400", icon: Zap },
  review: { label: "Review", color: "bg-violet-400", icon: FileText },
  waiting: { label: "Waiting", color: "bg-yellow-400", icon: Clock },
  blocked: { label: "Blocked", color: "bg-red-400", icon: Clock },
  done: { label: "Done", color: "bg-emerald-400", icon: CheckCircle2 },
  archived: { label: "Archived", color: "bg-gray-400", icon: FileText },
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "text-red-400 bg-red-400/10",
  high: "text-orange-400 bg-orange-400/10",
  normal: "text-blue-400 bg-blue-400/10",
  low: "text-muted-foreground bg-muted",
};

const STAGE_CONFIG: Record<string, { label: string; color: string; icon: typeof Eye }> = {
  cma_review: { label: "CMA Review", color: "text-amber-400 bg-amber-400/10", icon: Eye },
  lead_assignment: { label: "Lead Assigning", color: "text-orange-400 bg-orange-400/10", icon: UserCheck },
  specialist_work: { label: "In Progress", color: "text-blue-400 bg-blue-400/10", icon: Zap },
  lead_review: { label: "Lead Review", color: "text-violet-400 bg-violet-400/10", icon: Eye },
  cma_approval: { label: "CMA Approval", color: "text-purple-400 bg-purple-400/10", icon: ShieldCheck },
  human_review: { label: "Needs Approval", color: "text-[#F5C542] bg-[#F5C542]/10", icon: UserCheck },
  completed: { label: "Completed", color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle2 },
};

export default function CCTasks() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const workspacesQuery = trpc.workspace.list.useQuery(undefined, {
    enabled: !!user,
  });
  const workspaces = workspacesQuery.data ?? [];
  const ws = workspaces[0];

  const tasksQuery = trpc.tasks.list.useQuery(
    { workspaceId: ws?.id ?? 0 },
    { enabled: !!ws }
  );
  const tasks = tasksQuery.data ?? [];

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      toast.success("Task updated");
      utils.tasks.list.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

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

  // Group tasks by status for kanban
  const columns = ["inbox", "assigned", "active", "review", "done"];
  const grouped = columns.map((status) => ({
    status,
    config: STATUS_CONFIG[status],
    tasks: tasks.filter((t) => t.status === status),
  }));

  // Count tasks needing human approval
  const pendingApproval = tasks.filter((t) => t.orchestrationStage === "human_review").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} total tasks
              {pendingApproval > 0 && (
                <span className="ml-2 text-[#F5C542]">
                  ({pendingApproval} awaiting approval)
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={() => setLocation("/cc/new-request")}
            className="bg-primary text-primary-foreground font-bold"
          >
            <Plus className="w-4 h-4 mr-1" /> New Request
          </Button>
        </div>

        {tasksQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <p className="text-[12px] text-muted-foreground mt-1">
              Submit a new request to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {grouped.map((col) => (
              <div key={col.status} className="space-y-2">
                <div className="flex items-center gap-2 px-1 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${col.config.color}`}
                  />
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {col.config.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {col.tasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {col.tasks.map((task) => {
                    const stage = task.orchestrationStage ? STAGE_CONFIG[task.orchestrationStage] : null;
                    const needsApproval = task.orchestrationStage === "human_review";

                    return (
                      <div
                        key={task.id}
                        className={`p-3 bg-card border rounded-lg hover:border-primary/30 transition-colors cursor-pointer ${
                          needsApproval ? "border-[#F5C542]/40" : "border-border"
                        }`}
                      >
                        <p className="text-sm font-medium line-clamp-2">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}

                        {/* Orchestration stage badge */}
                        {stage && (
                          <div className={`flex items-center gap-1 mt-2 text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit ${stage.color}`}>
                            <stage.icon className="w-3 h-3" />
                            {stage.label}
                          </div>
                        )}

                        {/* Sub-function label */}
                        {task.subFunction && (
                          <span className="text-[10px] text-muted-foreground mt-1 block">
                            {task.subFunction}
                          </span>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              PRIORITY_COLORS[task.priority] ?? ""
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Approval action buttons */}
                        {needsApproval && (
                          <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] flex-1 text-emerald-400 border-emerald-400/30 hover:bg-emerald-400/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTask.mutate({
                                  id: task.id,
                                  workspaceId: ws?.id ?? 0,
                                  status: "done",
                                  orchestrationStage: "completed",
                                });
                              }}
                              disabled={updateTask.isPending}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[11px] flex-1 text-amber-400 border-amber-400/30 hover:bg-amber-400/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTask.mutate({
                                  id: task.id,
                                  workspaceId: ws?.id ?? 0,
                                  status: "active",
                                  orchestrationStage: "specialist_work",
                                });
                              }}
                              disabled={updateTask.isPending}
                            >
                              Revise
                            </Button>
                          </div>
                        )}
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
