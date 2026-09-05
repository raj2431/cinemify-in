import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const ProfileContext = createContext(null);

const activeProfileKey = (userId) => `cinemify_active_profile_${userId}`;

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfileState] = useState(null);
  const [loading, setLoading] = useState(true);

  const setActiveProfile = useCallback((profile) => {
    setActiveProfileState(profile);
    if (user && profile) {
      localStorage.setItem(activeProfileKey(user.id), String(profile.id));
    }
  }, [user]);

  const refreshProfiles = useCallback(async () => {
    if (!user) {
      setProfiles([]);
      setActiveProfileState(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get('/profiles');
      setProfiles(data);
      const savedId = localStorage.getItem(activeProfileKey(user.id));
      const match = data.find((p) => String(p.id) === savedId);
      setActiveProfileState(match || data[0] || null);
    } catch {
      setProfiles([]);
      setActiveProfileState(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  return (
    <ProfileContext.Provider value={{ profiles, activeProfile, setActiveProfile, loading, refreshProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
