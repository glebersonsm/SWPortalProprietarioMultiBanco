import * as React from "react";
import IconOpenModal from "@/components/IconOpenModal";
import DeleteIcon from "@mui/icons-material/Delete";
import useCanEdit from "@/hooks/useCanEdit";
import { GroupImages } from "@/utils/types/groupImages";
import { Image as ImageType } from "@/utils/types/images";
import { Box, List, ListItem, Typography, Stack, Chip } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LabelIcon from "@mui/icons-material/Label";

type ListImagesProps = {
  groupImages: GroupImages;
};

export default function ListImages({ groupImages }: ListImagesProps) {
  const canEditImages = useCanEdit("images");

  return (
    <Box sx={{ padding: 0 }}>
      <List sx={{ "--ListItem-paddingY": "0px", gap: 1.5 }}>
        {groupImages.images.filter(img => img.imagemBase64).map((image: ImageType) => (
          <ListItem
            key={image.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, var(--card-bg-primary, #035781) 0%, var(--card-bg-surface, rgba(3, 87, 129, 0.03)) 100%)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              margin: "8px 16px",
              padding: "12px 20px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, var(--card-bg-primary, #035781) 0%, var(--card-bg-hover, rgba(3, 87, 129, 0.05)) 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              {image.imagemBase64 && (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                    flexShrink: 0,
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                    },
                  }}
                >
                  <Image
                    src={`data:image/jpeg;base64,${image.imagemBase64}`}
                    alt={image.name}
                    fill
                    unoptimized
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {image.name}
                </Typography>
                <Stack 
                  direction="row" 
                  spacing={0.75} 
                  flexWrap="wrap" 
                  sx={{ gap: 0.75, alignItems: "center" }}
                >
                  {image.nomeBotao && image.linkBotao && (
                    <Chip
                      size="sm"
                      variant="solid"
                      color="primary"
                      startDecorator={<LaunchIcon sx={{ fontSize: "14px" }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (image.linkBotao) {
                          window.open(image.linkBotao, "_blank", "noopener,noreferrer");
                        }
                      }}
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "8px",
                        backgroundColor: "primary.500",
                        color: "white",
                        border: "none",
                        maxWidth: "100%",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 2px 8px rgba(44, 162, 204, 0.3)",
                        "&:hover": {
                          backgroundColor: "primary.600",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(44, 162, 204, 0.4)",
                        },
                        "&:active": {
                          transform: "translateY(0px)",
                          boxShadow: "0 2px 6px rgba(44, 162, 204, 0.3)",
                        },
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "white",
                          fontWeight: 600,
                        },
                        "& .MuiChip-startDecorator": {
                          color: "white",
                        },
                      }}
                    >
                      {image.nomeBotao}
                    </Chip>
                  )}
                  {image.tagsRequeridas && image.tagsRequeridas.length > 0 && (
                    <Chip
                      size="sm"
                      variant="soft"
                      startDecorator={<LabelIcon sx={{ fontSize: "14px" }} />}
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        px: 1,
                        py: 0.25,
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      {image.tagsRequeridas.length} tag{image.tagsRequeridas.length > 1 ? "s" : ""}
                    </Chip>
                  )}
                  {(image.dataInicioVigencia || image.dataFimVigencia) && (
                    <Chip
                      size="sm"
                      variant="soft"
                      startDecorator={<CalendarTodayIcon sx={{ fontSize: "14px" }} />}
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        px: 1,
                        py: 0.25,
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
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
                        
                        const inicio = formatDate(image.dataInicioVigencia);
                        const fim = formatDate(image.dataFimVigencia);
                        
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
              </Stack>
            </Stack>
            <Box>
              {canEditImages ? (
                <>
                  <IconOpenModal
                    params={{
                      groupImagesId: groupImages.id,
                      imageId: image.id,
                    }}
                    type="edit-image"
                    icon={<EditIcon />}
                    sxoverride={{
                      color: "var(--color-doc-item-icon)",
                      transition: "0.6s",
                    }}
                    tooltip="Editar imagem"
                  />
                  <IconOpenModal
                    params={{
                      groupImagesId: groupImages.id,
                      imageId: image.id,
                    }}
                    type="delete-image"
                    icon={<DeleteIcon />}
                    sxoverride={{
                      color: "var(--color-doc-item-icon)",
                      transition: "0.6s",
                    }}
                    tooltip="Deletar/Remover imagem"
                  />
                </>
              ) : null}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
