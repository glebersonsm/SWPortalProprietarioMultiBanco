"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  searchImagemGrupoImagemHome,
  ImagemGrupoImagemHome,
} from "@/services/querys/imagem-grupo-imagem-home";
import { GrupoImagemHome } from "@/services/querys/grupo-imagem-home";
import ImagemForm from "../ImagemForm";
import DeleteImagemGrupoImagemHomeModal from "../DeleteImagemGrupoImagemHomeModal";

type ImagensListPageProps = {
  grupo: GrupoImagemHome;
};

export default function ImagensListPage({ grupo }: ImagensListPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedImagem, setSelectedImagem] = useState<ImagemGrupoImagemHome | null>(null);
  const [openImagemModal, setOpenImagemModal] = useState(false);
  const [openDeleteImagemModal, setOpenDeleteImagemModal] = useState(false);
  const [imagemToDelete, setImagemToDelete] = useState<ImagemGrupoImagemHome | null>(null);

  const { data: imagens, isLoading } = useQuery({
    queryKey: ["imagensGrupoImagemHome", grupo.id],
    queryFn: () =>
      searchImagemGrupoImagemHome({
        grupoImagemHomeId: grupo.id,
        quantidadeRegistrosRetornar: 100,
      }),
    enabled: !!grupo.id,
  });

  const handleAddImagem = () => {
    setSelectedImagem(null);
    setOpenImagemModal(true);
  };

  const handleEditImagem = (imagem: ImagemGrupoImagemHome) => {
    setSelectedImagem(imagem);
    setOpenImagemModal(true);
  };

  const handleDeleteImagem = (imagem: ImagemGrupoImagemHome) => {
    setImagemToDelete(imagem);
    setOpenDeleteImagemModal(true);
  };

  const getImageUrl = (imagem: ImagemGrupoImagemHome) => {
    if (imagem.imagemBase64) {
      return `data:image/jpeg;base64,${imagem.imagemBase64}`;
    }
    return undefined;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              startDecorator={<ArrowBackIcon />}
              onClick={() => router.push("/dashboard/settings/imagens-home")}
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
              Imagens do Grupo: {grupo.name}
            </Typography>
          </Box>
          <Tooltip title="Adicionar nova imagem ao grupo" placement="top">
            <Button
              onClick={handleAddImagem}
              sx={{
                background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                },
              }}
            >
              Adicionar Imagem
            </Button>
          </Tooltip>
        </Box>

        {isLoading ? (
          <Typography>Carregando...</Typography>
        ) : imagens && imagens.length > 0 ? (
          <Grid container spacing={3}>
            {imagens
              .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
              .map((imagem) => (
                <Grid key={imagem.id} xs={12} sm={6} md={4} lg={3}>
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
                    <CardContent sx={{ p: 2 }}>
                      <Stack spacing={1.5}>
                        {getImageUrl(imagem) && (
                          <Box
                            sx={{
                              width: "100%",
                              height: 200,
                              borderRadius: "12px",
                              overflow: "hidden",
                              background: "linear-gradient(135deg, rgba(44, 162, 204, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)",
                              border: "1px solid",
                              borderColor: "divider",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            <Image
                              src={getImageUrl(imagem) || ""}
                              alt={imagem.name || "Imagem"}
                              fill
                              unoptimized
                              style={{
                                objectFit: "contain",
                              }}
                            />
                          </Box>
                        )}

                        <Typography
                          level="title-md"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "text.primary",
                            lineHeight: 1.3,
                            minHeight: "2.4em",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {imagem.name}
                        </Typography>

                        <Stack
                          direction="column"
                          spacing={0.75}
                          sx={{
                            width: "100%",
                            alignItems: "flex-start",
                          }}
                        >
                          {imagem.ordem !== undefined && imagem.ordem !== null && (
                            <Chip
                              size="sm"
                              variant="soft"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, rgba(44, 162, 204, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)",
                                border: "1px solid",
                                borderColor: "primary.200",
                              }}
                            >
                              Ordem exibição: {imagem.ordem}
                            </Chip>
                          )}
                          {imagem.nomeBotao && (
                            <Chip
                              size="sm"
                              variant="soft"
                              color="primary"
                              startDecorator={<LaunchIcon sx={{ fontSize: "0.875rem" }} />}
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.75rem",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: "8px",
                                background: "linear-gradient(135deg, rgba(44, 162, 204, 0.15) 0%, rgba(25, 118, 210, 0.15) 100%)",
                                border: "1px solid",
                                borderColor: "primary.300",
                              }}
                            >
                              {imagem.nomeBotao}
                            </Chip>
                          )}
                          {imagem.tagsRequeridas && imagem.tagsRequeridas.length > 0 && (
                            <Chip
                              size="sm"
                              variant="soft"
                              color="success"
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.75rem",
                              }}
                            >
                              {imagem.tagsRequeridas.length} tag{imagem.tagsRequeridas.length > 1 ? "s" : ""}
                            </Chip>
                          )}
                          {(imagem.dataInicioVigencia || imagem.dataFimVigencia) && (
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
                                const formatDate = (dateStr: string | undefined) => {
                                  if (!dateStr) return null;
                                  // Se a data já está no formato yyyy-MM-dd, converter diretamente
                                  const parts = dateStr.split('T')[0].split('-');
                                  if (parts.length === 3) {
                                    return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                  }
                                  // Se já está formatada, retornar como está
                                  return dateStr;
                                };
                                
                                const inicio = formatDate(imagem.dataInicioVigencia);
                                const fim = formatDate(imagem.dataFimVigencia);
                                
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

                        <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                          <Tooltip title="Editar imagem" placement="top">
                            <IconButton
                              size="sm"
                              variant="soft"
                              color="primary"
                              onClick={() => handleEditImagem(imagem)}
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
                          <Tooltip title="Excluir imagem" placement="top">
                            <IconButton
                              size="sm"
                              variant="soft"
                              color="danger"
                              onClick={() => handleDeleteImagem(imagem)}
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
              <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
                <Typography
                  level="body-lg"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "text.secondary",
                  }}
                >
                  Nenhuma imagem encontrada neste grupo
                </Typography>
                <Button
                  startDecorator={<AddIcon />}
                  onClick={handleAddImagem}
                  sx={{
                    background: "linear-gradient(135deg, #2ca2cc 0%, #1976d2 100%)",
                    color: "white",
                  }}
                >
                  Adicionar Primeira Imagem
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {grupo.id && (
        <ImagemForm
          open={openImagemModal}
          onClose={() => {
            setOpenImagemModal(false);
            setSelectedImagem(null);
          }}
          grupoId={grupo.id}
          imagem={selectedImagem}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["imagensGrupoImagemHome", grupo.id] });
            queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
            setOpenImagemModal(false);
            setSelectedImagem(null);
          }}
        />
      )}

      {imagemToDelete && (
        <DeleteImagemGrupoImagemHomeModal
          imagem={imagemToDelete}
          open={openDeleteImagemModal}
          onClose={() => {
            setOpenDeleteImagemModal(false);
            setImagemToDelete(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["imagensGrupoImagemHome", grupo.id] });
            queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
          }}
        />
      )}
    </Box>
  );
}

