import { generateWithOpenAI } from "./openai";
import { generateWithGemini } from "./gemini";
import { generateWithClaude } from "./claude";
import { generateImageWithOpenAI } from "./openai-image";
import { generateImageWithNanoBanana } from "./nanobanana";
import { generateVideoWithKling } from "./kling";
import { buildPrompt } from "./prompts";

export type RunInput = Record<string, unknown>;

function fallbackExecution(agentSlug: string, input: RunInput) {
  if (agentSlug.includes("image")) {
    return { kind: "json" as const, data: { imageUrl: null, note: "fallback image response" } };
  }
  if (agentSlug.includes("video")) {
    return { kind: "json" as const, data: { videoUrl: null, note: "fallback video response" } };
  }

  switch (agentSlug) {
    case "ugc-script":
      return {
        kind: "text" as const,
        data: {
          hook: `Stop scrolling: ${String(input.productName || "your product")} changes the game`,
          body: `Top benefits: ${Array.isArray(input.usps) ? input.usps.join(", ") : "N/A"}`,
          cta: "Try it today"
        }
      };
    case "static-ads":
      return {
        kind: "json" as const,
        data: {
          headline: `Unlock ${String(input.offer || "your offer")}`,
          audience: String(input.audience || "broad audience"),
          concepts: ["Problem/Solution", "Social Proof", "Before/After"]
        }
      };
    default:
      return { kind: "json" as const, data: { message: "Fallback execution" } };
  }
}

async function runText(prompt: string, providerOverride?: string) {
  const provider = (providerOverride || process.env.TEXT_PROVIDER || "openai").toLowerCase();
  if (provider === "gemini") {
    const out = await generateWithGemini(prompt);
    return { content: out.text, provider: "gemini", model: process.env.GEMINI_MODEL || "gemini-1.5-pro" };
  }
  if (provider === "claude") {
    const out = await generateWithClaude(prompt);
    return { content: out.text, provider: "claude", model: process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest" };
  }
  const out = await generateWithOpenAI(prompt);
  return { content: out.text, provider: "openai", model: process.env.OPENAI_MODEL || "gpt-4o-mini" };
}

async function runImage(prompt: string, providerOverride?: string) {
  const provider = (providerOverride || process.env.IMAGE_PROVIDER || "openai").toLowerCase();
  if (provider === "nanobananapro" || provider === "nanobanana") {
    const out = await generateImageWithNanoBanana(prompt);
    return { provider: "nanobanana", ...out };
  }
  const out = await generateImageWithOpenAI(prompt);
  return { provider: "openai-image", ...out };
}

async function runVideo(prompt: string, providerOverride?: string) {
  const provider = (providerOverride || process.env.VIDEO_PROVIDER || "kling").toLowerCase();
  if (provider !== "kling") throw new Error("Only Kling configured for VIDEO_PROVIDER currently");
  const out = await generateVideoWithKling(prompt);
  return { provider: "kling", ...out };
}

export async function executeAgent(agentSlug: string, input: RunInput) {
  const prompt = buildPrompt(agentSlug, input);
  const providerOverride = typeof input.provider === "string" ? input.provider : undefined;

  try {
    if (agentSlug.includes("image")) {
      return { kind: "json" as const, data: await runImage(prompt, providerOverride) };
    }
    if (agentSlug.includes("video")) {
      return { kind: "json" as const, data: await runVideo(prompt, providerOverride) };
    }

    return { kind: "text" as const, data: await runText(prompt, providerOverride) };
  } catch {
    return fallbackExecution(agentSlug, input);
  }
}
