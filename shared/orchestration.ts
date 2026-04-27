/**
 * Orchestration Engine Abstraction Layer
 *
 * This module provides a stable interface between Outclaw and the underlying
 * orchestration engine (currently AlphaClaw). By routing all engine interactions
 * through this abstraction, Outclaw remains compatible with future versions of
 * AlphaClaw, Outclaw, or any other orchestration backend.
 *
 * To swap engines:
 *   1. Implement the OrchestrationEngine interface
 *   2. Update the factory function below
 *   3. No other code changes required
 */

// ── Engine Interface ──────────────────────────────────────────────────

export interface AgentConfig {
  agentId: string;
  name: string;
  role: string;
  tier: "leader" | "coordinator" | "specialist";
  subFunction: string;
  systemPrompt?: string;
  model?: string;
}

export interface TaskBrief {
  id: string;
  title: string;
  goals?: string;
  audience?: string;
  creative?: string;
  channels?: string;
  stakeholders?: string;
  priority: "low" | "medium" | "high" | "urgent";
  context?: Record<string, unknown>;
}

export interface RoutingDecision {
  targetAgentId: string;
  reasoning: string;
  enrichedBrief?: Partial<TaskBrief>;
}

export interface TaskResult {
  agentId: string;
  output: string;
  status: "completed" | "needs_review" | "failed";
  metadata?: Record<string, unknown>;
}

export interface OrchestrationEngine {
  /** Engine identifier (e.g., "alphaclaw", "openclaw") */
  readonly engineId: string;

  /** Engine version string */
  readonly version: string;

  /** Initialize the engine with agent configurations */
  initialize(agents: AgentConfig[]): Promise<void>;

  /** Route a GACCS brief through the CMA to the appropriate function head */
  routeBrief(brief: TaskBrief): Promise<RoutingDecision>;

  /** Delegate a task from a function head to a specialist */
  delegateTask(
    brief: TaskBrief,
    fromAgentId: string,
    toAgentId: string,
  ): Promise<void>;

  /** Execute a task with a specific agent */
  executeTask(brief: TaskBrief, agentId: string): Promise<TaskResult>;

  /** Submit a task result for review (flows up the chain) */
  submitForReview(
    taskId: string,
    result: TaskResult,
  ): Promise<{ approved: boolean; feedback?: string }>;

  /** Check engine health and connectivity */
  healthCheck(): Promise<{ healthy: boolean; details?: string }>;
}

// ── Browser Capability Interface ──────────────────────────────────────

export interface BrowserCapability {
  /** Provider identifier (e.g., "browser-harness") */
  readonly providerId: string;

  /** Navigate to a URL and return page content */
  browse(url: string): Promise<{ content: string; title: string }>;

  /** Execute a search query and return results */
  search(query: string): Promise<Array<{ title: string; url: string; snippet: string }>>;

  /** Take a screenshot of the current page */
  screenshot(): Promise<Buffer>;

  /** Check if the browser is available */
  isAvailable(): Promise<boolean>;
}

// ── Engine Factory ────────────────────────────────────────────────────

export type EngineType = "alphaclaw" | "outclaw" | "custom";

/**
 * Supported engine configurations.
 * Add new engines here as they become available.
 */
export const SUPPORTED_ENGINES: Record<
  EngineType,
  { name: string; description: string; configKeys: string[] }
> = {
  alphaclaw: {
    name: "AlphaClaw",
    description: "Default orchestration engine with management UI and watchdog",
    configKeys: ["ALPHACLAW_CONFIG_PATH"],
  },
  outclaw: {
    name: "Outclaw",
    description: "Core orchestration framework",
    configKeys: ["OUTCLAW_CONFIG_PATH"],
  },
  custom: {
    name: "Custom Engine",
    description: "User-provided orchestration engine implementation",
    configKeys: ["CUSTOM_ENGINE_MODULE"],
  },
};

/**
 * Supported browser capability providers.
 */
export const SUPPORTED_BROWSERS: Record<
  string,
  { name: string; description: string; configKeys: string[] }
> = {
  "browser-harness": {
    name: "browser-harness",
    description: "Self-healing CDP-based browser control by Browser Use",
    configKeys: ["BROWSER_HARNESS_URL"],
  },
};
