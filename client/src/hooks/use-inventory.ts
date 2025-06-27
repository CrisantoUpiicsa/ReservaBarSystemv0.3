import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { InventoryItem, InsertInventoryItem } from "@shared/schema";

// Eliminado: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ya no es necesario aquí

export function useInventoryItems() {
  return useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
    queryFn: async () => {
      // Modificación aquí: Usar getQueryFn que ya está configurado en queryClient
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory`); // Re-agregado si se necesita fetch directo
      if (!response.ok) throw new Error("Failed to fetch inventory items");
      return response.json();
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertInventoryItem) => {
      await apiRequest("POST", "/api/inventory", item); // Correcto, apiRequest ya añade la base URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertInventoryItem> }) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("PATCH", `/api/inventory/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });
}