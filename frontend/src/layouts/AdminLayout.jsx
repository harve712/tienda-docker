import { Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useAuth } from '../hooks/useAuth';

export function AdminLayout({ children }) {
  const { auth } = useAuth();

  if (auth === undefined) return null;
  if (!auth) return <Navigate to="/login" replace />;

  return <Container className="page-container">{children}</Container>;
}
