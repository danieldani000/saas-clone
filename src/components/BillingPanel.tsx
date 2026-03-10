"use client";

import { useState } from "react";

export function BillingPanel() {
  const [workspaceId, setWorkspaceId] = useState("");
  const [plan, setPlan] = useState("pro");
  const [customerId, setCustomerId] = useState("");

  async function checkout() {
    const res = await fetch("/api/v1/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, plan })
    });
    const json = await res.json();
    if (json?.data?.checkoutUrl) window.open(json.data.checkoutUrl, "_blank");
    else alert(JSON.stringify(json));
  }

  async function portal() {
    const res = await fetch("/api/v1/billing/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId })
    });
    const json = await res.json();
    if (json?.data?.portalUrl) window.open(json.data.portalUrl, "_blank");
    else alert(JSON.stringify(json));
  }

  return (
    <section className="section">
      <div className="sectionHead"><h2 style={{ margin: 0 }}>Billing</h2></div>
      <div className="formGrid">
        <label className="field"><span>Workspace ID</span><input className="input" placeholder="ws_..." value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} /></label>
        <label className="field"><span>Plan</span><select className="input" value={plan} onChange={(e) => setPlan(e.target.value)}><option value="pro">pro</option><option value="growth">growth</option></select></label>
        <label className="field fieldWide"><span>Stripe customer ID</span><input className="input" placeholder="cus_..." value={customerId} onChange={(e) => setCustomerId(e.target.value)} /></label>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={checkout}>Open Stripe Checkout</button>
        <button className="btnGhost" onClick={portal}>Open Billing Portal</button>
      </div>
    </section>
  );
}
