"use client";
import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  DialogTitle,
  DialogActions,
  IconButton,
  DialogContent,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCloseModal from "@/hooks/useCloseModal";
import { ModalDialog, ModalOverflow } from "@mui/joy";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import {
  AvailabilityForExchange,
  IncludeWeekUser,
} from "@/services/querys/user-multiownership-appointments";
import {
  PeriodReserveList,
  TypeIncludeWeekUserDataBody,
} from "@/utils/types/multiownership/appointments";
import { Owner } from "@/utils/types/multiownership/owners";
import { getWeek } from "date-fns";
import { formatWithSaturdayFormCheck } from "@/utils/dates";

interface Props {
  owner: Owner;
  shouldOpen: boolean;
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function getWeekOfYear(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return getWeek(parsedDate);
}

export const ModalSchedulingUser = ({ owner, shouldOpen }: Props) => {
  const closeModal = useCloseModal();
  const router = useRouter();

  const anoAtual = new Date().getFullYear();
  const anoProximo = anoAtual + 1;

  const [yearSelected, setYearSelected] = useState<number>();
  const [selectedWeek, setSelectedWeek] = useState<PeriodReserveList | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: disponibilidade, isLoading } = useQuery({
    queryKey: ["AvailabilityWeekModalScheduling", owner.quotaId, yearSelected],
    queryFn: () =>
      yearSelected != null
        ? AvailabilityForExchange({
            CotaAccessCenterId: owner.quotaId,
            Ano: yearSelected,
          })
        : Promise.resolve(null),
    enabled: shouldOpen && yearSelected != null,
  });

  const mutationSwapWeek = useMutation({
    mutationFn: (data: TypeIncludeWeekUserDataBody) => IncludeWeekUser(data),
    onSuccess: () => {
      toast.success("Semana reservada com sucesso!");
      closeModal();
      router.push("/dashboard/user-multiownership-contracts");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao reservar a semana. Por favor, tente novamente.";
      toast.error(errorMessage);
    },
  });

  const handleSelectYear = (ano: number) => {
    setYearSelected(ano);
  };

  const handleConfirmChangeWeek = () => {
    if (!selectedWeek) {
      setConfirmOpen(false);
      return;
    }

    const payload: TypeIncludeWeekUserDataBody = {
      cotaId: owner.quotaId,
      uhCondominioId: owner.enterpriseId,
      cotaPortalNome: owner.fractionName,
      cotaPortalCodigo: owner.fractionCode,
      grupoCotaPortalNome: owner.quotaGroupNome,
      numeroImovel: owner.propertyNumber,
      cotaProprietarioId: owner.clientId,

      semanaId: selectedWeek.semanaId,

      tipoUtilizacao: "UP",

      accountId: 0,
      existAccounntBank: false,
      onlyPixKey: false,
      bankCode: "",
      agency: "",
      accountNumber: "",
      pixKeyType: "",
      pixKey: "",
      code: "",
      preference: false,
      variation: "",
      hasSCPContract: owner.hasSCPContract ?? false,
      accountHolderName: owner.clientName ?? "",
      accountDocument: owner.clientDocument ?? "",
    };

    mutationSwapWeek.mutate(payload);
    setConfirmOpen(false);
  };

  return (
    <>
      <Modal open={shouldOpen} onClose={closeModal}>
        <ModalOverflow>
          <ModalDialog
            sx={{ 
              width: { xs: "200px", sm: "350px", md: "1080px" },
              maxHeight: "90vh",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)"
            }}
          >
            <Box
              sx={{
                background: "var(--card-bg-gradient)",
                padding: 2,
                borderRadius: "12px 12px 0 0",
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                <CalendarTodayIcon sx={{ color: "var(--color-text-light)" }} />
                <DialogTitle
                  sx={{
                    color: "var(--color-text-light)",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    margin: 0,
                    padding: 0
                  }}
                >
                  Incluir Agendamento
                </DialogTitle>
              </Stack>
              <IconButton 
                aria-label="close" 
                onClick={closeModal}
                sx={{
                  color: "var(--color-text-light)",
                  "&:hover": {
                    backgroundColor: "var(--card-bg-hover)"
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent>
              <Paper
                sx={{
                  background: "var(--card-bg-gradient)",
                  padding: 3,
                  borderRadius: 2,
                  marginBottom: 3
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
                  <EventAvailableIcon sx={{ color: "var(--color-text-light)" }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "var(--color-text-light)",
                      fontWeight: "bold"
                    }}
                  >
                    Selecione o Ano
                  </Typography>
                </Stack>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "var(--color-text-light)", 
                    opacity: 0.9,
                    marginBottom: 2
                  }}
                >
                  Escolha o ano desejado para consultar as disponibilidades
                </Typography>

                <Grid container spacing={2}>
                  {[anoAtual, anoProximo].map((ano) => (
                    <Grid item xs={6} key={ano}>
                      <Button
                        onClick={() => handleSelectYear(ano)}
                        disabled={isLoading}
                        fullWidth
                        variant={yearSelected === ano ? "contained" : "outlined"}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          padding: "12px 24px",
                          borderRadius: 2,
                          boxShadow: yearSelected === ano ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "none",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
                          }
                        }}
                      >
                        {ano}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper
                sx={{
                  background: "var(--card-bg-gradient)",
                  padding: 3,
                  borderRadius: 2,
                  marginBottom: 3
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 2 }}>
                  <AccessTimeIcon sx={{ color: "var(--color-text-light)" }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "var(--color-text-light)",
                      fontWeight: "bold"
                    }}
                  >
                    Semanas Disponíveis
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: disponibilidade?.length ? "flex-start" : "center"
                  }}
                >
                  {isLoading ? (
                    <LoadingData />
                  ) : disponibilidade?.length ? (
                    <Grid container spacing={2}>
                      {disponibilidade.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.semanaId}>
                          <Card 
                            sx={{ 
                              height: "100%",
                              borderRadius: 2,
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
                              }
                            }}
                          >
                            <CardContent sx={{ padding: 3 }}>
                              <Stack spacing={2}>
                                <Typography 
                                  variant="h6" 
                                  sx={{ 
                                    fontWeight: "bold",
                                    color: "var(--color-primary)"
                                  }}
                                >
                                  Semana {getWeekOfYear(item.semanaDataInicial)}
                                </Typography>
                                
                                <Stack direction="row" spacing={1}>
                                  <Chip 
                                    label={item.tipoSemanaNome} 
                                    size="small"
                                    sx={{ 
                                      backgroundColor: "var(--color-secondary)",
                                      color: "white",
                                      fontWeight: "bold"
                                    }}
                                  />
                                  <Chip
                                    label={item.grupoTipoSemanaNome}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: "var(--color-primary)",
                                      color: "white",
                                      fontWeight: "bold"
                                    }}
                                  />
                                </Stack>

