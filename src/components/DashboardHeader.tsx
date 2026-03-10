import { TemplateDetailsModal } from "@/components/TemplateDetailsModal";

export function DashboardHeader() {
  return (
    <div className="topbar" id="overview">
      <div className="pageHeaderMeta">
        <span className="kicker">Dashboard</span>
        <h1 className="pageTitle">Welcome back</h1>
      </div>
      <div className="actions">
        <TemplateDetailsModal />
        <a className="btnGhost" href="/assets">Assets</a>
        <a className="btnGhost" href="/studio">Open studio</a>
        <button className="btnPrimary">Create agent</button>
      </div>
    </div>
  );
}
