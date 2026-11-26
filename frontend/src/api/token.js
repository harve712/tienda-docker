const API_URL = import.meta.env.VITE_BASE_API_URL;
const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_ITEM_NAME;

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

async function parseError(response, fallback) {
  let message = fallback;
  try {
    const data = await response.json();
    if (data && typeof data === 'object') {
      const messages = Object.values(data).flatMap((value) =>
        Array.isArray(value) ? value : [value]
      );
      if (messages.length) message = messages.join(' ');
    }
  } catch {
    // respuesta sin cuerpo JSON
  }
  const error = new Error(message);
  error.status = response.status;
  return error;
}

export async function getTokenPair(email, password) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  if (!response.ok) {
    throw await parseError(response, 'Usuario o contraseña incorrectos');
  }
  return response.json();
}
