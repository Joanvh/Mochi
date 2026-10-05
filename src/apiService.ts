import type { ApiError } from "./apiTypes";

// Vite inyecta las variables de entorno a través de import.meta.env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiClientError extends Error {
  public status: number;
  public detail: any;

  constructor(status: number, detail: any) {
    super(`API Error ${status}: ${JSON.stringify(detail)}`);
    this.status = status;
    this.detail = detail;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Función interna que procesa la petición, los parámetros y los errores.
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  const url = new URL(`${BASE_URL}${endpoint}`);

  // Añadir query params si existen
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    let errorDetail: string | Record<string, any> = response.statusText;
    try {
      const errorData = (await response.json()) as ApiError;
      errorDetail = errorData.detail || errorData;
    } catch {
      // Fallback si la respuesta no es un JSON válido
    }
    throw new ApiClientError(response.status, errorDetail);
  }

  // Si la API devuelve un 204 No Content (ej: tras un DELETE), evitamos parsear JSON
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Cliente centralizado para consumir desde los servicios y componentes.
 * Soporta cancelación pasando { signal: abortController.signal } en las opciones.
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      ...(body && { body: JSON.stringify(body) }),
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PATCH",
      ...(body && { body: JSON.stringify(body) }),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};
