import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { SkeletonDetail } from '../components/Skeleton';
import VideoPlayer from '../components/VideoPlayer';
import ReviewsSection from '../components/ReviewsSection';

export default function ContentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { activeProfile } = useProfile();
  const [content, setContent] = useState(null);
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [resumeTime, setResumeTime] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/content/${id}`).then((res) => {
      setContent(res.data);
      const firstEpisode = res.data.type === 'series' ? res.data.episodes?.[0] || null : null;
      setActiveEpisode(firstEpisode);
    }).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!activeProfile) return;
    api.get('/watchlist', { params: { profileId: activeProfile.id } }).then((res) => {
      setInWatchlist(res.data.some((c) => String(c.id) === String(id)));
    }).catch(console.error);
  }, [activeProfile, id]);

  useEffect(() => {
    if (!activeProfile || !content) return;
    const episodeId = activeEpisode?.id;
    api.get(`/progress/${id}`, { params: { profileId: activeProfile.id, episodeId } })
      .then((res) => setResumeTime(res.data?.positionSeconds || 0))
      .catch(() => setResumeTime(0));
  }, [activeProfile, content, id, activeEpisode]);

  const saveProgress = useCallback((positionSeconds, durationSeconds) => {
    if (!activeProfile || !positionSeconds) return;
    api.put('/progress', {
      profileId: activeProfile.id,
      contentId: Number(id),
      episodeId: activeEpisode?.id || null,
      positionSeconds: Math.floor(positionSeconds),
      durationSeconds: durationSeconds ? Math.floor(durationSeconds) : null,
    }).catch(() => {});
  }, [activeProfile, id, activeEpisode]);

  const toggleWatchlist = async () => {
    if (!activeProfile) return;
    setError('');
    try {
      if (inWatchlist) {
        await api.delete(`/watchlist/${id}`, { params: { profileId: activeProfile.id } });
        setInWatchlist(false);
      } else {
        await api.post(`/watchlist/${id}`, { profileId: activeProfile.id });
        setInWatchlist(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (!content) return <SkeletonDetail />;

  const activeVideoUrl = content.type === 'movie' ? content.videoUrl : activeEpisode?.videoUrl;

  return (
    <div className="detail-page">
      {activeVideoUrl ? (
        <VideoPlayer
          key={activeVideoUrl}
          className="video-player"
          src={activeVideoUrl}
          poster={content.bannerUrl}
          initialTime={resumeTime}
          onProgress={saveProgress}
        />
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
              className={`episode-row ${activeEpisode?.id === ep.id ? 'active' : ''}`}
              onClick={() => setActiveEpisode(ep)}
            >
              <span className="episode-number">S{ep.season}E{ep.episodeNumber}</span>
              <span className="episode-title">{ep.title}</span>
              <span className="episode-duration">{ep.durationMinutes ? `${ep.durationMinutes} min` : ''}</span>
            </button>
          ))}
        </div>
      )}

      <div className="reviews-container">
        <ReviewsSection contentId={id} />
      </div>
    </div>
  );
}
