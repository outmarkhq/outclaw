/*
 * Command Center Dashboard — User workspace view
 * Design: sim.ai-inspired — dark theme, neon green accent
 * Features: Task board, agent status, request form, activity feed
 */
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import {
  Plus, Search, Filter, LayoutGrid, List, Clock, CheckCircle,
  AlertTriangle, Loader, Users, Zap, MessageSquare, X,
  ChevronDown, Send, ArrowRight, Activity, Bot,
} from "lucide-react";
import { agents, tasks, type Task, type Agent } from "@/lib/mock-data";

const statusColumns = [
  { key: "backlog", label: "Backlog", color: "bg-white/20" },
  { key: "todo", label: "To Do", color: "bg-blue-400" },
  { key: "in_progress", label: "In Progress", color: "bg-amber-400" },
  { key: "review", label: "Review", color: "bg-purple-400" },
  { key: "done", label: "Done", color: "bg-emerald-400" },
  { key: "blocked", label: "Blocked", color: "bg-red-400" },
] as const;

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-amber-500/20 text-amber-400",
  medium: "bg-blue-500/20 text-blue-400",
  low: "bg-white/10 text-white/50",
};

const agentStatusColors: Record<string, string> = {
  online: "bg-emerald-500",
  idle: "bg-amber-500",
  busy: "bg-blue-500",
  error: "bg-red-500",
  offline: "bg-white/20",
};

