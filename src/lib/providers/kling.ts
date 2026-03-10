export async function generateVideoWithKling(prompt: string) {
  const apiKey = process.env.KLING_API_KEY;
  const apiUrl = process.env.KLING_API_URL;
  if (!apiKey || !apiUrl) throw new Error("KLING_API_KEY or KLING_API_URL missing");

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) throw new Error(`Kling error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { videoUrl: data?.videoUrl || null, jobId: data?.jobId || null, raw: data };
}
