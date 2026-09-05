import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useProfile } from '../context/ProfileContext';

const COLORS = ['#e50914', '#0071eb', '#00a86b', '#f5a623', '#8e44ad', '#e67e22'];

export default function ProfileSwitcher() {
  const { profiles, setActiveProfile, refreshProfiles } = useProfile();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  const choose = (profile) => {
    setActiveProfile(profile);
    navigate('/');
  };

  const createProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/profiles', { name, avatarColor: color });
      await refreshProfiles();
      setCreating(false);
      setName('');
      choose(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
    }
  };

  const deleteProfile = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this profile? Its watchlist and watch history will be removed.')) return;
    try {
      await api.delete(`/profiles/${id}`);
      await refreshProfiles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete profile');
    }
  };

  return (
    <div className="profile-switcher">
      <h1>Who's watching?</h1>
      {error && <p className="form-error">{error}</p>}
      <div className="profile-grid">
        {profiles.map((p) => (
          <div key={p.id} className="profile-tile" onClick={() => choose(p)}>
            <div className="profile-avatar" style={{ background: p.avatarColor }}>
              {p.name.charAt(0).toUpperCase()}
            </div>
            <span>{p.name}</span>
            {profiles.length > 1 && (
              <button className="profile-delete" onClick={(e) => deleteProfile(e, p.id)}>Delete</button>
            )}
          </div>
        ))}

        {profiles.length < 5 && (
          creating ? (
            <form className="profile-tile profile-create-form" onSubmit={createProfile}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
              <div className="color-picker">
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className={`color-swatch ${color === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
              <button type="submit" className="btn-primary">Create</button>
            </form>
          ) : (
            <div className="profile-tile profile-add" onClick={() => setCreating(true)}>
              <div className="profile-avatar profile-avatar-add">+</div>
              <span>Add Profile</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
