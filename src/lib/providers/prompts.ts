import type { RunInput } from "./engine";

export function buildPrompt(agentSlug: string, input: RunInput) {
  switch (agentSlug) {
    case "ugc-script":
      return `You are a performance creative strategist. Write a short UGC ad script in French with hook/body/cta.\nInput: ${JSON.stringify(input)}`;
    case "static-ads":
      return `You are a direct-response copywriter. Create 5 static ad concepts in French with headline, visual angle and CTA.\nInput: ${JSON.stringify(input)}`;
    case "market-research":
      return `You are a growth marketer. Analyze competitor messaging and return winning angles in French.\nInput: ${JSON.stringify(input)}`;
    case "product-image":
      return `Create a high-converting product marketing image prompt from this input. Return only the final visual prompt in French.\nInput: ${JSON.stringify(input)}`;
    case "kling-video":
      return `Create a short ad video generation prompt based on this brief. Return only the final prompt in French.\nInput: ${JSON.stringify(input)}`;
    default:
      return `Return useful JSON output for this request: ${JSON.stringify(input)}`;
  }
}
