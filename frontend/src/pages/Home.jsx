import { useEffect, useState } from 'react';
import api from '../api/axios';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [genreRows, setGenreRows] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [featuredRes, moviesRes, seriesRes, genresRes] = await Promise.all([
        api.get('/content', { params: { featured: true, limit: 5 } }),
        api.get('/content', { params: { type: 'movie', limit: 12 } }),
        api.get('/content', { params: { type: 'series', limit: 12 } }),
        api.get('/genres'),
      ]);

      setFeatured(featuredRes.data.items[0] || null);
      setMovies(moviesRes.data.items);
      setSeries(seriesRes.data.items);

      const rows = await Promise.all(
        genresRes.data.slice(0, 4).map(async (g) => {
          const res = await api.get('/content', { params: { genre: g.name, limit: 12 } });
          return { genre: g.name, items: res.data.items };
        })
      );
      setGenreRows(rows);
    };
    load().catch(console.error);
  }, []);

  return (
    <div>
      <HeroBanner content={featured} />
      <div className="rows-container">
        <ContentRow title="Popular Movies" items={movies} />
        <ContentRow title="Popular Series" items={series} />
        {genreRows.map((row) => (
          <ContentRow key={row.genre} title={row.genre} items={row.items} />
        ))}
      </div>
    </div>
  );
}
