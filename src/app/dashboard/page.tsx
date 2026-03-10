export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { RunForm } from "@/components/RunForm";
import { AuditLogPanel } from "@/components/AuditLogPanel";
import { BillingPanel } from "@/components/BillingPanel";
import { TemplateGallery } from "@/components/TemplateGallery";
import { PlansCredits } from "@/components/PlansCredits";
import { GenerateFlowPanel } from "@/components/GenerateFlowPanel";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KpiRow } from "@/components/KpiRow";
import { SidebarNav } from "@/components/SidebarNav";
import { RecentRunsGrid } from "@/components/RecentRunsGrid";
import { QuickTemplateCards } from "@/components/QuickTemplateCards";
import "@/components/dashboard.css";

export default async function DashboardPage() {
  const [agents, runs] = await Promise.all([
    db.agent.findMany({ where: { active: true } }),
    db.agentRun.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { agent: true } })
  ]);

  const done = runs.filter((r) => r.status === "done").length;
  const failed = runs.filter((r) => r.status === "failed").length;

  return (
    <main className="shell">
      <SidebarNav />

      <div className="main">
        <DashboardHeader />
        <KpiRow total={runs.length} done={done} failed={failed} />

        <section className="section" id="quick">
          <div className="sectionHead">
            <h2 style={{ margin: 0 }}>Welcome to Creative Ops</h2>
            <span className="muted">No-code visual marketing workflows</span>
          </div>
          <p className="muted" style={{ marginTop: 0 }}>Build and run AI agents for text, image, and video creation in one workspace.</p>
          <div style={{ border: "1px solid #e8e8ee", borderRadius: 12, background: "#f7f7fb", height: 260, display: "grid", placeItems: "center", marginBottom: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 999, background: "#fff", border: "1px solid #ddd", display: "grid", placeItems: "center", margin: "0 auto 8px" }}>▶</div>
              <div className="muted">Product walkthrough video</div>
            </div>
          </div>
          <QuickTemplateCards templates={agents.map((a) => ({ id: a.id, name: a.name, description: a.description, slug: a.slug }))} />
        </section>

        <GenerateFlowPanel />
        <RunForm agents={agents.map((a) => ({ id: a.id, name: a.name, slug: a.slug }))} />

        <RecentRunsGrid runs={runs as any} />

        <div id="agents"><TemplateGallery /></div>
        <PlansCredits />
        <div id="billing"><BillingPanel /></div>
        <div id="audit" className="section"><AuditLogPanel /></div>
      </div>
    </main>
  );
}
