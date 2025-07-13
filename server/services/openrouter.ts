import OpenAI from "openai";

/**
 * OpenRouter API configuration for SmartJobFit AI
 * Uses OpenRouter for better rate limits and model access
 */
export const openrouter = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://smartjobfit.ai",
    "X-Title": "SmartJobFit AI",
  },
});

/**
 * OpenRouter model names for different use cases
 */
export const OPENROUTER_MODELS = {
  // Primary model for most tasks
  GPT_4O: "openai/gpt-4o",
  
  // Alternative models for fallback
  CLAUDE_3_SONNET: "anthropic/claude-3-sonnet",
  CLAUDE_3_HAIKU: "anthropic/claude-3-haiku",
  
  // Cost-effective options
  GPT_4O_MINI: "openai/gpt-4o-mini",
  GPT_3_5_TURBO: "openai/gpt-3.5-turbo",
} as const;

/**
 * Helper function to make OpenRouter API calls with error handling
 */
export async function makeOpenRouterCall(
  prompt: string,
  model: string = OPENROUTER_MODELS.GPT_4O,
  options: {
    jsonMode?: boolean;
    maxTokens?: number;
    temperature?: number;
  } = {}
) {
  try {
    const response = await openrouter.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: options.maxTokens || 4000,
      temperature: options.temperature || 0.7,
      ...(options.jsonMode && { response_format: { type: "json_object" } }),
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error(`OpenRouter API error with model ${model}:`, error);
    
    // Try fallback model if primary fails
    if (model === OPENROUTER_MODELS.GPT_4O) {
      console.log("Trying fallback model...");
      return makeOpenRouterCall(prompt, OPENROUTER_MODELS.GPT_4O_MINI, options);
    }
    
    throw error;
  }
}

/**
 * OpenRouter rate limits and pricing information
 */
export const OPENROUTER_INFO = {
  // Much better rate limits than direct OpenAI
  rateLimits: {
    requestsPerMinute: 200,
    tokensPerMinute: 40000,
  },
  
  // Competitive pricing
  pricing: {
    gpt4o: { input: 0.005, output: 0.015 }, // per 1K tokens
    gpt4oMini: { input: 0.0015, output: 0.006 },
    claude3Sonnet: { input: 0.003, output: 0.015 },
  },
  
  // Benefits over direct OpenAI
  benefits: [
    "Higher rate limits",
    "Better pricing",
    "Multiple model access",
    "Automatic failover",
    "Usage analytics",
  ],
};