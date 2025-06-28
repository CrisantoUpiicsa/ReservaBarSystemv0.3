// client/src/lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// *** URL BASE QUEMADA (TEMPORAL) ***
// Asegúrate de que esta URL sea la correcta y NO termine con una barra si luego vas a añadir rutas como "/users/"
const API_BASE_URL = 'https://reservabarapinew-f8dhd6eufme8fjfu.mexicocentral-01.azurewebsites.net';

console.log("DEBUG: API_BASE_URL en queryClient (DESPUÉS DE QUEMARLA):", API_BASE_URL);

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string, // Esta 'url' es la parte variable (ej. "/api/user", "/api/register")
  data?: unknown | undefined,
): Promise<Response> {
  let adjustedUrl = url;

  // --- AJUSTE DE RUTAS PARA apiRequest (POST, PUT, DELETE) ---
  if (url === "/api/register") { // Si el frontend pide /api/register
    adjustedUrl = "/users/"; // El backend espera POST /users/ (para create_user)
  }
  // Si tu frontend tiene más rutas que envían datos y necesitan ajuste (ej. PUT /api/profile -> PUT /users/{id}),
  // deberías añadirlas aquí con un `else if`.

  const res = await fetch(`${API_BASE_URL}${adjustedUrl}`, { // Usa adjustedUrl
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let fullUrl = `${API_BASE_URL}${queryKey[0] as string}`; // queryKey[0] es la ruta inicial (ej. "/api/user")

    // --- AJUSTE DE RUTAS PARA getQueryFn (GET) ---
    if (queryKey[0] === "/api/user") { // Si el frontend pide GET /api/user
      fullUrl = `${API_BASE_URL}/users/me/`; // El backend espera GET /users/me/ (para read_users_me)
    }
    // Si tu frontend tiene más rutas de GET que necesitan ajuste, añádelas aquí con un `else if`.
    // Por ejemplo, si tuvieras GET /api/products y el backend es /items/, lo ajustarías aquí.

    const res = await fetch(fullUrl, { // Usa fullUrl (ya ajustada)
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});