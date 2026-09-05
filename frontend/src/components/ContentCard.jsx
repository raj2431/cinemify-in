import { Link } from 'react-router-dom';

export default function ContentCard({ content }) {
  return (
    <Link to={`/title/${content.id}`} className="content-card">
      <img
        src={content.posterUrl || 'https://placehold.co/300x450?text=No+Image'}
        alt={content.title}
        loading="lazy"
      />
      <div className="content-card-overlay">
        <p className="content-card-title">{content.title}</p>
        <p className="content-card-meta">
          {content.releaseYear} · {content.type === 'series' ? 'Series' : 'Movie'}
          {content.rating ? ` · ★ ${content.rating}` : ''}
        </p>
      </div>
    </Link>
  );
}
