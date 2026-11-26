import { getToken } from './token';

const API_URL = import.meta.env.VITE_BASE_API_URL;

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

export async function registerUser({ username, email, password }) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  if (!response.ok) {
    throw await parseError(response, 'No se pudo completar el registro');
  }
  return response.json();
}

export async function getMe() {
  let response;
  try {
    response = await fetch(`${API_URL}/api/v1/auth/me/`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor');
  }
  if (!response.ok) {
    throw await parseError(response, 'No se pudo obtener el usuario');
  }
  return response.json();
}
