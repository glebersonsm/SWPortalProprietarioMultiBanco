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
  DialogContentText,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCloseModal from "@/hooks/useCloseModal";
import {
  fetchAvailabilityAdm,
  IncludeWeekAdm,
} from "@/services/querys/multiownership/appointments";
import { ModalDialog, ModalOverflow } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import { getWeek } from "date-fns";
import { formatWithSaturdayFormCheck } from "@/utils/dates";

interface Props {
  quotaId: number;
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

export const ModalScheduling = ({ quotaId, shouldOpen }: Props) => {
  const closeModal = useCloseModal();
  const router = useRouter();

  const anoAtual = new Date().getFullYear();
  const anoProximo = anoAtual + 1;

  const [yearSelected, setYearSelected] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  useEffect(() => {
    const isBlack = localStorage.getItem("padraoDeCor") === "Black";
    if (isBlack) {
      document.documentElement.setAttribute("data-theme", "Black");
    }
  }, []);

  const { data: disponibilidade, isLoading } = useQuery({
    queryKey: ["AvailabilityWeekModalScheduling", quotaId, yearSelected],
    queryFn: () =>
      yearSelected
        ? fetchAvailabilityAdm({
            CotaAccessCenterId: quotaId,
            Ano: yearSelected,
          })
        : Promise.resolve(null),
    enabled: shouldOpen && yearSelected !== null,
  });

  const mutationSwapWeek = useMutation({
    mutationFn: ({ semanaId }: { semanaId: number }) =>
      IncludeWeekAdm({ cotaId: quotaId, semanaId }),
    onSuccess: () => {
      toast.success("Semana reservada com sucesso!");
      closeModal();
      router.push("/dashboard/multiownership/appointments");
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

  const handleOpenConfirm = (semanaId: number) => {
    setSelectedWeek(semanaId);
    setConfirmOpen(true);
  };

  const handleConfirmChangeWeek = () => {
    if (selectedWeek) {
      mutationSwapWeek.mutate({ semanaId: selectedWeek });
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Modal open={shouldOpen} onClose={closeModal}>
        <ModalOverflow>
          <ModalDialog
            sx={{ 
              width: { xs: "320px", sm: "500px", md: "1200px" },
              maxHeight: "90vh",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                background: "var(--card-bg-gradient, linear-gradient(135deg, #1e7a9c 0%, #155a73 100%))",
                color: "var(--color-text-light, #ffffff)",
                p: 2,
                borderRadius: "12px 12px 0 0",
                mb: 2
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarTodayIcon sx={{ fontSize: "1.5rem" }} />
                <DialogTitle
                  sx={{
                    color: "var(--color-text-light, #ffffff)",
                    fontWeight: "bold",
                    fontSize: "1.4rem",
                    p: 0
                  }}
                >
                  Incluir Agendamento
                </DialogTitle>
              </Stack>
              <IconButton 
                aria-label="close" 
                onClick={closeModal}
                sx={{ 
                  color: "var(--color-text-light, #ffffff)",
                  "&:hover": { bgcolor: "var(--card-bg-hover, rgba(255,255,255,0.1))" }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <DialogContent sx={{ p: 3 }}>
              {/* Seção de Seleção de Ano */}
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <EventAvailableIcon sx={{ color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.dark" }}>
                    Selecione o Ano
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                  Escolha o ano desejado para consultar as disponibilidades de agendamento
                </Typography>
                <Grid container spacing={2}>
                  {[anoAtual, anoProximo].map((ano) => (
                    <Grid item xs={6} key={ano}>
                      <Button
                        fullWidth
                        onClick={() => handleSelectYear(ano)}
                        disabled={isLoading}
                        variant={yearSelected === ano ? "contained" : "outlined"}
                        sx={{
                          py: 1.5,
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                          borderRadius: 2,
                          textTransform: "none",
                          backgroundColor: yearSelected === ano ? "var(--color-button-primary)" : "transparent",
                          color: yearSelected === ano ? "var(--color-button-text)" : "var(--color-button-primary)",
                          borderColor: "var(--color-button-primary)",
                          boxShadow: yearSelected === ano ? 3 : 1,
                          "&:hover": {
                            backgroundColor: yearSelected === ano ? "var(--color-button-primary-hover)" : "var(--color-button-primary)",
                            color: "var(--color-button-text)",
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                          transition: "all 0.3s ease"
                        }}
                      >
                        {ano}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              {/* Seção de Semanas Disponíveis */}
              {yearSelected && (
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    backgroundColor: "var(--color-bg-card)",
                    border: "1px solid var(--color-highlight-border)"
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <AccessTimeIcon sx={{ color: "var(--color-text-primary)" }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "var(--color-text-primary)" }}>
                      Semanas Disponíveis - {yearSelected}
                    </Typography>
                  </Stack>
                  
                  <Box sx={{ minHeight: "200px" }}>
                    {isLoading ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <LoadingData />
                      </Box>
                    ) : disponibilidade?.length ? (
                      <Grid container spacing={3}>
                        {disponibilidade.map((item) => (
                          <Grid item xs={12} sm={6} md={4} key={`${item.weekId}-${item.id}`}>
                            <Card 
                              sx={{ 
                                height: "100%",
                                borderRadius: 3,
                                boxShadow: 3,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: 6
                                }
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                  {/* Header do Card */}
                                  <Box sx={{ textAlign: "center" }}>
                                    <Typography 
                                      variant="h5" 
                                      sx={{ 
                                        fontWeight: "bold", 
                                        color: "primary.main",
                                        mb: 1
                                      }}
                                    >
                                      Semana {getWeekOfYear(item.startDate)}
                                    </Typography>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                      <Chip 
                                        label={item.weekTypeName} 
                                        color="secondary" 
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                      />
                                      <Chip
                                        label={item.weekGroupTypeName}
                                        color="primary"
                                        size="small"
                                        sx={{ fontWeight: "bold" }}
                                      />
                                    </Stack>
                                  </Box>
                                  
                                  {/* Período */}
                                  <Paper 
                                    elevation={1} 
                                    sx={{ 
                                      p: 2, 
                                      bgcolor: "grey.50",
                                      borderRadius: 2
                                    }}
                                  >
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                      <CalendarTodayIcon sx={{ fontSize: "1rem", color: "text.secondary" }} />
                                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                                        Período
                                      </Typography>
                                    </Stack>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                      <strong>Início:</strong> {formatarData(item.startDate)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                      <strong>Fim:</strong> {formatWithSaturdayFormCheck(item.endDate)}
                                    </Typography>
                                  </Paper>
                                  
                                  {/* Botão de Seleção */}
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleOpenConfirm(item.weekId)}
                                    startIcon={<CheckCircleIcon />}
                                    sx={{
                                      py: 1.5,
                                      fontWeight: "bold",
                                      textTransform: "none",
                                      borderRadius: 2,
                                      backgroundColor: "var(--color-button-primary)",
                                      color: "var(--color-button-text)",
                                      "&:hover": {
                                        backgroundColor: "var(--color-button-primary-hover)",
                                        transform: "translateY(-2px)",
                                        boxShadow: 4
                                      },
                                      transition: "all 0.3s ease"
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
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="h6" sx={{ color: "error.main", mb: 2 }}>
                          Nenhuma semana disponível encontrada
                        </Typography>
                        <WithoutData />
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}
            </DialogContent>
            <DialogActions 
              sx={{ 
                p: 3, 
                bgcolor: "grey.50",
                borderRadius: "0 0 12px 12px",
                justifyContent: "center"
              }}
            >
              <Button
                onClick={closeModal}
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "error.main",
                  color: "error.main",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "error.main",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: 3
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
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            maxWidth: "400px"
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 2,
              borderRadius: "12px 12px 0 0",
              mb: 2,
              textAlign: "center"
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <CheckCircleIcon sx={{ fontSize: "1.5rem" }} />
              <DialogTitle sx={{ color: "white", fontWeight: "bold", p: 0 }}>
                Confirmação de Agendamento
              </DialogTitle>
            </Stack>
          </Box>
          
          <DialogContent sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
              Confirmar Seleção
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Tem certeza que deseja selecionar este período para agendamento?
            </Typography>
          </DialogContent>
          
          <DialogActions 
            sx={{ 
              p: 3, 
              gap: 2,
              justifyContent: "center",
              bgcolor: "grey.50",
              borderRadius: "0 0 12px 12px"
            }}
          >
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outlined"
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                borderColor: "warning.main",
                color: "warning.main",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "warning.main",
                  color: "white",
                  transform: "translateY(-2px)",
                  boxShadow: 3
                },
                transition: "all 0.3s ease"
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmChangeWeek}
              variant="contained"
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "var(--color-button-primary)",
                color: "var(--color-button-text)",
                "&:hover": {
                  backgroundColor: "var(--color-button-primary-hover)",
                  transform: "translateY(-2px)",
                  boxShadow: 4
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
