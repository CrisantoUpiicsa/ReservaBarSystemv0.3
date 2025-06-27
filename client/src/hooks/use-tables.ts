import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; // Esta importación ya es buena
import type { Table, InsertTable } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Asegúrate de que esta línea esté aquí

export function useTables() {
  return useQuery<Table[]>({
    queryKey: ["/api/tables"],
    queryFn: async () => {
      // Modificación aquí: Se añade API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/tables`);
      if (!response.ok) throw new Error("Failed to fetch tables");
      return response.json();
    },
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async (table: InsertTable) => {
      await apiRequest("POST", "/api/tables", table);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
    },
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PATCH", `${API_BASE_URL}/api/tables/${id}/status`, { status }); // Idem comentario anterior
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}