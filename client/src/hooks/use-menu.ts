import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { MenuCategory, MenuItem, InsertMenuCategory, InsertMenuItem } from "@shared/schema";

// Eliminado: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ya no es necesario aquí

export function useMenuCategories() {
  return useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
    queryFn: async () => {
      // Modificación aquí: Usar getQueryFn que ya está configurado en queryClient
      // o hacer la llamada directamente usando la URL relativa
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/categories`); // Re-agregado si se necesita fetch directo
      if (!response.ok) throw new Error("Failed to fetch menu categories");
      return response.json();
    },
  });
}

export function useMenuItems(categoryId?: number) {
  const queryParams = categoryId ? `?categoryId=${categoryId}` : "";

  return useQuery<MenuItem[]>({
    queryKey: ["/api/menu/items", categoryId],
    queryFn: async () => {
      // Modificación aquí: Usar getQueryFn que ya está configurado en queryClient
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/menu/items${queryParams}`); // Re-agregado si se necesita fetch directo
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return response.json();
    },
  });
}

export function useCreateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: InsertMenuCategory) => {
      await apiRequest("POST", "/api/menu/categories", category); // Correcto, apiRequest ya añade la base URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertMenuItem) => {
      await apiRequest("POST", "/api/menu/items", item); // Correcto, apiRequest ya añade la base URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertMenuItem> }) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("PATCH", `/api/menu/items/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("DELETE", `/api/menu/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}