export function StudioToolbar() {
  return (
    <div className="studioToolbar">
      <div className="left">
        <button className="btnGhost">Templates</button>
        <button className="btnGhost">Import asset</button>
        <button className="btnGhost">Add node</button>
      </div>
      <div className="right">
        <button className="btnGhost">Save draft</button>
        <button className="btn">Run workflow</button>
      </div>
    </div>
  );
}
