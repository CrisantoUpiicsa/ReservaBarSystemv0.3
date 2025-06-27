import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ¡Asegúrate de importar useMutation y useQueryClient!
import { apiRequest } from "@/lib/queryClient"; // Importa apiRequest desde queryClient
import type { Reservation, InsertReservation } from "@shared/schema"; // Asegúrate de importar InsertReservation si no lo haces ya

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

// <<< --- AÑADE ESTA FUNCIÓN useCreateReservation --- >>>
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservation: InsertReservation) => {
      // apiRequest ya utiliza API_BASE_URL internamente gracias a tu cambio en queryClient.ts
      await apiRequest("POST", "/api/reservations", reservation);
    },
    onSuccess: () => {
      // Invalida las queries para que se recarguen los datos actualizados de reservas y quizás el dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] }); // Añadido por si afecta al dashboard
    },
  });
}

// Opcional: Si necesitas un hook para eliminar (DELETE) reservas, también lo agregarías aquí.
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