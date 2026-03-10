import "@/components/dashboard.css";
import { StudioToolbar } from "@/components/StudioToolbar";
import { StudioOutputPanel } from "@/components/StudioOutputPanel";
import { PageHeader } from "@/components/PageHeader";

export default function StudioPage() {
  return (
    <main className="studioShellWrap">
      <div style={{ padding: "16px 16px 0" }}>
        <PageHeader title="Studio" subtitle="Build multi-step AI workflows for ads, UGC, and product creatives." actions={[{ label: "Assets", href: "/assets" }, { label: "Run workflow", primary: true }]} />
      </div>
      <StudioToolbar />
      <div className="studioShell">
        <aside className="studioRail">
          <button className="railBtn active">＋</button>
          <button className="railBtn">🖼</button>
          <button className="railBtn">▦</button>
          <button className="railBtn">💬</button>
        </aside>

        <section className="studioCanvas">
          <div className="node textNode">
            <h4>Text prompt</h4>
            <p>Write your creative prompt here...</p>
            <button className="miniRun">Run</button>
          </div>
          <div className="node imageNode">
            <h4>AI Image</h4>
            <div className="imgPlaceholder">Preview</div>
            <button className="miniRun">Run</button>
          </div>
          <div className="node videoNode">
            <h4>Video Node (Kling)</h4>
            <div className="imgPlaceholder">Video preview</div>
            <button className="miniRun">Run</button>
          </div>
          <div className="studioHint">
            <b>Tip:</b> Start with a text node, then chain image/video nodes for full ad pipelines.
          </div>
        </section>

        <aside className="studioPanel">
          <h3>Node properties</h3>
          <label>Model</label>
          <select className="input"><option>Veo 3.1 Fast</option><option>Kling 3.0</option><option>Nano Banana Pro</option></select>
          <label>Duration</label>
          <select className="input"><option>8s</option><option>15s</option></select>
          <label>Aspect ratio</label>
          <select className="input"><option>9:16</option><option>1:1</option><option>16:9</option></select>
          <button className="btn" style={{ marginTop: 12 }}>Apply</button>
        </aside>
      </div>
      <StudioOutputPanel />
    </main>
  );
}
