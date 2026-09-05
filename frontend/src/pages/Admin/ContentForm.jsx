import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const emptyForm = {
  title: '', description: '', type: 'movie', posterUrl: '', bannerUrl: '',
  videoUrl: '', trailerUrl: '', releaseYear: '', durationMinutes: '', rating: '',
  featured: false, genreIds: [],
};

export default function ContentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [genres, setGenres] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [newEpisode, setNewEpisode] = useState({ season: 1, episodeNumber: 1, title: '', videoUrl: '', durationMinutes: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/genres').then((res) => setGenres(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/content/${id}`).then((res) => {
      const c = res.data;
      setForm({
        title: c.title, description: c.description || '', type: c.type,
        posterUrl: c.posterUrl || '', bannerUrl: c.bannerUrl || '', videoUrl: c.videoUrl || '',
        trailerUrl: c.trailerUrl || '', releaseYear: c.releaseYear || '', durationMinutes: c.durationMinutes || '',
        rating: c.rating || '', featured: c.featured, genreIds: c.genres?.map((g) => g.id) || [],
      });
      setEpisodes(c.episodes || []);
    }).catch(console.error);
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleGenre = (genreId) => {
    setForm((f) => ({
      ...f,
      genreIds: f.genreIds.includes(genreId) ? f.genreIds.filter((g) => g !== genreId) : [...f.genreIds, genreId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        releaseYear: form.releaseYear ? Number(form.releaseYear) : null,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        rating: form.rating ? Number(form.rating) : 0,
      };
      if (isEdit) {
        await api.put(`/content/${id}`, payload);
      } else {
        const res = await api.post('/content', payload);
        if (form.type === 'series') {
          navigate(`/admin/edit/${res.data.id}`);
          return;
        }
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addEpisode = async () => {
    if (!newEpisode.title || !newEpisode.videoUrl) return;
    const res = await api.post(`/content/${id}/episodes`, {
      ...newEpisode,
      season: Number(newEpisode.season),
      episodeNumber: Number(newEpisode.episodeNumber),
      durationMinutes: newEpisode.durationMinutes ? Number(newEpisode.durationMinutes) : null,
    });
    setEpisodes((eps) => [...eps, res.data]);
    setNewEpisode({ season: 1, episodeNumber: newEpisode.episodeNumber + 1, title: '', videoUrl: '', durationMinutes: '' });
  };

  const deleteEpisode = async (episodeId) => {
    await api.delete(`/content/${id}/episodes/${episodeId}`);
    setEpisodes((eps) => eps.filter((ep) => ep.id !== episodeId));
  };

  return (
    <div className="admin-page">
      <h1>{isEdit ? 'Edit Title' : 'Add Title'}</h1>
      {error && <p className="form-error">{error}</p>}
      <form className="content-form" onSubmit={handleSubmit}>
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </label>
        <label>Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </label>
        <label>Poster URL
          <input name="posterUrl" value={form.posterUrl} onChange={handleChange} />
        </label>
        <label>Banner URL
          <input name="bannerUrl" value={form.bannerUrl} onChange={handleChange} />
        </label>
        {form.type === 'movie' && (
          <label>Video URL
            <input name="videoUrl" value={form.videoUrl} onChange={handleChange} />
          </label>
        )}
        <label>Trailer URL
          <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange} />
        </label>
        <label>Release Year
          <input name="releaseYear" type="number" value={form.releaseYear} onChange={handleChange} />
        </label>
        {form.type === 'movie' && (
          <label>Duration (minutes)
            <input name="durationMinutes" type="number" value={form.durationMinutes} onChange={handleChange} />
          </label>
        )}
        <label>Rating
          <input name="rating" type="number" step="0.1" min="0" max="10" value={form.rating} onChange={handleChange} />
        </label>
        <label className="checkbox-label">
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
          Featured (shown in hero banner)
        </label>

        <fieldset>
          <legend>Genres</legend>
          <div className="genre-checkboxes">
            {genres.map((g) => (
              <label key={g.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.genreIds.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                />
                {g.name}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Title'}
        </button>
      </form>

      {isEdit && form.type === 'series' && (
        <div className="episodes-admin">
          <h2>Episodes</h2>
          {episodes.map((ep) => (
            <div key={ep.id} className="episode-row">
              <span>S{ep.season}E{ep.episodeNumber} — {ep.title}</span>
              <button onClick={() => deleteEpisode(ep.id)}>Delete</button>
            </div>
          ))}
          <div className="add-episode-form">
            <input type="number" placeholder="Season" value={newEpisode.season} onChange={(e) => setNewEpisode({ ...newEpisode, season: e.target.value })} />
            <input type="number" placeholder="Episode #" value={newEpisode.episodeNumber} onChange={(e) => setNewEpisode({ ...newEpisode, episodeNumber: e.target.value })} />
            <input type="text" placeholder="Episode title" value={newEpisode.title} onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })} />
            <input type="text" placeholder="Video URL" value={newEpisode.videoUrl} onChange={(e) => setNewEpisode({ ...newEpisode, videoUrl: e.target.value })} />
            <input type="number" placeholder="Duration (min)" value={newEpisode.durationMinutes} onChange={(e) => setNewEpisode({ ...newEpisode, durationMinutes: e.target.value })} />
            <button type="button" onClick={addEpisode}>+ Add Episode</button>
          </div>
        </div>
      )}
    </div>
  );
}
