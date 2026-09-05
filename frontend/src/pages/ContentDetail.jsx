import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ContentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/content/${id}`).then((res) => {
      setContent(res.data);
      const defaultUrl = res.data.type === 'movie'
        ? res.data.videoUrl
        : res.data.episodes?.[0]?.videoUrl;
      setActiveVideoUrl(defaultUrl || null);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get('/watchlist').then((res) => {
      setInWatchlist(res.data.some((c) => String(c.id) === String(id)));
    }).catch(console.error);
  }, [user, id]);

  const toggleWatchlist = async () => {
    setError('');
    try {
      if (inWatchlist) {
        await api.delete(`/watchlist/${id}`);
        setInWatchlist(false);
      } else {
        await api.post(`/watchlist/${id}`);
        setInWatchlist(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (!content) return <div className="page-loading">Loading...</div>;

  return (
    <div className="detail-page">
      {activeVideoUrl ? (
        <video key={activeVideoUrl} className="video-player" controls autoPlay src={activeVideoUrl} poster={content.bannerUrl} />
      ) : (
        <div className="video-placeholder">No video available yet.</div>
      )}

      <div className="detail-info">
        <h1>{content.title}</h1>
        <p className="detail-meta">
          {content.releaseYear} · {content.type === 'series' ? 'Series' : `${content.durationMinutes || '?'} min`} · ★ {content.rating}
        </p>
        <p className="detail-genres">
          {content.genres?.map((g) => g.name).join(', ')}
        </p>
        <p className="detail-description">{content.description}</p>

        {user && (
          <button className="btn-secondary" onClick={toggleWatchlist}>
            {inWatchlist ? '✓ In My List' : '+ Add to My List'}
          </button>
        )}
        {error && <p className="form-error">{error}</p>}
      </div>

      {content.type === 'series' && content.episodes?.length > 0 && (
        <div className="episodes-list">
          <h2>Episodes</h2>
          {content.episodes.map((ep) => (
            <button
              key={ep.id}
              className={`episode-row ${activeVideoUrl === ep.videoUrl ? 'active' : ''}`}
              onClick={() => setActiveVideoUrl(ep.videoUrl)}
            >
              <span className="episode-number">S{ep.season}E{ep.episodeNumber}</span>
              <span className="episode-title">{ep.title}</span>
              <span className="episode-duration">{ep.durationMinutes ? `${ep.durationMinutes} min` : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
