import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Reservation, InsertReservation } from "@shared/schema"; // Asegúrate de que InsertReservation esté importado

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const url = `${API_BASE_URL}/api/reservations${queryParams.toString() ? `?${queryParams}` : ""}`;
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
      await apiRequest("POST", "/api/reservations", reservation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });
}

// <<< --- AÑADE ESTA FUNCIÓN useUpdateReservationStatus --- >>>
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      // Asumiendo que la API espera un PATCH a /api/reservations/{id}/status
      await apiRequest("PATCH", `${API_BASE_URL}/api/reservations/${id}/status`, { status });
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
            await apiRequest("DELETE", `${API_BASE_URL}/api/reservations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
        },
    });
}