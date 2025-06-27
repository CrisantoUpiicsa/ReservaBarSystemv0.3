import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Table, InsertTable } from "@shared/schema";

// Eliminado: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ya no es necesario aquí

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["/api/tables"],
    queryFn: async () => {
      // Modificación aquí: Usar getQueryFn que ya está configurado en queryClient
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tables`); // Re-agregado si se necesita fetch directo
      if (!response.ok) throw new Error("Failed to fetch tables");
      return response.json();
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (table: InsertTable) => {
      await apiRequest("POST", "/api/tables", table); // Correcto, apiRequest ya añade la base URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("PATCH", `/api/tables/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}