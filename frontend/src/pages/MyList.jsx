import { useEffect, useState } from 'react';
import api from '../api/axios';
import ContentCard from '../components/ContentCard';
import { SkeletonGrid } from '../components/Skeleton';
import { useProfile } from '../context/ProfileContext';

export default function MyList() {
  const { activeProfile } = useProfile();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeProfile) return;
    setLoading(true);
    api.get('/watchlist', { params: { profileId: activeProfile.id } })
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeProfile]);

  return (
    <div className="browse-page">
      <h1>My List</h1>
      {loading ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <p>Your list is empty. Add titles from the browse page.</p>
      ) : (
        <div className="grid">
          {items.map((item) => <ContentCard key={item.id} content={item} />)}
        </div>
      )}
    </div>
  );
}
