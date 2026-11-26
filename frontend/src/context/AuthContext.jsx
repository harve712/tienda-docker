import { createContext, useCallback, useEffect, useState } from 'react';
import { getToken, removeToken, saveToken } from '../api/token';
import { getMe } from '../api/user';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(undefined);

  useEffect(() => {
    if (!getToken()) {
      setAuth(null);
      return;
    }
    getMe()
      .then((user) => setAuth(user))
      .catch((error) => {
        if (error.status === 401) removeToken();
        setAuth(null);
      });
  }, []);

  const login = useCallback(async (accessToken) => {
    saveToken(accessToken);
    try {
      const user = await getMe();
      setAuth(user);
    } catch (error) {
      if (error.status === 401) removeToken();
      setAuth(null);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
