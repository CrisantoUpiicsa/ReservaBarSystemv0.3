import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Reservation, InsertReservation } from "@shared/schema";

// Eliminado: const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ya no es necesario aquí

export function useReservations(filters?: {
  date?: string;
  status?: string;
  tableId?: number;
}) {
  const queryParams = new URLSearchParams();
  if (filters?.date) queryParams.append("date", filters.date);
  if (filters?.status) queryParams.append("status", filters.status);
  if (filters?.tableId) queryParams.append("tableId", filters.tableId.toString());

  return useQuery<Reservation[]>({
    queryKey: ["/api/reservations", filters],
    queryFn: async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/reservations${queryParams.toString() ? `?${queryParams}` : ""}`; // Re-agregado si se necesita fetch directo
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch reservations");
      return response.json();
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: InsertReservation) => {
      await apiRequest("POST", "/api/reservations", reservation); // Correcto, apiRequest ya añade la base URL
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
      await apiRequest("PATCH", `/api/reservations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] }); // Si aplica
    },
  });
}

export function useDeleteReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            // Corrección: apiRequest ya añade la base URL, solo pasa la URL relativa
            await apiRequest("DELETE", `/api/reservations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
        },
    });
}