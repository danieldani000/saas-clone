type ClaudeTextResult = { text: string; raw?: unknown };

export async function generateWithClaude(prompt: string): Promise<ClaudeTextResult> {
  const apiKey = process.env.CLAUDE_API_KEY;
  const model = process.env.CLAUDE_MODEL || "claude-3-5-sonnet-latest";
  if (!apiKey) throw new Error("CLAUDE_API_KEY is missing");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!res.ok) throw new Error(`Claude error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.content?.map((c: any) => c?.text || "").join("\n") || "";
  return { text, raw: data };
}
