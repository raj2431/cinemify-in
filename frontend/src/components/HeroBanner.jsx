import { Link } from 'react-router-dom';

export default function HeroBanner({ content }) {
  if (!content) return null;

  return (
    <section
      className="hero-banner"
      style={{ backgroundImage: `linear-gradient(to top, rgba(20,20,20,1), rgba(20,20,20,0.2)), url(${content.bannerUrl || content.posterUrl})` }}
    >
      <div className="hero-content">
        <h1>{content.title}</h1>
        <p className="hero-description">{content.description}</p>
        <div className="hero-actions">
          <Link to={`/title/${content.id}`} className="btn-primary">▶ Play</Link>
          <Link to={`/title/${content.id}`} className="btn-secondary">More Info</Link>
        </div>
      </div>
    </section>
  );
}
