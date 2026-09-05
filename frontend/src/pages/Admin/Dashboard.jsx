import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/content', { params: { limit: 100 } })
      .then((res) => setItems(res.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this title?')) return;
    await api.delete(`/content/${id}`);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin · Content</h1>
        <Link to="/admin/new" className="btn-primary">+ Add Title</Link>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.type}</td>
                <td>{item.releaseYear}</td>
                <td>{item.rating}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
                <td className="admin-actions">
                  <Link to={`/admin/edit/${item.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
