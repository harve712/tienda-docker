import { IndexRoutes } from './routes';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { auth } = useAuth();

  if (auth === undefined) return null;

  return <IndexRoutes />;
}
