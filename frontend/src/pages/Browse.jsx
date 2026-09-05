import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ContentCard from '../components/ContentCard';
import { SkeletonGrid } from '../components/Skeleton';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || '';
  const genre = searchParams.get('genre') || '';

  useEffect(() => {
    api.get('/genres').then((res) => setGenres(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/content', { params: { search: search || undefined, type: type || undefined, genre: genre || undefined, limit: 48 } })
      .then((res) => setItems(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, type, genre]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="browse-page">
      <h1>Browse</h1>
      <div className="browse-filters">
        <select value={type} onChange={(e) => updateParam('type', e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
        </select>
        <select value={genre} onChange={(e) => updateParam('genre', e.target.value)}>
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
        </select>
      </div>
      {loading ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <p>No titles found.</p>
      ) : (
        <div className="grid">
          {items.map((item) => <ContentCard key={item.id} content={item} />)}
        </div>
      )}
    </div>
  );
}
