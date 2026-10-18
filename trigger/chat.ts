import { chat } from "@trigger.dev/sdk/ai"
import { openrouter } from "@openrouter/ai-sdk-provider"

// One durable run per chat. History is kept by the platform's default
// transcript storage, keyed by chat id.
export const chatAgent = chat.agent({
  id: "chat",
  // streamText from the run argument, not from "ai": it carries the managed options.
  run: async ({ messages, signal, streamText }) =>
    streamText({
      model: openrouter("deepseek/deepseek-v4.1-flash-1017"),
      messages,
      abortSignal: signal,
    }),
})
