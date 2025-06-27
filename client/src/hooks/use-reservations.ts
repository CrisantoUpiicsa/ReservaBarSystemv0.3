import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@shared/schema";

// Asegúrate de que esta línea ya esté en tu archivo
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
      // Modificación aquí: Se añade API_BASE_URL al inicio de la URL
      const url = `${API_BASE_URL}/api/reservations${queryParams.toString() ? `?${queryParams}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch reservations");
      return response.json();
    },
  });
}