"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getReserveForEdit } from "@/services/querys/user-time-sharing-reserves-edit";
import LoadingData from "@/components/LoadingData";
import { toast } from "react-toastify";
import { Box, Typography } from "@mui/joy";

interface EditReservePageProps {
  params: {
    reserveNumber: string;
  };
}

export default function EditReservePage({ params }: EditReservePageProps) {
  const router = useRouter();
  const reserveNumber = parseInt(params.reserveNumber);
  
  console.log("EditReservePage - reserveNumber:", reserveNumber);
  console.log("EditReservePage - params:", params);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getReserveForEdit", reserveNumber],
    queryFn: () => getReserveForEdit(reserveNumber),
    enabled: !!reserveNumber && !isNaN(reserveNumber),
    retry: 1,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("Erro ao buscar dados da reserva:", error);
      const axiosError = error as any;
      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao carregar dados da reserva");
      }
    }
  }, [isError, error]);

  if (isError) {
    toast.error("Erro ao carregar dados da reserva");
    router.push("/dashboard/user-time-sharing-reserves");
    return null;
  }

  if (isLoading) {
    return <LoadingData />;
  }

  if (!data?.success || !data?.data?.length) {
    toast.error("Reserva não encontrada");
    router.push("/dashboard/user-time-sharing-reserves");
    return null;
  }

  const reserve = data.data[0];

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Editar Reserva #{reserveNumber}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography level="body-md">
          <strong>Hotel:</strong> {reserve.nomeHotel}
        </Typography>
        <Typography level="body-md">
          <strong>Cliente:</strong> {reserve.clienteReservanteNome}
        </Typography>
        <Typography level="body-md">
          <strong>Status:</strong> {reserve.statusReserva}
        </Typography>
        <Typography level="body-md">
          <strong>Check-in:</strong> {new Date(reserve.dataChegadaPrevista).toLocaleDateString('pt-BR')}
        </Typography>
        <Typography level="body-md">
          <strong>Check-out:</strong> {new Date(reserve.dataPartidaPrevista).toLocaleDateString('pt-BR')}
        </Typography>
        <Typography level="body-md">
          <strong>Adultos:</strong> {reserve.adultos}
        </Typography>
        <Typography level="body-md">
          <strong>Crianças 1:</strong> {reserve.criancas1}
        </Typography>
        <Typography level="body-md">
          <strong>Crianças 2:</strong> {reserve.criancas2}
        </Typography>
      </Box>

      {reserve.hospedes && reserve.hospedes.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography level="h3" sx={{ mb: 2 }}>
            Hóspedes
          </Typography>
          {reserve.hospedes.map((hospede, index) => (
            <Box key={hospede.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography level="body-md">
                <strong>Nome:</strong> {hospede.nome}
              </Typography>
              <Typography level="body-md">
                <strong>Documento:</strong> {hospede.documento}
              </Typography>
              <Typography level="body-md">
                <strong>Email:</strong> {hospede.email}
              </Typography>
              <Typography level="body-md">
                <strong>Telefone:</strong> {hospede.telefone}
              </Typography>
              <Typography level="body-md">
                <strong>Principal:</strong> {hospede.principal === 'S' ? 'Sim' : 'Não'}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {reserve.observacoes && (
        <Box sx={{ mt: 3 }}>
          <Typography level="h3" sx={{ mb: 1 }}>
            Observações
          </Typography>
          <Typography level="body-md">
            {reserve.observacoes}
          </Typography>
        </Box>
      )}
    </Box>
  );
}