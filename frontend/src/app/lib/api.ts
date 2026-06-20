export const API_BASE =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

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
