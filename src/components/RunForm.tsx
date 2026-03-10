"use client";

import { useMemo, useState } from "react";

type Agent = { id: string; name: string; slug: string };

export function RunForm({ agents }: { agents: Agent[] }) {
  const [workspaceId, setWorkspaceId] = useState("");
  const [agentId, setAgentId] = useState(agents[0]?.id || "");
  const [productName, setProductName] = useState("My Product");
  const [usps, setUsps] = useState("Fast,Affordable");
  const [provider, setProvider] = useState("default");
  const [result, setResult] = useState<string>("");

  const selectedAgent = useMemo(() => agents.find((a) => a.id === agentId), [agents, agentId]);
  const providerOptions = useMemo(() => {
    if (!selectedAgent) return ["default"];
    if (selectedAgent.slug.includes("image")) return ["default", "openai", "nanobananapro"];
    if (selectedAgent.slug.includes("video")) return ["default", "kling"];
    return ["default", "openai", "gemini", "claude"];
  }, [selectedAgent]);

  async function submit() {
    const payload = {
      workspaceId,
      agentId,
      input: {
        productName,
        usps: usps.split(",").map((x) => x.trim()).filter(Boolean),
        ...(provider !== "default" ? { provider } : {})
      }
    };

    const res = await fetch("/api/agent-runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="section">
      <div className="sectionHead"><h2 style={{ margin: 0 }}>Create run</h2></div>
      <div className="formGrid">
        <label className="field"><span>Workspace ID</span><input className="input" placeholder="ws_..." value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} /></label>
        <label className="field"><span>Agent</span><select className="input" value={agentId} onChange={(e) => setAgentId(e.target.value)}>{agents.map((a) => (<option key={a.id} value={a.id}>{a.name} ({a.slug})</option>))}</select></label>
        <label className="field"><span>Provider</span><select className="input" value={provider} onChange={(e) => setProvider(e.target.value)}>{providerOptions.map((p) => (<option key={p} value={p}>{p}</option>))}</select></label>
        <label className="field"><span>Product / Brief</span><input className="input" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name / brief" /></label>
        <label className="field fieldWide"><span>USPs</span><input className="input" value={usps} onChange={(e) => setUsps(e.target.value)} placeholder="Fast, Affordable, Durable" /></label>
      </div>
      <div style={{ marginTop: 12 }}><button className="btn" onClick={submit}>Launch run</button></div>
      {result && <pre className="resultBox">{result}</pre>}
    </div>
  );
}
