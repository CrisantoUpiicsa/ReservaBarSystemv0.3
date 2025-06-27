import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; // Esta importación ya es buena
import type { InventoryItem, InsertInventoryItem } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Asegúrate de que esta línea esté aquí

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      // Modificación aquí: Se añade API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/inventory`);
      if (!response.ok) throw new Error("Failed to fetch inventory items");
      return response.json();
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí, apiRequest ya fue modificado en queryClient.ts
    mutationFn: async (item: InsertInventoryItem) => {
      await apiRequest("POST", "/api/inventory", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertInventoryItem> }) => {
      await apiRequest("PATCH", `${API_BASE_URL}/api/inventory/${id}`, updates); // Aunque apiRequest ya lo añade, aquí podrías forzarlo o confiar en apiRequest
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `${API_BASE_URL}/api/inventory/${id}`); // Idem comentario anterior
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}