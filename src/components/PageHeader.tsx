type Action = { label: string; href?: string; primary?: boolean };

export function PageHeader({ title, subtitle, actions = [] }: { title: string; subtitle?: string; actions?: Action[] }) {
  return (
    <header className="pageHeader">
      <div className="pageHeaderMeta">
        <span className="kicker">Workspace</span>
        <h1 className="pageTitle" style={{ marginBottom: 4 }}>{title}</h1>
        {subtitle && <p className="muted" style={{ margin: 0 }}>{subtitle}</p>}
      </div>
      <div className="actions">
        {actions.map((a) => (
          a.href ? <a key={a.label} className={a.primary ? "btnPrimary" : "btnGhost"} href={a.href}>{a.label}</a>
                 : <button key={a.label} className={a.primary ? "btnPrimary" : "btnGhost"}>{a.label}</button>
        ))}
      </div>
    </header>
  );
}
