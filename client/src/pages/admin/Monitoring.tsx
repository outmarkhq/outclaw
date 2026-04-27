import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Activity,
  Loader2,
  Server,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function AdminMonitoring() {
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
    refetchInterval: 30000,
  });
  const stats = statsQuery.data;

  const workspacesQuery = trpc.admin.workspaces.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });
  const allWorkspaces = workspacesQuery.data ?? [];

  if (loading || !user) return null;

  const activeCount = allWorkspaces.filter((w) => w.status === "active").length;
  const provisioningCount = allWorkspaces.filter((w) => w.status === "provisioning").length;
  const suspendedCount = allWorkspaces.filter((w) => w.status === "suspended").length;
  const errorCount = allWorkspaces.filter((w) => (w.status as string) === "error").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Monitoring
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Platform health and system status
          </p>
        </div>

        {statsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* System Health */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h2 className="font-semibold text-sm">System Health</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Active", value: activeCount, color: "text-emerald-400" },
                  { label: "Provisioning", value: provisioningCount, color: "text-amber-400" },
                  { label: "Suspended", value: suspendedCount, color: "text-red-400" },
                  { label: "Archived", value: allWorkspaces.filter((w) => w.status === "archived").length, color: "text-gray-400" },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                    <p className={`text-xl font-bold ${item.color}`}>
                      {item.value}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-blue-400" />
                <h2 className="font-semibold text-sm">Platform Metrics</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: stats?.totalUsers ?? 0 },
                  { label: "Total Workspaces", value: stats?.totalWorkspaces ?? 0 },
                  { label: "Active Workspaces", value: stats?.activeWorkspaces ?? 0 },
                  { label: "Total Tasks", value: stats?.totalTasks ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xl font-bold">{item.value}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Workspace Status Breakdown */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-semibold text-sm mb-4">
                Workspace Status Distribution
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Active", count: activeCount, color: "bg-emerald-400" },
                  { label: "Provisioning", count: provisioningCount, color: "bg-amber-400" },
                  { label: "Suspended", count: suspendedCount, color: "bg-red-400" },
                  { label: "Archived", count: allWorkspaces.filter((w) => w.status === "archived").length, color: "bg-gray-400" },
                ].map((item) => {
                  const total = allWorkspaces.length || 1;
                  const pct = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
