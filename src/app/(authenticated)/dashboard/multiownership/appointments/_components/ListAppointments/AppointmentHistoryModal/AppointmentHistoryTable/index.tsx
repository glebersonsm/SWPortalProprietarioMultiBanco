import React from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { AppointmentHistory } from "@/utils/types/multiownership/appointments";
import { getAppointmentHistory } from "@/services/querys/multiownership/appointments";

type AppointmentHistoryTableProps = {
    appointmentId: number;
    appointment: AppointmentHistory[];
};

export default function AppointmentHistoryTable({ appointmentId }: AppointmentHistoryTableProps) {
    const { data: historic = [] } = useQuery({
        queryKey: ["getAppointmentHistory", appointmentId],
        queryFn: async () => getAppointmentHistory(appointmentId),
    });

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Sheet
            sx={{
              flex: 1,
              overflow: "hidden",
              backgroundColor: "background.surface",
              borderRadius: "sm",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ height: "100%", overflow: "auto" }}>
              <Table
                borderAxis="bothBetween"
                size="sm"
                sx={{
                  "& thead": {
                    position: "sticky",
                    top: 0,
                    backgroundColor: "background.surface",
                    zIndex: 1,
                  },
                  "& th": {
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    py: 1.5,
                    px: 2,
                    whiteSpace: "nowrap",
                  },
                  "& td": {
                    py: 1.5,
                    px: 2,
                    fontSize: "0.875rem",
                    verticalAlign: "top",
                  },
                  "& th:first-of-type, & td:first-of-type": {
                    width: "80px",
                    minWidth: "80px",
                  },
                  "& th:nth-of-type(2), & td:nth-of-type(2)": {
                    width: "150px",
                    minWidth: "150px",
                  },
                  "& th:nth-of-type(3), & td:nth-of-type(3)": {
                    width: "120px",
                    minWidth: "120px",
                  },
                  "& th:nth-of-type(4), & td:nth-of-type(4)": {
                    width: "130px",
                    minWidth: "130px",
                  },
                  "& th:nth-of-type(5), & td:nth-of-type(5)": {
                    width: "130px",
                    minWidth: "130px",
                  },
                  "& th:nth-of-type(6), & td:nth-of-type(6)": {
                    minWidth: "200px",
                  },
                  "& th:nth-of-type(7), & td:nth-of-type(7)": {
                    width: "100px",
                    minWidth: "100px",
                    textAlign: "center",
                  },
                  "& .no-history-cell": {
                    textAlign: "center",
                    padding: "40px 20px",
                    fontStyle: "italic",
                    color: "text.secondary",
                  },
                }}
                variant="outlined"
              >
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuário</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Confirmação</th>
            <th>Histórico</th>
            <th>Tentativas</th>
          </tr>
        </thead>
        <tbody>
          {historic.length > 0 ? (
            historic.map((item, index: number) => (
              <tr key={index}>
                <td>{item.operationId}</td>
                <td>{item.userName}</td>
                <td>{item.operationType}</td>
                <td>{item.operationDate}</td>
                <td>{item.confirmationDateTime}</td>
                <td>{item.history}</td>
                <td>{item.attempts}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="no-history-cell">
                Nenhum histórico foi encontrado
              </td>
            </tr>
          )}
                </tbody>
              </Table>
            </Box>
          </Sheet>
        </Box>
    );
}
