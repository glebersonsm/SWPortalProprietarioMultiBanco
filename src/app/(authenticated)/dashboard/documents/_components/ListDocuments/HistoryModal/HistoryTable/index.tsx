import React from "react";
import Table from "@mui/joy/Table";
import { Box, FormLabel, Sheet, Typography, Chip } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Document, DocumentHistory } from "@/utils/types/documents";
import { getDocumentHistory } from "@/services/querys/document";
import { format } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";

type HistoryTableProps = {
  document: Document;
};

export default function HistoryTable({ document }: HistoryTableProps) {
  const { data: historic = [], isLoading } = useQuery({
    queryKey: ["getDocumentHistory", document.id],
    queryFn: async () => getDocumentHistory(document.id),
  });

  const getActionColor = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes("baixou") || actionLower.includes("download")) {
      return "success";
    }
    if (actionLower.includes("salvou") || actionLower.includes("criou")) {
      return "primary";
    }
    if (actionLower.includes("deletou") || actionLower.includes("removeu")) {
      return "danger";
    }
    return "neutral";
  };

  return (
    <Box marginTop={3}>
      <FormLabel
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: "1rem",
          color: "text.primary",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AccessTimeIcon sx={{ fontSize: 20 }} />
        Histórico de Acessos
      </FormLabel>
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          backgroundColor: "background.surface",
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            maxHeight: "400px",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                background: "rgba(0, 0, 0, 0.3)",
              },
            },
          }}
        >
          <Table
            borderAxis="xBetween"
            hoverRow
            sx={{
              "--TableCell-headBackground": "var(--joy-palette-background-level1)",
              "--TableCell-headFontSize": "0.875rem",
              "--TableCell-headFontWeight": 600,
              "--TableCell-paddingX": "16px",
              "--TableCell-paddingY": "12px",
              fontFamily: "Montserrat, sans-serif",
              "& thead th": {
                backgroundColor: "background.level1",
                color: "text.primary",
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                borderBottom: "2px solid",
                borderColor: "divider",
                position: "sticky",
                top: 0,
                zIndex: 1,
                background: "linear-gradient(135deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-surface) 100%)",
              },
              "& tbody tr": {
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(44, 162, 204, 0.05)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                },
                "&:not(:last-child)": {
                  borderBottom: "1px solid",
                  borderColor: "divider",
                },
              },
              "& tbody td": {
                color: "text.primary",
                fontSize: "0.875rem",
                padding: "12px 16px",
                verticalAlign: "middle",
              },
              "& tbody tr:nth-of-type(even)": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
            }}
          >
            <thead>
              <tr>
                <th style={{ minWidth: "200px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ fontSize: 16 }} />
                    Usuário
                  </Box>
                </th>
                <th style={{ minWidth: "150px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DescriptionIcon sx={{ fontSize: 16 }} />
                    Ação
                  </Box>
                </th>
                <th style={{ minWidth: "200px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    Data/Hora
                  </Box>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "40px" }}>
                    <Typography level="body-md" color="neutral">
                      Carregando histórico...
                    </Typography>
                  </td>
                </tr>
              ) : historic.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "40px" }}>
                    <Typography level="body-md" color="neutral">
                      Nenhum histórico encontrado
                    </Typography>
                  </td>
                </tr>
              ) : (
                historic.map((item: DocumentHistory, index: number) => {
                  // Formatar data com hora usando date-fns
                  const formatDateTime = (dateString?: string) => {
                    if (!dateString) return "-";
                    try {
                      const date = new Date(dateString);
                      if (isNaN(date.getTime())) return dateString;
                      return format(date, "dd/MM/yyyy HH:mm:ss");
                    } catch {
                      return dateString;
                    }
                  };

                  return (
                    <tr key={index}>
                      <td>
                        <Typography
                          level="body-sm"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                          }}
                        >
                          {item.userName}
                        </Typography>
                      </td>
                      <td>
                        <Chip
                          size="sm"
                          variant="soft"
                          color={getActionColor(item.action)}
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.action}
                        </Chip>
                      </td>
                      <td>
                        <Typography
                          level="body-sm"
                          sx={{
                            color: "text.secondary",
                            fontFamily: "monospace",
                          }}
                        >
                          {formatDateTime(item.date)}
                        </Typography>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Box>
      </Sheet>
    </Box>
  );
}
