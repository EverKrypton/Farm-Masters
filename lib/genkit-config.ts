import { configureGenkit } from "@genkit-ai/core"
import { googleAI } from "@genkit-ai/googleai"

let ai: any = null

try {
  // Only configure if API key is available
  if (process.env.GOOGLE_AI_API_KEY) {
    ai = configureGenkit({
      plugins: [
        googleAI({
          apiKey: process.env.GOOGLE_AI_API_KEY,
        }),
      ],
      logLevel: "info",
      enableTracingAndMetrics: false,
    })
  }
} catch (error) {
  console.warn("Genkit configuration failed:", error)
}

export { ai }
export const geminiPro = "googleai/gemini-1.5-pro-latest"
export const geminiFlash = "googleai/gemini-1.5-flash-latest"
