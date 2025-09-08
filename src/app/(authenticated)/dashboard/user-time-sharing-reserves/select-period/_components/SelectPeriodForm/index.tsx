"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Grid, Stack, Typography, Box, Card, CardContent } from "@mui/joy";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { AvailabilityItem } from "@/services/querys/user-time-sharing-availability";
import TextareaField from "@/components/TextareaField";
type SelectPeriodFormProps = {
  availability: AvailabilityItem;
};

type ReservationFormData = {
  observacoes?: string;
  confirmacao: boolean;
};

export default function SelectPeriodForm({ availability }: SelectPeriodFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ReservationFormData>({
    defaultValues: {
      observacoes: "",
      confirmacao: false,
    },
  });

  const {
    handleSubmit,
  } = form;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  const handleConfirmReservation = async (data: ReservationFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implementar chamada para API de confirmação de reserva
      console.log("Confirmando reserva:", {
        availability,
        ...data,
      });
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirecionar de volta para a página de reservas
      router.push("/dashboard/user-time-sharing-reserves");
    } catch (error) {
      console.error("Erro ao confirmar reserva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography level="h2" sx={{ mb: 3, textAlign: "center" }}>
        Confirmar Seleção de Período
      </Typography>

      {/* Card com informações da disponibilidade */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography level="h4" sx={{ mb: 2, color: "primary.500" }}>
            Detalhes do Período Selecionado
          </Typography>
          
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Hotel:
              </Typography>
              <Typography level="body-md">{availability.nomeHotel || 'N/A'}</Typography>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Tipo de Apartamento:
              </Typography>
              <Typography level="body-md">{availability.tipoApartamento || 'N/A'}</Typography>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Data de Início:
              </Typography>
              <Typography level="body-md">{availability.checkin ? formatDate(availability.checkin) : 'N/A'}</Typography>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Data de Fim:
              </Typography>
              <Typography level="body-md">{availability.checkout ? formatDate(availability.checkout) : 'N/A'}</Typography>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Pontos Necessários:
              </Typography>
              <Typography level="body-md" sx={{ color: "primary.500", fontWeight: "bold" }}>
                {availability.pontosNecessario?.toLocaleString() || 0} pontos
              </Typography>
            </Grid>
            
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                Número do Contrato:
              </Typography>
              <Typography level="body-md">{availability.numeroContrato || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Formulário de confirmação */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleConfirmReservation)}>
          <Stack spacing={3}>
            <TextareaField
              field="observacoes"
              label="Observações (Opcional)"
              required={false}
              minRows={3}
            />

            {/* Botões de ação */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                loading={isLoading}
                sx={{
                  backgroundColor: "primary.500",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "primary.600",
                  },
                }}
              >
                {isLoading ? "Confirmando..." : "Confirmar Reserva"}
              </Button>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
}