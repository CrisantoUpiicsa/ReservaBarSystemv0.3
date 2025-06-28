// client/src/lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// *** CAMBIO CRÍTICO Y TEMPORAL: QUEMAR LA URL DIRECTAMENTE ***
// Reemplaza 'https://TU_URL_DE_API_COMPLETA_AQUI/' con la URL REAL de tu backend.
// Por ejemplo: 'https://reservabarapinew-f8dhd6eufme8fjfu.mexicocentral-01.azurewebsites.net/'
const API_BASE_URL = 'https://reservabarapinew-f8dhd6eufme8fjfu.mexicocentral-01.azurewebsites.net/'; // ¡PON TU URL AQUÍ!

console.log("DEBUG: API_BASE_URL en queryClient (DESPUÉS DE QUEMARLA):", API_BASE_URL);

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
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
    const fullUrl = `${API_BASE_URL}${queryKey[0] as string}`;
    const res = await fetch(fullUrl, {
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