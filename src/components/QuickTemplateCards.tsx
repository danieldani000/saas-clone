type Template = { id: string; name: string; description: string; slug: string };

export function QuickTemplateCards({ templates }: { templates: Template[] }) {
  return (
    <div className="quickGrid">
      {templates.slice(0, 6).map((a, i) => (
        <article key={a.id} className="quickCard premium">
          <div className="thumb" style={{ background: i % 2 ? "linear-gradient(135deg,#ffe8d7,#ffd2ae)" : "linear-gradient(135deg,#eceef4,#d9deea)" }} />
          <h3>{a.name}</h3>
          <p>{a.description}</p>
          <span className="tag">{a.slug}</span>
        </article>
      ))}
    </div>
  );
}
