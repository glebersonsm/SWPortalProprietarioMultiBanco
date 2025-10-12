import React from "react";
import Table from "@mui/joy/Table";
import { Box, FormLabel, Sheet } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Document, DocumentHistory } from "@/utils/types/documents";
import { getDocumentHistory } from "@/services/querys/document";
import { formatDate } from "@/utils/dates";

type HistoryTableProps = {
  document: Document;
};

export default function HistoryTable({ document }: HistoryTableProps) {
  const { data: historic = [] } = useQuery({
    queryKey: ["getDocumentHistory", document.id],
    queryFn: async () => getDocumentHistory(document.id),
  });

  return (
    <Box marginTop={2}>
      <FormLabel>Acessos</FormLabel>
      <Sheet
        sx={{
          "--TableHeader-height": "calc(1 * var(--TableCell-height))",
          "--Table-firstColumnWidth": "50px",
          "--Table-lastColumnWidth": "100px",
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
              bgcolor: "background.surface",
            },
            "& th:first-of-type": {
              width: "var(--Table-firstColumnWidth)",
            },
            "& th:not(:first-of-type)": {
              width: 100,
            },
          }}
          variant="outlined"
        >
          <thead>
            <tr>
              <th>Id do usuário</th>
              <th>Usuário</th>
              <th>Ação</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {historic.map((item: DocumentHistory, index: number) => (
              <tr key={index}>
                <td>{item.userId}</td>
                <td>{item.userName}</td>
                <td>{item.action}</td>
                <td>{formatDate(item.date, "dd/MM/yyyy HH:mm:ss")}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
