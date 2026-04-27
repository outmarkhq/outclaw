import { useAuth } from "@/_core/hooks/useAuth";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Clock, Pause, Play, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

// Common cron presets
const CRON_PRESETS = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at 9am", value: "0 9 * * *" },
  { label: "Every Monday at 9am", value: "0 9 * * 1" },
  { label: "Every 1st of month", value: "0 9 1 * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
];

function describeCron(expr: string): string {
  const presets: Record<string, string> = {
    "0 * * * *": "Every hour",
    "0 9 * * *": "Daily at 9:00 AM",
    "0 9 * * 1": "Every Monday at 9:00 AM",
    "0 9 1 * *": "1st of every month at 9:00 AM",
    "*/15 * * * *": "Every 15 minutes",
    "*/5 * * * *": "Every 5 minutes",
    "0 0 * * *": "Daily at midnight",
  };
  return presets[expr] ?? expr;
}

export default function CronJobs() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCron, setNewCron] = useState("0 9 * * *");

  const { data: workspaces, isLoading: wsLoading } =
    trpc.workspace.list.useQuery();
  const workspace = workspaces?.[0];

  const {
    data: jobs,
    isLoading: jobsLoading,
    refetch,
  } = trpc.cron.list.useQuery(
    { workspaceId: workspace?.id ?? 0 },
    { enabled: !!workspace }
  );

  const createJob = trpc.cron.create.useMutation({
    onSuccess: () => {
      refetch();
      setDialogOpen(false);
      setNewName("");
      setNewDescription("");
      setNewCron("0 9 * * *");
      toast.success("Cron job created");
    },
    onError: (err) => toast.error(err.message),
  });

  const updateJob = trpc.cron.update.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Cron job updated");
    },
  });

  const deleteJob = trpc.cron.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Cron job deleted");
    },
  });

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

  const handleCreate = () => {
    if (!newName.trim()) {
      toast.error("Name is required");
      return;
    }
    createJob.mutate({
      workspaceId: workspace.id,
      name: newName,
      description: newDescription || undefined,
      cronExpression: newCron,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
            <Clock className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Scheduled Jobs</h1>
            <p className="text-[11px] text-white/30">
              Recurring marketing tasks on autopilot
            </p>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 bg-[oklch(0.87_0.29_142)] text-black hover:brightness-110">
              <Plus className="w-3 h-3" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">
                Create Scheduled Job
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-white/60">Name</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Weekly content digest"
                  className="bg-white/[0.04] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Description (optional)</Label>
                <Textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What should this job do?"
                  className="bg-white/[0.04] border-white/10 text-white resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60">Schedule</Label>
                <Input
                  value={newCron}
                  onChange={(e) => setNewCron(e.target.value)}
                  placeholder="0 9 * * *"
                  className="bg-white/[0.04] border-white/10 text-white font-mono"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CRON_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setNewCron(preset.value)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        newCron === preset.value
                          ? "border-[oklch(0.87_0.29_142)] text-[oklch(0.87_0.29_142)] bg-[oklch(0.87_0.29_142)]/10"
                          : "border-white/10 text-white/30 hover:text-white/50"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={handleCreate}
                disabled={createJob.isPending}
                className="w-full bg-[oklch(0.87_0.29_142)] text-black hover:brightness-110"
              >
                {createJob.isPending ? "Creating..." : "Create Job"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Jobs list */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {jobsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/[0.03] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-4 px-4 py-4 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {job.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 ${
                        job.enabled
                          ? "border-green-500/30 text-green-400"
                          : "border-white/10 text-white/30"
                      }`}
                    >
                      {job.enabled ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  {job.description && (
                    <p className="text-[11px] text-white/25 mt-0.5 truncate">
                      {job.description}
                    </p>
                  )}
                  <p className="text-[11px] text-white/15 mt-1 font-mono">
                    {describeCron(job.cronExpression)} ({job.cronExpression})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={job.enabled}
                    onCheckedChange={(checked) =>
                      updateJob.mutate({
                        id: job.id,
                        workspaceId: workspace.id,
                        enabled: checked,
                      })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/20 hover:text-red-400"
                    onClick={() =>
                      deleteJob.mutate({ id: job.id, workspaceId: workspace.id })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-10 h-10 text-white/10 mb-3" />
            <p className="text-sm text-white/30">No scheduled jobs yet</p>
            <p className="text-[11px] text-white/15 mt-1">
              Create recurring tasks like weekly reports, daily content audits,
              or monthly competitor analysis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
