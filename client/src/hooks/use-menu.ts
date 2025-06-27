import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; // Esta importación ya es buena
import type { MenuCategory, MenuItem, InsertMenuCategory, InsertMenuItem } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Asegúrate de que esta línea esté aquí

export function useMenuCategories() {
  return useQuery<MenuCategory[]>({
    queryKey: ["/api/menu/categories"],
    queryFn: async () => {
      // Modificación aquí: Se añade API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/menu/categories`);
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
      // Modificación aquí: Se añade API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/menu/items${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return response.json();
    },
  });
}

export function useCreateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async (category: InsertMenuCategory) => {
      await apiRequest("POST", "/api/menu/categories", category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/categories"] });
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async (item: InsertMenuItem) => {
      await apiRequest("POST", "/api/menu/items", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<InsertMenuItem> }) => {
      await apiRequest("PATCH", `${API_BASE_URL}/api/menu/items/${id}`, updates); // Idem comentario anterior
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    // No se necesita cambio aquí
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `${API_BASE_URL}/api/menu/items/${id}`); // Idem comentario anterior
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu/items"] });
    },
  });
}