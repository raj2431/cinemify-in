import { useEffect, useState } from 'react';
import api from '../api/axios';
import ContentCard from '../components/ContentCard';

export default function MyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/watchlist').then((res) => setItems(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="browse-page">
      <h1>My List</h1>
      {loading ? (
        <p>Loading...</p>
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
