import { useEffect, useState } from 'react';
import api from '../api/axios';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import { SkeletonHero, SkeletonRow } from '../components/Skeleton';
import { useProfile } from '../context/ProfileContext';

export default function Home() {
  const { activeProfile } = useProfile();
  const [featured, setFeatured] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [genreRows, setGenreRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const requests = [
        api.get('/content', { params: { featured: true, limit: 5 } }),
        api.get('/content', { params: { type: 'movie', limit: 12 } }),
        api.get('/content', { params: { type: 'series', limit: 12 } }),
        api.get('/genres'),
      ];
      if (activeProfile) {
        requests.push(api.get('/progress', { params: { profileId: activeProfile.id } }));
      }

      const [featuredRes, moviesRes, seriesRes, genresRes, progressRes] = await Promise.all(requests);

      setFeatured(featuredRes.data.items[0] || null);
      setMovies(moviesRes.data.items);
      setSeries(seriesRes.data.items);
      setContinueWatching(progressRes?.data || []);

      const rows = await Promise.all(
        genresRes.data.slice(0, 4).map(async (g) => {
          const res = await api.get('/content', { params: { genre: g.name, limit: 12 } });
          return { genre: g.name, items: res.data.items };
        })
      );
      setGenreRows(rows);
    };
    load().catch(console.error).finally(() => setLoading(false));
  }, [activeProfile]);

  if (loading) {
    return (
      <div>
        <SkeletonHero />
        <div className="rows-container">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroBanner content={featured} />
      <div className="rows-container">
        <ContentRow title="Continue Watching" items={continueWatching} />
        <ContentRow title="Popular Movies" items={movies} />
        <ContentRow title="Popular Series" items={series} />
        {genreRows.map((row) => (
          <ContentRow key={row.genre} title={row.genre} items={row.items} />
        ))}
      </div>
    </div>
  );
}
