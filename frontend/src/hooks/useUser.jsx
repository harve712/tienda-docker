import { useAuth } from './useAuth';

export function useUser() {
  const { auth } = useAuth();
  return auth;
}
