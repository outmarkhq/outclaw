/*
 * Admin Dashboard — Platform operator view
 * Design: sim.ai-inspired — dark theme, neon green accent, data-dense
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  Users, Activity, DollarSign, Server, AlertTriangle,
  ChevronRight, Search, MoreVertical, Shield, Zap,
  TrendingUp, Clock, CheckCircle, XCircle, Loader,
} from "lucide-react";
import { workspaces, systemMetrics, type Workspace } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500",
  provisioning: "bg-amber-500",
  suspended: "bg-red-500",
  error: "bg-red-600",
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle size={14} className="text-emerald-400" />,
  provisioning: <Loader size={14} className="text-amber-400 animate-spin" />,
  suspended: <XCircle size={14} className="text-red-400" />,
  error: <AlertTriangle size={14} className="text-red-400" />,
};

const planBadge: Record<string, string> = {
  starter: "border-white/20 text-white/60",
  pro: "border-[#F5C542]/40 text-[#F5C542]",
  enterprise: "border-amber-500/40 text-amber-400",
};

function StatCard({ icon: Icon, label, value, sub, trend }: {
  icon: React.ElementType; label: string; value: string; sub?: string; trend?: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 bg-white/[0.06] flex items-center justify-center">
          <Icon size={16} className="text-white/50" />
        </div>
        {trend && (
          <span className="text-[#F5C542] text-xs font-medium flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-white/40 text-xs mt-1">{label}</div>
      {sub && <div className="text-white/25 text-[10px] mt-0.5">{sub}</div>}
    </div>
  );
}

function WorkspaceRow({ ws, onClick }: { ws: Workspace; onClick: () => void }) {
  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group"
      onClick={onClick}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusColors[ws.status]}`} />
          <div>
            <div className="text-white text-sm font-medium">{ws.name}</div>
            <div className="text-white/30 text-xs">{ws.slug}.command.outmarkhq.com</div>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="text-white/70 text-sm">{ws.owner}</div>
        <div className="text-white/30 text-xs">{ws.ownerEmail}</div>
      </td>
      <td className="py-3.5 px-4">
        <span className={`text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 ${planBadge[ws.plan]}`}>
          {ws.plan}
        </span>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          {statusIcons[ws.status]}
          <span className="text-white/60 text-sm capitalize">{ws.status}</span>
        </div>
      </td>
      <td className="py-3.5 px-4 text-white/60 text-sm">{ws.agentCount}</td>
      <td className="py-3.5 px-4 text-white/60 text-sm">{ws.taskCount}</td>
      <td className="py-3.5 px-4 text-white/60 text-sm">
        {ws.monthlyCost > 0 ? `$${ws.monthlyCost.toFixed(2)}` : "—"}
      </td>
      <td className="py-3.5 px-4 text-white/30 text-xs">{ws.lastActive}</td>
      <td className="py-3.5 px-4">
        <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
      </td>
    </motion.tr>
  );
}

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedWs, setSelectedWs] = useState<Workspace | null>(null);

  // Redirect non-admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-white/40 text-sm mb-6">Admin access required</p>
          <button
            onClick={() => setLocation("/command-center/dashboard")}
            className="text-[#F5C542] text-sm hover:underline"
          >
            Go to Command Center
          </button>
        </div>
      </div>
    );
  }

  const filtered = workspaces.filter(
    (ws) =>
      ws.name.toLowerCase().includes(search.toLowerCase()) ||
      ws.owner.toLowerCase().includes(search.toLowerCase()) ||
      ws.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = workspaces.reduce((s, w) => s + w.monthlyCost, 0);
  const activeCount = workspaces.filter((w) => w.status === "active").length;
  const totalTokens = workspaces.reduce((s, w) => s + w.monthlyTokens, 0);

  // Revenue data for chart
  const revenueData = [
    { month: "Jan", revenue: 280 },
    { month: "Feb", revenue: 420 },
    { month: "Mar", revenue: 510 },
    { month: "Apr", revenue: totalRevenue },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#F5C542] flex items-center justify-center">
              <span className="text-black font-extrabold text-xs">O</span>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">Outclaw</span>
            <span className="text-white/20 text-xs mx-2">/</span>
            <span className="text-white/50 text-sm">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs">{user?.email}</span>
          <button
            onClick={logout}
            className="text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold tracking-tight mb-1">Platform Overview</h1>
          <p className="text-white/40 text-sm">Monitor workspaces, customers, and system health</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Active Workspaces" value={String(activeCount)} sub={`${workspaces.length} total`} trend="+2 this month" />
          <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${totalRevenue.toFixed(0)}`} sub="Across all workspaces" trend="+34%" />
          <StatCard icon={Zap} label="Total Tokens" value={`${(totalTokens / 1_000_000).toFixed(1)}M`} sub="This billing cycle" />
          <StatCard icon={Activity} label="System Health" value="99.7%" sub="30-day uptime" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-5">
            <h3 className="text-white text-sm font-semibold mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0, fontSize: 12 }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                  itemStyle={{ color: "#F5C542" }}
                  formatter={(v: number) => [`$${v}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#F5C542" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* System Load Chart */}
          <div className="bg-white/[0.03] border border-white/[0.06] p-5">
            <h3 className="text-white text-sm font-semibold mb-4">System Load (24h)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="timestamp" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0, fontSize: 12 }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
                />
                <Area type="monotone" dataKey="cpuPercent" stroke="#F5C542" fill="#F5C542" fillOpacity={0.1} name="CPU" />
                <Area type="monotone" dataKey="memoryPercent" stroke="oklch(0.60 0.15 250)" fill="oklch(0.60 0.15 250)" fillOpacity={0.1} name="Memory" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workspaces Table */}
        <div className="bg-white/[0.03] border border-white/[0.06]">
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
            <h3 className="text-white text-sm font-semibold">All Workspaces</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search workspaces..."
                  className="bg-white/[0.04] border border-white/[0.08] text-white text-xs pl-9 pr-4 py-2 w-56 focus:outline-none focus:border-[#F5C542] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Workspace", "Owner", "Plan", "Status", "Agents", "Tasks", "Cost/mo", "Last Active", ""].map((h) => (
                    <th key={h} className="text-left text-white/30 text-[10px] uppercase tracking-wider font-semibold px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ws) => (
                  <WorkspaceRow key={ws.id} ws={ws} onClick={() => setSelectedWs(ws)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workspace Detail Drawer */}
        {selectedWs && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed top-0 right-0 w-[420px] h-screen bg-[#0a0a0a] border-l border-white/[0.06] z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold text-lg">{selectedWs.name}</h3>
                <button onClick={() => setSelectedWs(null)} className="text-white/30 hover:text-white/60">
                  <XCircle size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.04] p-3">
                    <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Status</div>
                    <div className="flex items-center gap-1.5">
                      {statusIcons[selectedWs.status]}
                      <span className="text-white text-sm capitalize">{selectedWs.status}</span>
                    </div>
                  </div>
                  <div className="bg-white/[0.04] p-3">
                    <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Plan</div>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 ${planBadge[selectedWs.plan]}`}>
                      {selectedWs.plan}
                    </span>
                  </div>
                </div>

                <div className="bg-white/[0.04] p-3">
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Owner</div>
                  <div className="text-white text-sm">{selectedWs.owner}</div>
                  <div className="text-white/40 text-xs">{selectedWs.ownerEmail}</div>
                </div>

                <div className="bg-white/[0.04] p-3">
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">LLM Provider</div>
                  <div className="text-white text-sm">{selectedWs.llmProvider}</div>
                </div>

                <div className="bg-white/[0.04] p-3">
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Channels</div>
                  <div className="flex gap-2 mt-1">
                    {selectedWs.channels.telegram && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5">Telegram</span>}
                    {selectedWs.channels.slack && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5">Slack</span>}
                    {selectedWs.channels.whatsapp && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5">WhatsApp</span>}
                    {!selectedWs.channels.telegram && !selectedWs.channels.slack && !selectedWs.channels.whatsapp && (
                      <span className="text-xs text-white/30">None configured</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/[0.04] p-3 text-center">
                    <div className="text-white text-lg font-bold">{selectedWs.agentCount}</div>
                    <div className="text-white/30 text-[10px] uppercase">Agents</div>
                  </div>
                  <div className="bg-white/[0.04] p-3 text-center">
                    <div className="text-white text-lg font-bold">{selectedWs.taskCount}</div>
                    <div className="text-white/30 text-[10px] uppercase">Tasks</div>
                  </div>
                  <div className="bg-white/[0.04] p-3 text-center">
                    <div className="text-white text-lg font-bold">{(selectedWs.monthlyTokens / 1000).toFixed(0)}k</div>
                    <div className="text-white/30 text-[10px] uppercase">Tokens</div>
                  </div>
                </div>

                <div className="bg-white/[0.04] p-3">
                  <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Infrastructure</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/50">Gateway Port</span>
                      <span className="text-white/70 font-mono">{selectedWs.gatewayPort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Dashboard Port</span>
                      <span className="text-white/70 font-mono">{selectedWs.dashboardPort}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Created</span>
                      <span className="text-white/70">{selectedWs.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="space-y-2 pt-2">
                  {selectedWs.status === "active" && (
                    <button className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium py-2.5 hover:bg-amber-500/20 transition-colors">
                      Suspend Workspace
                    </button>
                  )}
                  {selectedWs.status === "suspended" && (
                    <button className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium py-2.5 hover:bg-emerald-500/20 transition-colors">
                      Reactivate Workspace
                    </button>
                  )}
                  <button className="w-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs font-medium py-2.5 hover:bg-white/[0.06] transition-colors">
                    View Logs
                  </button>
                  <button className="w-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium py-2.5 hover:bg-red-500/20 transition-colors">
                    Delete Workspace
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {selectedWs && (
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedWs(null)} />
        )}
      </div>
    </div>
  );
}
