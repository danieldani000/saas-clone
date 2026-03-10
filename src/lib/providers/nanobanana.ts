export async function generateImageWithNanoBanana(prompt: string) {
  // Placeholder adapter: set NANOBANANA_API_URL to your gateway/proxy endpoint.
  const apiKey = process.env.NANOBANANA_API_KEY;
  const apiUrl = process.env.NANOBANANA_API_URL;
  if (!apiKey || !apiUrl) throw new Error("NANOBANANA_API_KEY or NANOBANANA_API_URL missing");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error(`NanoBanana error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { imageUrl: data?.imageUrl || null, raw: data };
}
