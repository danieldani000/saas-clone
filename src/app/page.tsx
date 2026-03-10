import Link from "next/link";
import "@/components/dashboard.css";

export default function HomePage() {
  return (
    <main className="landing">
      <section className="landingHero">
        <p className="kicker">Creative Ops Platform</p>
        <h1 className="landingTitle">Build, run and scale AI creative workflows.</h1>
        <p className="landingCopy">
          Premium workspace for generation, orchestration and asset ops. Keep your team fast with one
          unified dashboard for templates, runs, billing and studio production.
        </p>
        <div className="landingActions">
          <Link href="/dashboard" className="btnPrimary">Open dashboard</Link>
          <Link href="/onboarding" className="btnGhost">Start onboarding</Link>
        </div>
      </section>
    </main>
  );
}