function TaskCard({ task }: { task: Task }) {
  const agent = agents.find((a) => a.id === task.assignedTo);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.04] border border-white/[0.06] p-3.5 hover:border-white/[0.12] transition-colors cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-white/30 text-[10px] font-mono">{task.id}</span>
        <span className={`text-[10px] px-1.5 py-0.5 font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <h4 className="text-white text-sm font-medium mb-2 leading-snug">{task.title}</h4>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${agentStatusColors[agent?.status || "offline"]}`} />
          <span className="text-white/40 text-[11px]">{agent?.name || task.assignedTo}</span>
        </div>
        <span className="text-white/20 text-[10px]">{task.updatedAt}</span>
      </div>
      {task.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {task.tags.map((tag) => (
            <span key={tag} className="text-[9px] text-white/30 bg-white/[0.04] px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function AgentMiniCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 hover:bg-white/[0.03] transition-colors">
      <div className="relative">
        <div className="w-8 h-8 bg-white/[0.06] flex items-center justify-center">
          <Bot size={14} className="text-white/40" />
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-black ${agentStatusColors[agent.status]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-xs font-medium truncate">{agent.name}</div>
        <div className="text-white/30 text-[10px]">{agent.role}</div>
      </div>
      <div className="text-white/20 text-[10px]">{agent.lastSeen}</div>
    </div>
  );
}

function RequestForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignTo, setAssignTo] = useState("");

  const leaders = agents.filter((a) => a.tier === "leader");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-[#0a0a0a] border border-white/[0.08] w-full max-w-lg mx-4 z-10"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-white font-bold text-base">New Request</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white/60">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C542] transition-colors"
              placeholder="What do you need?"
            />
          </div>

          <div>
            <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C542] transition-colors resize-none"
              placeholder="Provide context, goals, and any specific requirements..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C542] transition-colors appearance-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Route To
              </label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C542] transition-colors appearance-none"
              >
                <option value="">Auto-route (CMO decides)</option>
                {leaders.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-white/25 text-xs">
            Requests are routed to the CMO agent who delegates to the appropriate team lead.
            You can also submit requests via Telegram, Slack, or WhatsApp.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-white/40 text-sm px-4 py-2 hover:text-white/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="bg-[#F5C542] text-black text-sm font-bold px-6 py-2 hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Send size={14} />
            Submit Request
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CCDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [view, setView] = useState<"board" | "list">("board");
  const [agentPanel, setAgentPanel] = useState(true);

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  if (!user) return null;

  const tasksByStatus = useMemo(() => {
    const map: Record<string, Task[]> = {};
    statusColumns.forEach((col) => {
      map[col.key] = tasks.filter((t) => t.status === col.key);
    });
    return map;
  }, []);

  const onlineAgents = agents.filter((a) => a.status !== "offline").length;
  const busyAgents = agents.filter((a) => a.status === "busy").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-4 lg:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-[#F5C542] flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">O</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-bold text-sm tracking-tight">Command Center</span>
            <span className="text-white/20 text-xs ml-2">{user.workspaceName}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.role === "admin" && (
            <Link href="/admin" className="text-[#F5C542] text-xs font-medium hover:brightness-110">
              Admin Panel
            </Link>
          )}
          <Link href="/command-center/settings" className="text-white/40 text-xs hover:text-white/60 transition-colors">
            Settings
          </Link>
          <span className="text-white/30 text-xs hidden sm:inline">{user.email}</span>
          <button onClick={logout} className="text-white/30 text-xs hover:text-white/60 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 lg:px-6 py-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-white/40" />
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Agents Online</span>
                </div>
                <div className="text-white text-xl font-bold">{onlineAgents}<span className="text-white/30 text-sm font-normal">/{agents.length}</span></div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={14} className="text-white/40" />
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Active Tasks</span>
                </div>
                <div className="text-white text-xl font-bold">{inProgressTasks}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-white/40" />
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Busy Agents</span>
                </div>
                <div className="text-white text-xl font-bold">{busyAgents}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-white/40" />
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">Completed</span>
                </div>
                <div className="text-white text-xl font-bold">{tasks.filter((t) => t.status === "done").length}</div>
              </div>
            </div>

            {/* Board Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-bold tracking-tight">Task Board</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView("board")}
                  className={`p-2 transition-colors ${view === "board" ? "text-[#F5C542]" : "text-white/30 hover:text-white/50"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 transition-colors ${view === "list" ? "text-[#F5C542]" : "text-white/30 hover:text-white/50"}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="bg-[#F5C542] text-black text-xs font-bold px-4 py-2 flex items-center gap-1.5 hover:brightness-110 transition-all"
                >
                  <Plus size={14} />
                  New Request
                </button>
              </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
              {statusColumns.map((col) => (
                <div key={col.key} className="min-w-[260px] w-[260px] shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="text-white/50 text-xs font-medium uppercase tracking-wider">{col.label}</span>
                    <span className="text-white/20 text-xs ml-auto">{tasksByStatus[col.key]?.length || 0}</span>
                  </div>
                  <div className="space-y-2">
                    {tasksByStatus[col.key]?.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                    {(!tasksByStatus[col.key] || tasksByStatus[col.key].length === 0) && (
                      <div className="border border-dashed border-white/[0.06] p-6 text-center">
                        <span className="text-white/15 text-xs">No tasks</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Agent Status */}
        <div className={`hidden xl:block w-[280px] shrink-0 border-l border-white/[0.06] overflow-y-auto`}>
          <div className="px-4 py-4 border-b border-white/[0.06]">
            <h3 className="text-white text-sm font-semibold flex items-center gap-2">
              <Bot size={14} className="text-[#F5C542]" />
              Agent Squad
            </h3>
          </div>

          {/* Leaders */}
          <div className="px-3 pt-3">
            <div className="text-white/20 text-[9px] uppercase tracking-widest font-semibold px-3 mb-1">Leaders</div>
            {agents.filter((a) => a.tier === "leader").map((a) => (
              <AgentMiniCard key={a.id} agent={a} />
            ))}
          </div>

          {/* Coordinators */}
          <div className="px-3 pt-3">
            <div className="text-white/20 text-[9px] uppercase tracking-widest font-semibold px-3 mb-1">Coordinators</div>
            {agents.filter((a) => a.tier === "coordinator").map((a) => (
              <AgentMiniCard key={a.id} agent={a} />
            ))}
          </div>

          {/* Specialists */}
          <div className="px-3 pt-3 pb-4">
            <div className="text-white/20 text-[9px] uppercase tracking-widest font-semibold px-3 mb-1">Specialists</div>
            {agents.filter((a) => a.tier === "specialist").map((a) => (
              <AgentMiniCard key={a.id} agent={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Request Form Modal */}
      <AnimatePresence>
        {showRequestForm && <RequestForm onClose={() => setShowRequestForm(false)} />}
      </AnimatePresence>
    </div>
  );
}
