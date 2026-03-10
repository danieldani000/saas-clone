import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", display: "grid", gap: 12 }}>
      <h1>Creative Ops Clone V1</h1>
      <p>Functional clone scaffold (agents, runs, outputs, usage).</p>
      <Link href="/dashboard">Open dashboard</Link>
      <Link href="/onboarding">Start onboarding</Link>
    </main>
  );
}
