import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query ? `/browse?search=${encodeURIComponent(query)}` : '/browse');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">CINEMIFY</Link>
        <Link to="/browse?type=movie">Movies</Link>
        <Link to="/browse?type=series">Series</Link>
        {user && <Link to="/my-list">My List</Link>}
        {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      </div>
      <div className="navbar-right">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        {user ? (
          <div className="user-menu">
            <span>{user.name}</span>
            <button onClick={() => { logout(); navigate('/'); }}>Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="btn-signin">Sign In</Link>
        )}
      </div>
    </header>
  );
}
