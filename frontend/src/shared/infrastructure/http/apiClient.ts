import { getAuthToken } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const isFormData = init?.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {})
    },
    ...init
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Error inesperado' }));
    throw new Error(body.message || 'Error de red');
  }

  return response.json() as Promise<T>;
}
