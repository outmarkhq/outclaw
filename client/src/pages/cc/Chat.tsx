import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, Message } from "@/components/AIChatBox";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Bot, Brain, MessageSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function Chat() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState("chief-marketing");

  // Get workspace
  const { data: workspaces, isLoading: wsLoading } =
    trpc.workspace.list.useQuery();
  const workspace = workspaces?.[0];

  // Get agents for the agent selector
  const { data: agents } = trpc.agents.list.useQuery(
    { workspaceId: workspace?.id ?? 0 },
    { enabled: !!workspace }
  );

  // Get chat history
  const { data: chatHistory, refetch: refetchHistory } =
    trpc.chat.history.useQuery(
      { workspaceId: workspace?.id ?? 0 },
      { enabled: !!workspace }
    );

  // Send message mutation
  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      refetchHistory();
    },
  });

  // Convert chat history to Message format
  const messages: Message[] = useMemo(() => {
    if (!chatHistory) return [];
    return chatHistory
      .filter((m) => m.agentId === selectedAgent)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
  }, [chatHistory, selectedAgent]);

  // Auth & workspace guards
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

  const handleSend = (content: string) => {
    sendMessage.mutate({
      workspaceId: workspace.id,
      message: content,
      agentId: selectedAgent,
    });
  };

  // Get the selected agent info
  const currentAgent = agents?.find((a) => a.agentId === selectedAgent);

  const suggestedPrompts = [
    "Draft a LinkedIn post about our latest product launch",
    "Create a competitive analysis brief for Q2",
    "What's our content calendar looking like this week?",
    "Help me write a GACCS brief for a new campaign",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[oklch(0.87_0.29_142)]/10 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-[oklch(0.87_0.29_142)]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Agent Chat</h1>
            <p className="text-[11px] text-white/30">
              Talk to your marketing agents directly
            </p>
          </div>
        </div>

        {/* Agent selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/30 uppercase tracking-wider">
            Talking to:
          </span>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[240px] bg-white/[0.04] border-white/10 text-white h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {agents?.map((agent) => (
                <SelectItem key={agent.agentId} value={agent.agentId}>
                  <div className="flex items-center gap-2">
                    {agent.tier === "leader" ? (
                      <Brain className="w-3 h-3 text-[oklch(0.87_0.29_142)]" />
                    ) : (
                      <Bot className="w-3 h-3 text-white/40" />
                    )}
                    <span>{agent.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Agent context bar */}
      {currentAgent && (
        <div className="px-6 py-2 bg-white/[0.02] border-b border-white/[0.04]">
          <p className="text-[11px] text-white/25">
            <span className="text-white/40 font-medium">
              {currentAgent.name}
            </span>{" "}
            — {currentAgent.role}
          </p>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 min-h-0">
        <AIChatBox
          messages={messages}
          onSendMessage={handleSend}
          isLoading={sendMessage.isPending}
          placeholder={`Message ${currentAgent?.name ?? "the Chief Marketing Agent"}...`}
          height="100%"
          emptyStateMessage={`Start a conversation with ${currentAgent?.name ?? "your Chief Marketing Agent"}. Ask about campaigns, strategy, content, or delegate tasks.`}
          suggestedPrompts={suggestedPrompts}
        />
      </div>
    </div>
  );
}
