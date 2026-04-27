import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Bot,
  Layers,
  Loader2,
  Server,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = getLoginUrl();
    }
    if (!loading && user && user.role !== "admin") {
      setLocation("/cc");
    }
  }, [loading, user, setLocation]);

  const statsQuery = trpc.admin.stats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const stats = statsQuery.data;

  const workspacesQuery = trpc.admin.workspaces.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const allWorkspaces = workspacesQuery.data ?? [];

  const usersQuery = trpc.admin.users.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const allUsers = usersQuery.data ?? [];

  if (loading || !user) return null;

  const STATUS_COLORS: Record<string, string> = {
    active: "bg-emerald-400",
    provisioning: "bg-amber-400",
    suspended: "bg-red-400",
    archived: "bg-gray-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform overview and management
          </p>
        </div>

        {/* Stats */}
        {statsQuery.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Users",
                value: stats?.totalUsers ?? 0,
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "Total Workspaces",
                value: stats?.totalWorkspaces ?? 0,
                icon: Layers,
                color: "text-violet-400",
              },
              {
                label: "Active Workspaces",
                value: stats?.activeWorkspaces ?? 0,
                icon: Activity,
                color: "text-emerald-400",
              },
              {
                label: "Total Tasks",
                value: stats?.totalTasks ?? 0,
                icon: Bot,
                color: "text-[#F5C542]",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-card border border-border rounded-lg"
              >
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Workspaces */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Workspaces</h2>
            <button
              onClick={() => setLocation("/admin/workspaces")}
              className="text-[12px] text-primary hover:underline"
            >
              View all
            </button>
          </div>
          {allWorkspaces.length === 0 ? (
            <div className="p-8 text-center">
              <Server className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No workspaces yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {allWorkspaces.slice(0, 10).map((ws) => (
                <div
                  key={ws.id}
                  className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      STATUS_COLORS[ws.status] ?? "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ws.name}</p>
                    <p className="text-[12px] text-muted-foreground">
                      {ws.slug} &middot; {ws.plan}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ws.status === "active"
                        ? "text-emerald-400 bg-emerald-400/10"
                        : ws.status === "provisioning"
                        ? "text-amber-400 bg-amber-400/10"
                        : ws.status === "suspended"
                        ? "text-red-400 bg-red-400/10"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {ws.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(ws.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent Users</h2>
          </div>
          {allUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No users yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {allUsers.slice(0, 10).map((u) => (
                <div
                  key={u.id}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {(u.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {u.name ?? "Unknown"}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {u.email ?? u.openId}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      u.role === "admin"
                        ? "text-[#F5C542] bg-[#F5C542]/10"
                        : "text-muted-foreground bg-muted"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
