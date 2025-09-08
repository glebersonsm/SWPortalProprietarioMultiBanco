import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet, useTheme } from "@mui/joy";
import { Owner } from "@/utils/types/multiownership/owners";
import IconOpenModal from "@/components/IconOpenModal";
import { IconButton, Tooltip } from "@mui/material";
import DownloadingIcon from "@mui/icons-material/Downloading";
import { downloadContractSCPAdm } from "@/services/querys/multiownership/owners";
import { useMutation } from "@tanstack/react-query";

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function MultiownershipListOwners({
  owners,
}: {
  owners: Owner[];
}) {
  const LAST_SELECTED_ROW_INDEX = "owners_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const savedRow = thereIsLocalStorage ? localStorage.getItem(LAST_SELECTED_ROW_INDEX) : "";
    if (savedRow) {
      setSelectedRow(Number(savedRow));
    }
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    if (thereIsLocalStorage)
      localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
  };

  const downloadMutation = useMutation({
    mutationFn: async (quotaId: number) => {
      const response = await downloadContractSCPAdm({ cotaId: quotaId });
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
          "& th:nth-of-type(2)": { width: 200 },
          "& th:nth-of-type(3)": { width: 200 },
          "& th:nth-of-type(4)": { width: 200 },
          "& th:nth-of-type(5)": { width: 150 },
          "& th:nth-of-type(6)": { width: 150 },
          "& th:nth-of-type(7)": { width: 80 },
          "& th:nth-of-type(8)": { width: 100 },
          "& th:nth-of-type(9)": { width: 100 },
          "& th:nth-of-type(10)": { width: 50 },
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
            <th>Email cliente</th>
            <th>Empreendimento</th>
            <th>Identificação RCI</th>
            <th>Imóvel</th>
            <th>Fraçao</th>
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
              <td>{owner.clientEmail}</td>
              <td>{owner.enterpriseName}</td>
              <td>{owner.idIntercambiadora ?? "-"}</td>
              <td>{owner.propertyNumber}</td>
              <td>{owner.fractionCode}</td>
              <td>{owner.purchaseDate}</td>
              <td>
                <Box sx={{ gap: 1, alignItems: "center" }}>
                  <IconOpenModal
                    params={{ quotaId: owner.quotaId }}
                    type="show"
                    sxoverride={{ color: "primary.plainColor" }}
                    tooltip="Ver detalhes"
                  />
                  <IconOpenModal
                    params={{ quotaId: owner.quotaId }}
                    type="calendar"
                    sxoverride={{ color: "primary.plainColor" }}
                    tooltip="Incluir agendamento"
                  />
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
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
