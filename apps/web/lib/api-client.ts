const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export class ApiError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface ApiOptions extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export async function apiClient<T>(
  endpoint: string,
  { body, ...customConfig }: ApiOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    credentials: "include",
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}/api/v1${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorData: any;

    try {
      const text = await response.text();
      try {
        errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = text || errorMessage;
      }
    } catch {
      // Fallback if text() fails
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", body }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", body }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch: <T>(endpoint: string, body: any, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", body }),
  delete: <T>(endpoint: string, options?: ApiOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
