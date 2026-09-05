export function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export function SkeletonRow() {
  return (
    <div className="content-row">
      <div className="skeleton skeleton-row-title" />
      <div className="content-row-track">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="hero-banner skeleton-hero">
      <div className="hero-content">
        <div className="skeleton skeleton-line" style={{ width: '60%', height: 40 }} />
        <div className="skeleton skeleton-line" style={{ width: '90%', marginTop: 16 }} />
        <div className="skeleton skeleton-line" style={{ width: '75%' }} />
        <div className="hero-actions">
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="detail-page">
      <div className="skeleton skeleton-video" />
      <div className="detail-info">
        <div className="skeleton skeleton-line" style={{ width: '50%', height: 32 }} />
        <div className="skeleton skeleton-line" style={{ width: '30%', marginTop: 12 }} />
        <div className="skeleton skeleton-line" style={{ width: '100%', marginTop: 20 }} />
        <div className="skeleton skeleton-line" style={{ width: '95%' }} />
        <div className="skeleton skeleton-line" style={{ width: '80%' }} />
      </div>
    </div>
  );
}
