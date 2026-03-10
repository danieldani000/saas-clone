import "@/components/dashboard.css";

export default function LoadingAssets() {
  return (
    <main style={{ padding: 24 }}>
      <div className="skeleton skTitle" style={{ marginBottom: 14 }} />
      <div className="masonry">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="assetCard"><div className="skeleton skAsset" /></div>
        ))}
      </div>
    </main>
  );
}
