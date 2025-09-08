import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet, useTheme } from "@mui/joy";
import { Owner } from "@/utils/types/multiownership/owners";
import IconOpenModal from "@/components/IconOpenModal";
import { IconButton, Tooltip } from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { downloadContractSCPUser } from "@/services/querys/user-multiownership-contracts";
import { useMutation } from "@tanstack/react-query";

export default function MultiownershipListOwners({
  owners,
}: {
  owners: Owner[];
}) {
  const LAST_SELECTED_ROW_INDEX =
    "user_multiownership_contracts_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const savedRow = localStorage.getItem(LAST_SELECTED_ROW_INDEX);
    if (savedRow) {
      setSelectedRow(Number(savedRow));
    }
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
  };

  const downloadMutation = useMutation({
    mutationFn: async (quotaId: number) => {
      const response = await downloadContractSCPUser({ cotaId: quotaId });
      return response;
    },
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Contrato_${new Date().toISOString()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Erro ao baixar contrato", error);
    },
  });

  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "90px",
        "--Table-lastColumnWidth": "50px",
        overflow: "auto",
        backgroundSize:
          "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundPosition:
          "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
        backgroundColor: "background.surface",
      }}
    >
      <Table
        borderAxis="bothBetween"
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
          "& th:nth-of-type(1)": { width: "var(--Table-firstColumnWidth)" },
          "& th:nth-of-type(2), & th:nth-of-type(3), & th:nth-of-type(4)": {
            width: 200,
          },
          "& th:nth-of-type(5)": { width: 150 },
          "& th:nth-of-type(6), & th:nth-of-type(7)": { width: 120 },
          "& th:last-child": { width: "var(--Table-lastColumnWidth)" },
          "& tbody tr": {
            cursor: "pointer",
          },
          "& tbody tr[data-selected='true']": {
            backgroundColor: "#e0f7fa",
            color: "black",
          },
          "& tbody tr[data-selected='false']": {
            backgroundColor: "transparent",
            color: theme.palette.text.primary,
          },
          "& thead th": {
            color: "primary.solidHoverBg",
          },
        }}
      >
        <thead>
          <tr>
            <th>ID da cota</th>
            <th>Número contrato</th>
            <th>Nome cliente</th>
            <th>Empreendimento</th>
            <th>Imóvel</th>
            <th>Fração da cota</th>
            <th>Data aquisição</th>
            <th aria-label="last" />
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr
              key={owner.quotaId}
              data-selected={owner.quotaId === selectedRow}
              onClick={() => handleRowClick(owner.quotaId)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  owner.quotaId === selectedRow ? "#e0f7fa" : "transparent",
                color:
                  owner.quotaId === selectedRow
                    ? "black"
                    : theme.palette.text.primary,
              }}
            >
              <td>{owner.quotaId}</td>
              <td>{owner.contractNumber}</td>
              <td>{owner.clientName}</td>
              <td>{owner.enterpriseName}</td>
              <td>{owner.propertyNumber}</td>
              <td>{owner.fractionCode}</td>
              <td>{owner.purchaseDate}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{ quotaId: owner.quotaId }}
                    sxoverride={{ color: "primary.plainColor" }}
                    type="show"
                    tooltip="Ver detalhes"
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{ quotaId: owner.quotaId }}
                    type="calendar"
                    sxoverride={{ color: "primary.plainColor" }}
                    tooltip="Incluir agendamento"
                  />
                </Box>

                {owner.hasSCPContract && (
                  <Tooltip title="Baixar contrato">
                    <IconButton
                      size="small"
                      sx={{ color: "primary.plainColor" }}
                      onClick={() => downloadMutation.mutate(owner.quotaId)}
                      disabled={downloadMutation.isPending}
                    >
                      <DownloadingIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
