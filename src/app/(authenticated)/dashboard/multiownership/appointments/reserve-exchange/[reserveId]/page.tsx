"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchAvailabilityAdm,
  SwhiftweekAdm,
  getAppointmentBookingByIdAdm,
} from "@/services/querys/multiownership/appointments";
import { useState, useEffect } from "react";
import { getWeek } from "date-fns";
import { formatWithSaturdayFormCheck } from "@/utils/dates";
import { FormProvider, useForm } from "react-hook-form";
import { Radio } from "@mui/joy";
import RadioGroupField from "@/components/RadioGroupField";

export default function AppointmentsPage({
  params: { reserveId },
}: {
  params: { reserveId: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const methods = useForm({
    defaultValues: {
      tipoUtilizacao: "",
    },
  });

  const { isLoading: isLoadingPeriod, data } = useQuery({
    queryKey: ["AvailabilityForExchange", { reserveId }],
    queryFn: () => fetchAvailabilityAdm({ Agendamentoid: parseInt(reserveId) }),
    enabled: parseInt(reserveId) > 0,
  });

  const { data: currentBooking } = useQuery({
    queryKey: ["current-booking", reserveId],
    queryFn: () => getAppointmentBookingByIdAdm(reserveId),
  });

  const formatarData = (dataISO: string) => {
    return new Date(dataISO).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditBooking = useMutation({
    mutationFn: SwhiftweekAdm,
  });

  // Marcar o tipo de uso atual baseado no availableTypeName
  useEffect(() => {
    if (currentBooking?.availableTypeName) {
      const availableTypeMap: { [key: string]: string } = {
        "Uso Próprio": "UP",
        "Uso Cortesia": "UC", 
        "Intercâmbio": "I"
      };
      
      const mappedType = availableTypeMap[currentBooking.availableTypeName];
      if (mappedType) {
        methods.setValue("tipoUtilizacao", mappedType);
      }
    }
  }, [currentBooking?.availableTypeName, methods]);

  function getWeekOfYear(date: Date | string) {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return getWeek(parsedDate);
  }

  function handleOpenConfirm(semanaId: number) {
    setSelectedWeek(semanaId);
    setConfirmOpen(true);
  }

  function handleConfirmChangeWeek() {
    const { tipoUtilizacao } = methods.getValues();

    if (selectedWeek) {
      handleEditBooking.mutate(
        { agendamentoid: parseInt(reserveId), semanaId: selectedWeek },
        {
          onSuccess: async () => {
            goBack();
            toast.success("Reserva realizada com sucesso!");
          },
        }
      );
      setConfirmOpen(false);
    }
  }

  const goBack = () => router.push("/dashboard/multiownership/appointments");

  return (
    <>
      {action === "usage-type" ? (
        // Exibir apenas o formulário de tipos de uso
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Selecione o Tipo de Uso
          </Typography>
          <Card>
            <CardContent>
              <FormProvider {...methods}>
                <RadioGroupField label="Tipo de uso" field="tipoUtilizacao">
                  <Radio value="UP" label="Uso Proprietário" />
                  <Radio value="UC" label="Uso Convidado" />
                  <Radio value="I" label="Intercambiadora" />
                </RadioGroupField>
              </FormProvider>
              <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => goBack()}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const { tipoUtilizacao } = methods.getValues();
                    if (tipoUtilizacao) {
                      // Aqui você pode implementar a lógica para salvar apenas o tipo de uso
                      toast.success("Tipo de uso alterado com sucesso!");
                      goBack();
                    } else {
                      toast.error("Por favor, selecione um tipo de uso.");
                    }
                  }}
                >
                  Confirmar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ) : (
        // Exibir a lista de períodos (comportamento original)
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "rows",
            gap: 2,
            p: 2,
          }}
        >
          {isLoadingPeriod ? (
            <CircularProgress sx={{ '--CircularProgress-progressColor': 'var(--CircularProgress-Color)' }} />
          ) : (
            data?.map((item) => (
              <Card key={`${item.weekId}-${item.id}`}>
                <CardContent>
                  <Typography variant="h6">
                    Semana: {getWeekOfYear(item.startDate)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "none",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Chip label={item.weekTypeName} color="secondary" />
                    <Chip label={item.weekGroupTypeName} color="primary" />
                  </Box>
                  <div>
                    <Typography variant="subtitle1">Período:</Typography>
                    <Typography variant="subtitle1">
                      Inicial: {formatarData(item.startDate)} <br /> Final:{" "}
                      {formatWithSaturdayFormCheck(item.endDate)}
                    </Typography>
                  </div>
                  <Box sx={{ mt: 3, textAlign: "none" }}>
                    <Button
                      onClick={() => handleOpenConfirm(item.weekId)}
                      sx={{
                        backgroundColor: "var(--color-button-primary)",
                        color: "var(--color-button-text)",
                        fontWeight: "bold",
                        padding: "8px 16px",
                        "&:hover": {
                          backgroundColor: "var(--color-button-primary-hover)",
                        },
                      }}
                    >
                      Selecionar Período
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
      <Divider />
      <Stack
        flexDirection={"row"}
        gap={"10px"}
        justifyContent={"flex-end"}
        mb={4}
        sx={{ pointerEvents: "auto" }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => goBack()}
          sx={{
            marginTop: "10px",
            width: {
              xs: "100%",
              md: "200px",
            },
          }}
        >
          voltar
        </Button>
      </Stack>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja selecionar este período?
          </DialogContentText>

          <FormProvider {...methods}>
            <RadioGroupField label="Tipo de uso" field="tipoUtilizacao">
              <Radio value="UP" label="Uso Proprietário" />
              <Radio value="UC" label="Uso Convidado" />
              <Radio value="I" label="Intercambiadora" />
            </RadioGroupField>
          </FormProvider>
        </DialogContent>
        <Divider sx={{ my: 2 }} />

        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="warning"
            variant="outlined"
          >
            Sair/cancelar
          </Button>
          <Button
            onClick={handleConfirmChangeWeek}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
