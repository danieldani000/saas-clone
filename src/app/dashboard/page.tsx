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
            <h2>Welcome to Creative Ops</h2>
            <span className="tag">No-code visual marketing workflows</span>
          </div>
          <p className="muted">Build and run AI agents for text, image, and video creation in one workspace.</p>
          <div className="emptyState" style={{ marginBottom: 12 }}>
            <h3>Product walkthrough</h3>
            <p>Start with quick templates then customize in studio.</p>
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
