import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  CheckCircle2,
  Clock,
  FileText,
  Inbox,
  Loader2,
  Plus,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

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

export default function CCTasks() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

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

  // Group tasks by status for kanban
  const columns = ["inbox", "assigned", "active", "review", "done"];
  const grouped = columns.map((status) => ({
    status,
    config: STATUS_CONFIG[status],
    tasks: tasks.filter((t) => t.status === status),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length} total tasks
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
                  {col.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium line-clamp-2">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-[12px] text-muted-foreground mt-1 line-clamp-1">
                          {task.description}
                        </p>
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
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
