export async function generateImageWithOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, prompt, size: "1024x1024" })
  });

  if (!res.ok) throw new Error(`OpenAI image error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { imageBase64: data?.data?.[0]?.b64_json, raw: data };
}
