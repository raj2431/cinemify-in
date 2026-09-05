import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="skeleton skeleton-line page-loading-bar" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="skeleton skeleton-line page-loading-bar" />;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
