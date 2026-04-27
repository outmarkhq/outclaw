import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Search,
  Server,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

import { toast } from "sonner";

export default function AdminWorkspaces() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
    if (!loading && user && user.role !== "admin") {
      setLocation("/cc");
    }
  }, [loading, user, setLocation]);

  const workspacesQuery = trpc.admin.workspaces.useQuery(
    { search: search || undefined },
    { enabled: !!user && user.role === "admin" }
  );
  const allWorkspaces = workspacesQuery.data ?? [];

  const updateStatus = trpc.admin.updateWorkspaceStatus.useMutation({
    onSuccess: () => {
      toast.success("Workspace status updated");
      workspacesQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading || !user) return null;

  const STATUS_COLORS: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-400/10",
    provisioning: "text-amber-400 bg-amber-400/10",
    suspended: "text-red-400 bg-red-400/10",
    archived: "text-muted-foreground bg-muted",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Workspaces
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {allWorkspaces.length} total workspaces
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="pl-10 h-10"
          />
        </div>

        {/* Table */}
        {workspacesQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : allWorkspaces.length === 0 ? (
          <div className="text-center py-12">
            <Server className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No workspaces found</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      Workspace
                    </th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      LLM
                    </th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="text-left p-3 font-semibold text-muted-foreground text-[12px] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allWorkspaces.map((ws) => (
                    <tr
                      key={ws.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3">
                        <p className="font-medium">{ws.name}</p>
                        <p className="text-[12px] text-muted-foreground">
                          {ws.slug}
                        </p>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                          {ws.plan}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                            STATUS_COLORS[ws.status] ?? ""
                          }`}
                        >
                          {ws.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {ws.llmProvider ?? "—"}
                      </td>
                      <td className="p-3 text-muted-foreground text-[12px]">
                        {new Date(ws.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Select
                          value={ws.status}
                          onValueChange={(v) => {
                            updateStatus.mutate({
                              workspaceId: ws.id,
                              status: v as any,
                            });
                          }}
                        >
                          <SelectTrigger className="h-8 w-32 text-[12px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspend</SelectItem>
                            <SelectItem value="archived">Archive</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
