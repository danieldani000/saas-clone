export function SidebarNav() {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="dot" /> Creative Ops</div>
      <div className="navTitle">Workspace</div>
      <nav className="nav">
        <a className="active" href="#overview">Home</a>
        <a href="#quick">Quick create</a>
        <a href="#runs">Runs</a>
        <a href="#billing">Billing</a>
      </nav>
      <div className="navTitle">Resources</div>
      <nav className="nav">
        <a href="#agents">Templates</a>
        <a href="#audit">Audit logs</a>
      </nav>
    </aside>
  );
}
