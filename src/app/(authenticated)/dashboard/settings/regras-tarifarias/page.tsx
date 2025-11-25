"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  searchRegraPaxFree,
  deleteRegraPaxFree,
} from "@/services/querys/regraPaxFree";
import { RegraPaxFree } from "@/utils/types/regraPaxFree";
import { toast } from "react-toastify";
import DeleteRegraPaxFreeModal from "../_components/DeleteRegraPaxFreeModal";
import RegraPaxFreeForm from "../_components/RegraPaxFreeForm";

export default function RegrasTarifariasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [regraToDelete, setRegraToDelete] = useState<RegraPaxFree | null>(null);
  const [selectedRegra, setSelectedRegra] = useState<RegraPaxFree | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const { data: regras, isLoading, error } = useQuery({
    queryKey: ["regrasPaxFree"],
    queryFn: () => searchRegraPaxFree({ quantidadeRegistrosRetornar: 100 }),
    retry: 1,
  });

  const handleAddRegra = () => {
    setSelectedRegra(null);
    setOpenFormModal(true);
  };

  const handleEditRegra = (regra: RegraPaxFree) => {
    setSelectedRegra(regra);
    setOpenFormModal(true);
  };

  const handleDeleteRegra = (regra: RegraPaxFree) => {
    setRegraToDelete(regra);
    setOpenDeleteModal(true);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startDecorator={<ArrowBackIcon />}
              onClick={() => router.push("/dashboard/settings")}
            >
              Voltar
            </Button>
            <Typography
              level="h4"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Regras Tarifárias
            </Typography>
          </Box>
          <Button
            onClick={handleAddRegra}
            sx={{
              background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              },
            }}
          >
            Nova Regra
          </Button>
        </Box>

        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : error ? (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                <Typography
                  level="body-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "danger.500",
                  }}
                >
                  Erro ao carregar regras tarifárias. Por favor, tente novamente.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : regras && regras.length > 0 ? (
          <Grid container spacing={3}>
            {regras.map((regra: RegraPaxFree) => (
              <Grid key={regra.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(44, 162, 204, 0.15)",
                      transform: "translateY(-4px)",
                      borderColor: "primary.300",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      <Typography
                        level="title-lg"
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                          color: "text.primary",
                          lineHeight: 1.3,
                        }}
                      >
                        {regra.nome}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                        {regra.configuracoes && regra.configuracoes.length > 0 && (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "8px",
                            }}
                          >
                            {regra.configuracoes.length} configuração{regra.configuracoes.length > 1 ? "ões" : ""}
                          </Chip>
                        )}
                        {(regra.dataInicioVigencia || regra.dataFimVigencia) && (
                          <Chip
                            size="sm"
                            variant="soft"
                            startDecorator={<CalendarTodayIcon sx={{ fontSize: "14px" }} />}
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)",
                              border: "1px solid",
                              borderColor: "warning.200",
                            }}
                          >
                            {(() => {
                              const inicio = formatDate(regra.dataInicioVigencia);
                              const fim = formatDate(regra.dataFimVigencia);
                              
                              if (inicio && fim) {
                                return `${inicio} - ${fim}`;
                              } else if (inicio) {
                                return `A partir de ${inicio}`;
                              } else if (fim) {
                                return `Até ${fim}`;
                              }
                              return null;
                            })()}
                          </Chip>
                        )}
                      </Stack>

                      {regra.configuracoes && regra.configuracoes.length > 0 && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            borderRadius: "8px",
                            backgroundColor: "background.level1",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            level="body-xs"
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              color: "text.secondary",
                              mb: 1,
                            }}
                          >
                            Configurações:
                          </Typography>
                          <Stack spacing={0.5}>
                            {regra.configuracoes.map((config, idx) => (
                              <Typography
                                key={idx}
                                level="body-sm"
                                sx={{
                                  fontFamily: "Montserrat, sans-serif",
                                  color: "text.primary",
                                }}
                              >
                                • {config.quantidadeAdultos} adulto{config.quantidadeAdultos !== 1 ? "s" : ""} → {config.quantidadePessoasFree} pessoa{config.quantidadePessoasFree !== 1 ? "s" : ""} free (até {config.idadeMaximaAnos} anos)
                              </Typography>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Tooltip title="Editar regra" placement="top">
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="primary"
                            onClick={() => handleEditRegra(regra)}
                            sx={{
                              flex: 1,
                              borderRadius: "10px",
                              border: "1px solid",
                              borderColor: "primary.200",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "primary.100",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir regra" placement="top">
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => handleDeleteRegra(regra)}
                            sx={{
                              flex: 1,
                              borderRadius: "10px",
                              border: "1px solid",
                              borderColor: "danger.200",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "danger.100",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card
            variant="outlined"
            sx={{
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
              border: "2px dashed",
              borderColor: "divider",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <CardContent>
              <Stack spacing={3} alignItems="center" sx={{ py: 6 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(44, 162, 204, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)",
                    border: "2px solid",
                    borderColor: "primary.200",
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 40, color: "primary.500" }} />
                </Box>
                <Stack spacing={1} alignItems="center">
                  <Typography
                    level="title-lg"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    Nenhuma regra tarifária encontrada
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    Comece criando sua primeira regra tarifária
                  </Typography>
                </Stack>
                <Button
                  onClick={handleAddRegra}
                  size="lg"
                  sx={{
                    background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "12px",
                    px: 4,
                    py: 1.5,
                    boxShadow: "0 4px 12px rgba(44, 162, 204, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      boxShadow: "0 6px 16px rgba(44, 162, 204, 0.4)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Criar Primeira Regra
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {regraToDelete && (
        <DeleteRegraPaxFreeModal
          regra={regraToDelete}
          open={openDeleteModal}
          onClose={() => {
            setOpenDeleteModal(false);
            setRegraToDelete(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["regrasPaxFree"] });
          }}
        />
      )}

      <RegraPaxFreeForm
        open={openFormModal}
        onClose={() => {
          setOpenFormModal(false);
          setSelectedRegra(null);
        }}
        regra={selectedRegra}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["regrasPaxFree"] });
          setOpenFormModal(false);
          setSelectedRegra(null);
        }}
      />
    </Box>
  );
}

