import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }
  return children;
}