                                <Paper 
                                  sx={{ 
                                    padding: 2, 
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    borderRadius: 1
                                  }}
                                >
                                  <Stack direction="row" alignItems="center" spacing={1} sx={{ marginBottom: 1 }}>
                                    <CalendarTodayIcon sx={{ fontSize: 16, color: "var(--color-primary)" }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                      Período
                                    </Typography>
                                  </Stack>
                                  <Typography variant="body2" sx={{ marginBottom: 0.5 }}>
                                    <strong>Início:</strong> {formatarData(item.semanaDataInicial)}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Fim:</strong> {formatWithSaturdayFormCheck(item.semanaDataFinal)}
                                  </Typography>
                                </Paper>

                                <Button
                                  onClick={() => {
                                    setSelectedWeek(item);
                                    setConfirmOpen(true);
                                  }}
                                  fullWidth
                                  variant="contained"
                                  startIcon={<CheckCircleIcon />}
                                  sx={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "white",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    padding: "12px 24px",
                                    borderRadius: 2,
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                    "&:hover": {
                                      backgroundColor: "var(--color-primary-dark)",
                                      transform: "translateY(-2px)",
                                      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)"
                                    }
                                  }}
                                >
                                  Selecionar Período
                                </Button>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: "center", width: "100%" }}>
                      {yearSelected ? (
                        <Typography 
                          sx={{ 
                            color: "var(--color-error)",
                            marginBottom: 2,
                            fontWeight: "bold"
                          }}
                        >
                          Nenhuma semana disponível foi encontrada.
                        </Typography>
                      ) : null}
                      <WithoutData />
                    </Box>
                  )}
                </Box>
              </Paper>
            </DialogContent>
            <DialogActions
              sx={{
                padding: 3,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderRadius: "0 0 12px 12px",
                justifyContent: "center"
              }}
            >
              <Button
                variant="outlined"
                onClick={closeModal}
                sx={{
                  minWidth: "120px",
                  padding: "10px 24px",
                  color: "var(--color-text)",
                  borderColor: "var(--color-border)",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "var(--card-bg-hover)",
                    borderColor: "var(--color-primary)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Fechar
              </Button>
            </DialogActions>
          </ModalDialog>
        </ModalOverflow>
      </Modal>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <ModalDialog
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            maxWidth: "400px"
          }}
        >
          <Box
            sx={{
              background: "var(--card-bg-gradient)",
              color: "var(--color-text-light)",
              padding: 2,
              borderRadius: "12px 12px 0 0",
              textAlign: "center"
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 32, marginBottom: 1 }} />
            <DialogTitle
              sx={{
                color: "var(--color-text-light)",
                fontWeight: "bold",
                margin: 0,
                padding: 0
              }}
            >
              Confirmação
            </DialogTitle>
          </Box>
          <DialogContent sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ marginBottom: 1, fontWeight: "bold" }}>
              Confirmar Agendamento
            </Typography>
            <Typography variant="body1" sx={{ color: "var(--color-text-secondary)" }}>
              Tem certeza que deseja agendar essa semana?
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              padding: 3,
              gap: 2,
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              borderRadius: "0 0 12px 12px"
            }}
          >
            <Button 
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              sx={{
                minWidth: "100px",
                padding: "10px 20px",
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "var(--card-bg-hover)",
                  borderColor: "var(--color-primary)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmChangeWeek}
              variant="contained"
              sx={{
                minWidth: "100px",
                padding: "10px 20px",
                backgroundColor: "var(--color-primary)",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: "var(--color-primary-dark)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};
