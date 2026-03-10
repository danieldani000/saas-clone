"use client";

import { useState } from "react";

export function GenerateFlowPanel() {
  const [step, setStep] = useState(1);
  const [brief, setBrief] = useState("");
  const [textProvider, setTextProvider] = useState("claude");
  const [imageProvider, setImageProvider] = useState("nanobananapro");
  const [videoProvider, setVideoProvider] = useState("kling");
  const [result, setResult] = useState<string>("");

  async function runFlow() {
    const res = await fetch("/api/v1/generate-flow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief, textProvider, imageProvider, videoProvider })
    });
    const json = await res.json();
    setResult(JSON.stringify(json, null, 2));
  }

  return (
    <section className="section">
      <div className="sectionHead">
        <h2 style={{ margin: 0 }}>Generate Flow</h2>
        <span className="tag">Step {step}/3</span>
      </div>
      <div className="flowSteps">
        <button className={`flowStep ${step===1?"active":""}`} onClick={() => setStep(1)}>1. Brief</button>
        <button className={`flowStep ${step===2?"active":""}`} onClick={() => setStep(2)}>2. Model</button>
        <button className={`flowStep ${step===3?"active":""}`} onClick={() => setStep(3)}>3. Generate</button>
      </div>
      {step === 1 && <label className="field"><span>Campaign brief</span><textarea className="input" rows={4} value={brief} onChange={(e)=>setBrief(e.target.value)} placeholder="Describe objective, audience, and angle..." /></label>}
      {step === 2 && (
        <div className="formGrid">
          <label className="field"><span>Text model</span><select className="input" value={textProvider} onChange={(e)=>setTextProvider(e.target.value)}><option>claude</option><option>openai</option><option>gemini</option></select></label>
          <label className="field"><span>Image model</span><select className="input" value={imageProvider} onChange={(e)=>setImageProvider(e.target.value)}><option>nanobananapro</option><option>openai</option></select></label>
          <label className="field"><span>Video model</span><select className="input" value={videoProvider} onChange={(e)=>setVideoProvider(e.target.value)}><option>kling</option></select></label>
        </div>
      )}
      {step === 3 && <button className="btn" onClick={runFlow}>Run full generation</button>}
      {result && <pre className="resultBox">{result}</pre>}
    </section>
  );
}
