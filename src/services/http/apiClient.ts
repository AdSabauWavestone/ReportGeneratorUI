import { ApiError } from './apiError';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : response.statusText || 'Request failed';

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, signal } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  });

  return parseResponse<T>(response);
}

export const apiClient = {
  get: <T>(endpoint: string, signal?: AbortSignal) => request<T>(endpoint, { method: 'GET', signal }),
  post: <T>(endpoint: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'POST', body, signal }),
  put: <T>(endpoint: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PUT', body, signal }),
  patch: <T>(endpoint: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(endpoint, { method: 'PATCH', body, signal }),
  delete: <T>(endpoint: string, signal?: AbortSignal) => request<T>(endpoint, { method: 'DELETE', signal }),
};
