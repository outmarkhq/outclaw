/*
 * Command Center Settings — LLM config (Portkey), Channels, User management
 * Design: sim.ai-inspired — dark theme, neon green accent
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "wouter";
import {
  Settings, Key, MessageSquare, Users, Shield, ArrowLeft,
  Check, Plus, Trash2, Eye, EyeOff, ExternalLink, Bot,
  ChevronRight, AlertTriangle, Zap,
} from "lucide-react";
import { llmProviders, channelTypes } from "@/lib/mock-data";

type SettingsTab = "llm" | "channels" | "members" | "security";

const tabs: { key: SettingsTab; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { key: "llm", label: "LLM Configuration", icon: Zap },
  { key: "channels", label: "Channels", icon: MessageSquare },
  { key: "members", label: "Team Members", icon: Users },
  { key: "security", label: "Security & Keys", icon: Shield, adminOnly: true },
];

function LLMSettings() {
  const [selectedProvider, setSelectedProvider] = useState("anthropic");
  const [selectedModel, setSelectedModel] = useState("Claude Sonnet 4");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [portkeyEnabled, setPortkeyEnabled] = useState(true);

  const provider = llmProviders.find((p) => p.id === selectedProvider);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-base font-bold mb-1">LLM Provider</h3>
        <p className="text-white/40 text-sm mb-4">
          Connect your preferred LLM provider via Portkey AI Gateway. Bring your own API key.
        </p>
      </div>

      {/* Portkey toggle */}
      <div className="bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium flex items-center gap-2">
              Portkey AI Gateway
              <span className="text-[9px] bg-[#F5C542]/20 text-[#F5C542] px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                Recommended
              </span>
            </div>
            <p className="text-white/30 text-xs mt-1">
              Universal API for 200+ LLMs. Automatic fallbacks, load balancing, and cost tracking.
            </p>
          </div>
          <button
            onClick={() => setPortkeyEnabled(!portkeyEnabled)}
            className={`w-10 h-5 rounded-full transition-colors relative ${portkeyEnabled ? "bg-[#F5C542]" : "bg-white/20"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${portkeyEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Provider Selection */}
      <div>
        <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
          Provider
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {llmProviders.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedProvider(p.id); setSelectedModel(p.models[0]); }}
              className={`p-3 border text-left transition-colors ${
                selectedProvider === p.id
                  ? "border-[#F5C542] bg-[#F5C542]/5"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.icon}</span>
                <span className="text-white text-sm font-medium">{p.name}</span>
              </div>
              <div className="text-white/30 text-[10px] mt-1">{p.models.length} models</div>
            </button>
          ))}
        </div>
      </div>

      {/* Model Selection */}
      {provider && (
        <div>
          <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
            Model
          </label>
          <div className="space-y-1.5">
            {provider.models.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`w-full flex items-center justify-between p-3 border transition-colors ${
                  selectedModel === m
                    ? "border-[#F5C542] bg-[#F5C542]/5"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                }`}
              >
                <span className="text-white text-sm">{m}</span>
                {selectedModel === m && <Check size={14} className="text-[#F5C542]" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* API Key */}
      <div>
        <label className="block text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
          API Key
        </label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-[#F5C542] transition-colors pr-10"
            placeholder="sk-..."
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <p className="text-white/25 text-xs mt-1.5">
          Your key is encrypted and stored securely. Only admins can view or modify keys.
        </p>
      </div>

      {/* Model Mapping */}
      <div className="bg-white/[0.03] border border-white/[0.06] p-4">
        <h4 className="text-white text-sm font-medium mb-3">Agent Model Mapping</h4>
        <div className="space-y-2">
          {[
            { tier: "Leaders (CMO, Leads)", model: selectedModel, alias: "leader-model" },
            { tier: "Coordinators (Campaign, Ops)", model: selectedModel, alias: "advanced-model" },
            { tier: "Specialists (15 agents)", model: provider?.models[provider.models.length - 1] || selectedModel, alias: "standard-model" },
          ].map((mapping) => (
            <div key={mapping.tier} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-white/70 text-xs">{mapping.tier}</div>
                <div className="text-white/30 text-[10px] font-mono">{mapping.alias}</div>
              </div>
              <div className="text-white/50 text-xs font-mono">{mapping.model}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="bg-[#F5C542] text-black text-sm font-bold px-6 py-2.5 hover:brightness-110 transition-all">
        Save Configuration
      </button>
    </div>
  );
}

function ChannelSettings() {
  const [configs, setConfigs] = useState<Record<string, boolean>>({
    telegram: true,
    slack: false,
    whatsapp: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-base font-bold mb-1">Communication Channels</h3>
        <p className="text-white/40 text-sm mb-4">
          Connect messaging platforms so your team can submit requests directly via chat.
        </p>
      </div>

      {channelTypes.map((ch) => (
        <div key={ch.id} className="bg-white/[0.03] border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center ${
                ch.id === "telegram" ? "bg-blue-500/20" : ch.id === "slack" ? "bg-purple-500/20" : "bg-green-500/20"
              }`}>
                <MessageSquare size={18} className={
                  ch.id === "telegram" ? "text-blue-400" : ch.id === "slack" ? "text-purple-400" : "text-green-400"
                } />
              </div>
              <div>
                <div className="text-white text-sm font-medium">{ch.name}</div>
                <div className="text-white/30 text-xs">{ch.description}</div>
              </div>
            </div>
            <button
              onClick={() => setConfigs({ ...configs, [ch.id]: !configs[ch.id] })}
              className={`w-10 h-5 rounded-full transition-colors relative ${configs[ch.id] ? "bg-[#F5C542]" : "bg-white/20"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${configs[ch.id] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {configs[ch.id] && (
            <div className="space-y-3 pt-3 border-t border-white/[0.06]">
              {ch.configFields.map((field) => (
                <div key={field}>
                  <label className="block text-white/40 text-[10px] uppercase tracking-wider font-medium mb-1">
                    {field}
                  </label>
                  <input
                    type="password"
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#F5C542] transition-colors"
                    placeholder={`Enter ${field.toLowerCase()}`}
                    defaultValue={configs[ch.id] && ch.id === "telegram" ? "8314580946:AAF4gWoq..." : ""}
                  />
                </div>
              ))}
              <button className="text-[#F5C542] text-xs font-medium hover:brightness-110">
                Test Connection
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MemberSettings() {
  const { isAdmin } = useAuth();
  const members = [
    { name: "Sarah Chen", email: "sarah@acme.com", role: "admin", lastLogin: "2 min ago" },
    { name: "Alex Kim", email: "alex@acme.com", role: "member", lastLogin: "1 hr ago" },
    { name: "Jordan Lee", email: "jordan@acme.com", role: "member", lastLogin: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-base font-bold mb-1">Team Members</h3>
          <p className="text-white/40 text-sm">Manage who has access to this workspace</p>
        </div>
        {isAdmin && (
          <button className="bg-[#F5C542] text-black text-xs font-bold px-4 py-2 flex items-center gap-1.5 hover:brightness-110 transition-all">
            <Plus size={14} />
            Invite Member
          </button>
        )}
      </div>

      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.email} className="bg-white/[0.03] border border-white/[0.06] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/[0.06] flex items-center justify-center">
                <span className="text-white/50 text-sm font-bold">{m.name[0]}</span>
              </div>
              <div>
                <div className="text-white text-sm font-medium">{m.name}</div>
                <div className="text-white/30 text-xs">{m.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white/20 text-xs">{m.lastLogin}</span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold border px-2 py-0.5 ${
                m.role === "admin" ? "border-amber-500/40 text-amber-400" : "border-white/20 text-white/50"
              }`}>
                {m.role}
              </span>
              {isAdmin && (
                <button className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] p-4">
        <h4 className="text-white text-sm font-medium mb-2">Role Permissions</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 font-semibold w-16 shrink-0">Admin</span>
            <span className="text-white/40">Full access. Edit billing, add/remove members, configure LLM keys, manage channels, edit skills and memory, make admin-level AlphaClaw fixes.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-white/50 font-semibold w-16 shrink-0">Member</span>
            <span className="text-white/40">Submit requests, view task board, view agent status. Cannot edit keys, billing, or member list.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-base font-bold mb-1">Security & API Keys</h3>
        <p className="text-white/40 text-sm mb-4">Manage API keys, tokens, and security settings</p>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] p-4">
        <h4 className="text-white text-sm font-medium mb-3">API Keys</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <div>
              <div className="text-white/70 text-xs">Workspace API Key</div>
              <div className="text-white/30 text-[10px] font-mono">mc_ws_****...7f3a</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-[10px]">Created Mar 15</span>
              <button className="text-white/30 hover:text-white/60 text-xs">Regenerate</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-white/70 text-xs">Agent Heartbeat Token</div>
              <div className="text-white/30 text-[10px] font-mono">mc_hb_****...2e1b</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-[10px]">Created Mar 15</span>
              <button className="text-white/30 hover:text-white/60 text-xs">Regenerate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] p-4">
        <h4 className="text-white text-sm font-medium mb-3">Audit Log</h4>
        <div className="space-y-2">
          {[
            { action: "API key regenerated", actor: "sarah@acme.com", time: "2 hrs ago" },
            { action: "Member invited: alex@acme.com", actor: "sarah@acme.com", time: "1 day ago" },
            { action: "LLM provider changed to Anthropic", actor: "sarah@acme.com", time: "3 days ago" },
            { action: "Telegram channel connected", actor: "sarah@acme.com", time: "5 days ago" },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div>
                <div className="text-white/60 text-xs">{log.action}</div>
                <div className="text-white/25 text-[10px]">{log.actor}</div>
              </div>
              <span className="text-white/20 text-[10px]">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CCSettings() {
  const { user, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<SettingsTab>("llm");

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/command-center/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="w-7 h-7 bg-[#F5C542] flex items-center justify-center">
            <span className="text-black font-extrabold text-xs">O</span>
          </div>
          <span className="text-white font-bold text-sm tracking-tight">Settings</span>
          <span className="text-white/20 text-xs">{user.workspaceName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs">{user.email}</span>
          <button onClick={logout} className="text-white/30 text-xs hover:text-white/60 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                if (tab.adminOnly && !isAdmin) return null;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                      activeTab === tab.key
                        ? "text-[#F5C542] bg-white/[0.04] font-medium"
                        : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "llm" && <LLMSettings />}
            {activeTab === "channels" && <ChannelSettings />}
            {activeTab === "members" && <MemberSettings />}
            {activeTab === "security" && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
