export const dynamic = "force-dynamic";
"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [workspaceId, setWorkspaceId] = useState("");
  const [brandName, setBrandName] = useState("My Brand");
  const [tone, setTone] = useState("Direct response");
  const [provider, setProvider] = useState("openai");
  const [done, setDone] = useState<string>("");

  async function createWorkspace() {
    const res = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: workspaceName })
    });
    const json = await res.json();
    setWorkspaceId(json?.data?.id || "");
  }

  async function saveBrandKit() {
    if (!workspaceId) return;
    await fetch("/api/brand-kit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, brandName, tone, forbiddenWords: [] })
    });
  }

  async function finish() {
    await saveBrandKit();
    setDone(`Onboarding complete for ${workspaceId}. Preferred provider: ${provider}`);
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", fontFamily: "Inter, sans-serif", display: "grid", gap: 14 }}>
      <h1>Onboarding</h1>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
        <h3>1) Workspace</h3>
        <input style={{ width: "100%", padding: 10 }} value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
        <button style={{ marginTop: 10 }} onClick={createWorkspace}>Create workspace</button>
        {workspaceId && <p>workspaceId: <code>{workspaceId}</code></p>}
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
        <h3>2) Brand kit</h3>
        <input style={{ width: "100%", padding: 10, marginBottom: 8 }} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Brand name" />
        <input style={{ width: "100%", padding: 10 }} value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Tone" />
      </section>

      <section style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
        <h3>3) Default provider</h3>
        <select style={{ width: "100%", padding: 10 }} value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="openai">OpenAI</option>
          <option value="gemini">Gemini</option>
          <option value="claude">Claude</option>
        </select>
      </section>

      <button onClick={finish}>Finish onboarding</button>
      {done && <pre>{done}</pre>}
    </main>
  );
}
