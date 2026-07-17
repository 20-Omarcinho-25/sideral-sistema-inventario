// La API se sirve en el mismo host desde el que se abrio el frontend:
//  - en la PC servidor  -> http://localhost:8000/api
//  - desde el celular    -> http://<IP-del-servidor>:8000/api
// Se puede sobreescribir con VITE_API_URL en frontend/.env
const defaultApiBase =
  typeof window !== 'undefined'
    ? (window.location.port === '5173'
        ? 'http://localhost:8000/api'
        : `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}/aiready/backend/public/api`)
    : 'http://localhost:8000/api';

export const API_BASE = import.meta.env.VITE_API_URL ?? defaultApiBase;

export function getAuthHeaders(includeJson = true): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  const token = localStorage.getItem('token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const hasBody = options.body !== undefined && options.body !== null;
  const headers = {
    ...getAuthHeaders(hasBody),
    ...(options.headers as Record<string, string> | undefined),
  };

  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
