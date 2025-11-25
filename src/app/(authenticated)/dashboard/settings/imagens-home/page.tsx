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
import ImageIcon from "@mui/icons-material/Image";
import {
  searchGrupoImagemHome,
  deleteGrupoImagemHome,
  GrupoImagemHome,
} from "@/services/querys/grupo-imagem-home";
import { toast } from "react-toastify";
import DeleteGrupoImagemHomeModal from "./_components/DeleteGrupoImagemHomeModal";

export default function ImagensHomePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDeleteGrupoModal, setOpenDeleteGrupoModal] = useState(false);
  const [grupoToDelete, setGrupoToDelete] = useState<GrupoImagemHome | null>(null);

  const { data: grupos, isLoading } = useQuery({
    queryKey: ["gruposImagemHome"],
    queryFn: () => searchGrupoImagemHome({ quantidadeRegistrosRetornar: 100 }),
  });


  const handleEditGrupo = (grupo: GrupoImagemHome) => {
    router.push(`/dashboard/settings/imagens-home/edit/${grupo.id}`);
  };

  const handleAddGrupo = () => {
    router.push("/dashboard/settings/imagens-home/new");
  };

  const handleManageImagens = (grupo: GrupoImagemHome) => {
    router.push(`/dashboard/settings/imagens-home/grupo/${grupo.id}`);
  };

  const handleDeleteGrupo = (grupo: GrupoImagemHome) => {
    setGrupoToDelete(grupo);
    setOpenDeleteGrupoModal(true);
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
              Gerenciar Grupos de Imagens da Home
            </Typography>
          </Box>
          <Button
            onClick={handleAddGrupo}
            sx={{
              background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              },
            }}
          >
            Novo Grupo
          </Button>
        </Box>

        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : grupos && grupos.length > 0 ? (
          <Grid container spacing={3}>
            {grupos.map((grupo) => (
              <Grid key={grupo.id} xs={12} sm={6} md={4} lg={3}>
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
                            color: "white",
                            boxShadow: "0 4px 12px rgba(44, 162, 204, 0.3)",
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography
                          level="title-lg"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            flex: 1,
                            fontSize: "1.1rem",
                            color: "text.primary",
                            lineHeight: 1.3,
                          }}
                        >
                          {grupo.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size="md"
                          variant="soft"
                          color="primary"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                            background: "linear-gradient(135deg, rgba(44, 162, 204, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)",
                            border: "1px solid",
                            borderColor: "primary.200",
                          }}
                        >
                          {grupo.images?.length || 0} {grupo.images?.length === 1 ? "imagem" : "imagens"}
                        </Chip>
                        {grupo.tagsRequeridas && grupo.tagsRequeridas.length > 0 && (
                          <Chip
                            size="sm"
                            variant="soft"
                            color="success"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          >
                            {grupo.tagsRequeridas.length} tag{grupo.tagsRequeridas.length > 1 ? "s" : ""}
                          </Chip>
                        )}
                      </Box>

                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Tooltip title="Gerenciar imagens deste grupo" placement="top">
                          <Button
                            size="sm"
                            variant="solid"
                            startDecorator={<ImageIcon />}
                            onClick={() => handleManageImagens(grupo)}
                            sx={{
                              flex: 1,
                              background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
                              color: "white",
                              fontWeight: 600,
                              borderRadius: "10px",
                              boxShadow: "0 2px 8px rgba(44, 162, 204, 0.25)",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                boxShadow: "0 4px 12px rgba(44, 162, 204, 0.35)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            Gerenciar imagens
                          </Button>
                        </Tooltip>
                        <Tooltip title="Editar grupo" placement="top">
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="primary"
                            onClick={() => handleEditGrupo(grupo)}
                            sx={{
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
                        <Tooltip title="Excluir grupo" placement="top">
                          <IconButton
                            size="sm"
                            variant="soft"
                            color="danger"
                            onClick={() => handleDeleteGrupo(grupo)}
                            sx={{
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
                  <ImageIcon sx={{ fontSize: 40, color: "primary.500" }} />
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
                    Nenhum grupo de imagens encontrado
                  </Typography>
                  <Typography
                    level="body-md"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    Comece criando seu primeiro grupo de imagens para a home
                  </Typography>
                </Stack>
                <Button
                  startDecorator={<AddIcon />}
                  onClick={handleAddGrupo}
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
                  Criar Primeiro Grupo
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {grupoToDelete && (
        <DeleteGrupoImagemHomeModal
          grupo={grupoToDelete}
          open={openDeleteGrupoModal}
          onClose={() => {
            setOpenDeleteGrupoModal(false);
            setGrupoToDelete(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
          }}
        />
      )}
    </Box>
  );
}

