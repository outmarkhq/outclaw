/**
 * Shared LLM provider configuration used across onboarding, settings, and server-side routing.
 * All OpenAI-compatible providers use the same chat completions API shape.
 */

export type LLMProvider = {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  isOpenAICompatible: boolean;
  defaultModel: string;
  models: string[];
  apiKeyPrefix?: string;
  apiKeyPlaceholder: string;
  docsUrl: string;
};

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o, GPT-4, o1, o3",
    baseUrl: "https://api.openai.com/v1",
    isOpenAICompatible: true,
    defaultModel: "gpt-4o",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "o1", "o3-mini"],
    apiKeyPrefix: "sk-",
    apiKeyPlaceholder: "sk-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude 4, Claude 3.5 Sonnet",
    baseUrl: "https://api.anthropic.com/v1",
    isOpenAICompatible: false,
    defaultModel: "claude-sonnet-4-20250514",
    models: ["claude-sonnet-4-20250514", "claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022"],
    apiKeyPrefix: "sk-ant-",
    apiKeyPlaceholder: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "google",
    name: "Google",
    description: "Gemini 2.5 Pro, Gemini 2.5 Flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    isOpenAICompatible: false,
    defaultModel: "gemini-2.5-pro",
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.0-flash"],
    apiKeyPlaceholder: "AIza...",
    docsUrl: "https://aistudio.google.com/apikey",
  },
  {
    id: "xai",
    name: "xAI",
    description: "Grok 3, Grok 2",
    baseUrl: "https://api.x.ai/v1",
    isOpenAICompatible: true,
    defaultModel: "grok-3",
    models: ["grok-3", "grok-3-mini", "grok-2"],
    apiKeyPrefix: "xai-",
    apiKeyPlaceholder: "xai-...",
    docsUrl: "https://console.x.ai",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    description: "DeepSeek V3, DeepSeek R1",
    baseUrl: "https://api.deepseek.com/v1",
    isOpenAICompatible: true,
    defaultModel: "deepseek-chat",
    models: ["deepseek-chat", "deepseek-reasoner"],
    apiKeyPrefix: "sk-",
    apiKeyPlaceholder: "sk-...",
    docsUrl: "https://platform.deepseek.com/api_keys",
  },
  {
    id: "kimi",
    name: "Kimi (Moonshot)",
    description: "Moonshot v1, Kimi K2",
    baseUrl: "https://api.moonshot.cn/v1",
    isOpenAICompatible: true,
    defaultModel: "moonshot-v1-128k",
    models: ["moonshot-v1-128k", "moonshot-v1-32k", "moonshot-v1-8k"],
    apiKeyPrefix: "sk-",
    apiKeyPlaceholder: "sk-...",
    docsUrl: "https://platform.moonshot.cn/console/api-keys",
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Mistral Large, Codestral",
    baseUrl: "https://api.mistral.ai/v1",
    isOpenAICompatible: true,
    defaultModel: "mistral-large-latest",
    models: ["mistral-large-latest", "mistral-medium-latest", "codestral-latest", "mistral-small-latest"],
    apiKeyPlaceholder: "...",
    docsUrl: "https://console.mistral.ai/api-keys",
  },
  {
    id: "together",
    name: "Together AI",
    description: "Llama 3.1, Mixtral, Qwen",
    baseUrl: "https://api.together.xyz/v1",
    isOpenAICompatible: true,
    defaultModel: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    models: [
      "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      "Qwen/Qwen2.5-72B-Instruct-Turbo",
      "mistralai/Mixtral-8x22B-Instruct-v0.1",
    ],
    apiKeyPlaceholder: "...",
    docsUrl: "https://api.together.xyz/settings/api-keys",
  },
  {
    id: "fireworks",
    name: "Fireworks AI",
    description: "Llama 3.1, Mixtral, fast inference",
    baseUrl: "https://api.fireworks.ai/inference/v1",
    isOpenAICompatible: true,
    defaultModel: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    models: [
      "accounts/fireworks/models/llama-v3p1-70b-instruct",
      "accounts/fireworks/models/llama-v3p1-8b-instruct",
      "accounts/fireworks/models/mixtral-8x22b-instruct",
    ],
    apiKeyPlaceholder: "fw_...",
    docsUrl: "https://fireworks.ai/account/api-keys",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Aggregator: access 100+ models",
    baseUrl: "https://openrouter.ai/api/v1",
    isOpenAICompatible: true,
    defaultModel: "openai/gpt-4o",
    models: ["openai/gpt-4o", "anthropic/claude-sonnet-4", "google/gemini-2.5-pro", "meta-llama/llama-3.1-70b-instruct"],
    apiKeyPrefix: "sk-or-",
    apiKeyPlaceholder: "sk-or-...",
    docsUrl: "https://openrouter.ai/keys",
  },
  {
    id: "ollama",
    name: "Ollama (Local)",
    description: "Self-hosted: Llama, Mistral, Phi",
    baseUrl: "http://localhost:11434/v1",
    isOpenAICompatible: true,
    defaultModel: "llama3.1",
    models: ["llama3.1", "mistral", "phi3", "gemma2", "qwen2.5"],
    apiKeyPlaceholder: "ollama (no key needed)",
    docsUrl: "https://ollama.com",
  },
  {
    id: "azure",
    name: "Azure OpenAI",
    description: "Enterprise: GPT-4o via Azure",
    baseUrl: "",
    isOpenAICompatible: true,
    defaultModel: "gpt-4o",
    models: ["gpt-4o", "gpt-4", "gpt-35-turbo"],
    apiKeyPlaceholder: "...",
    docsUrl: "https://portal.azure.com",
  },
  {
    id: "custom",
    name: "Custom",
    description: "Any OpenAI-compatible endpoint",
    baseUrl: "",
    isOpenAICompatible: true,
    defaultModel: "",
    models: [],
    apiKeyPlaceholder: "...",
    docsUrl: "",
  },
];

export function getProvider(id: string): LLMProvider | undefined {
  return LLM_PROVIDERS.find((p) => p.id === id);
}

export function getProviderBaseUrl(id: string): string {
  return getProvider(id)?.baseUrl ?? "";
}

export function getDefaultModel(id: string): string {
  return getProvider(id)?.defaultModel ?? "";
}
