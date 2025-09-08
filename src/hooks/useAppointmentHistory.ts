import { useEffect, useState } from "react";

import { AppointmentHistory } from "@/utils/types/multiownership/appointments";
import { getAppointmentHistory } from "@/services/querys/multiownership/appointments";

export const useAppointmentHistory = (appointmentId: number) => {
  const [history, setHistory] = useState<AppointmentHistory[] | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentHistory(appointmentId);
        setHistory(data);
      } catch (err) {
        setError("Erro ao buscar histórico do agendamento");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchHistory();
    }
  }, [appointmentId]);

  return { history, loading, error };
};
