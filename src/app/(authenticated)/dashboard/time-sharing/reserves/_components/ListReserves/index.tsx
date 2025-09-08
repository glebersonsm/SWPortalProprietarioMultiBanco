import React from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet } from "@mui/joy";
import IconOpenModal from "@/components/IconOpenModal";
import { Reserve } from "@/utils/types/timeSharing/reserves";
import { formatDate } from "@/utils/dates";

export default function ListReserves({ reserves }: { reserves: Reserve[] }) {
  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "120px",
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
            bgcolor: "background.surface",
          },
          "& tr > *:last-child": {
            position: "sticky",
            right: 0,
            bgcolor: "var(--TableCell-headBackground)",
          },
          "& th:nth-of-type(1)": { width: "var(--Table-firstColumnWidth)" },
          "& th:nth-of-type(2)": { width: "200px" },
          "& th:nth-of-type(3)": { width: "100px" },
          "& th:nth-of-type(4)": { width: "120px" },
          "& th:nth-of-type(5)": { width: "200px" },
          "& th:nth-of-type(6)": { width: "120px" },
          "& th:nth-of-type(7)": { width: "120px" },
          "& th:nth-of-type(8)": { width: "180px" },
          "& th:nth-of-type(9)": { width: "70px" },
          "& th:nth-of-type(10)": { width: "90px" },
          "& th:nth-of-type(11)": { width: "90px" },
          "& th:nth-of-type(12)": { width: "100px" },
          "& th:nth-of-type(13)": { width: "200px" },
          "& th:nth-of-type(14)": { width: "var(--Table-lastColumnWidth)" },
        }}
      >
        <thead>
          <tr>
            <th>Reserva</th>
            <th>Nome do cliente</th>
            <th>Confid.</th>
            <th>Tipo hóspede</th>
            <th>Nome hóspede</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Cancelada em</th>
            <th>Adultos</th>
            <th>Crianças 1</th>
            <th>Crianças 2</th>
            <th>Status</th>
            <th>Hotel</th>
            <th aria-label="last" />
          </tr>
        </thead>
        <tbody>
          {reserves.map((contract) => (
            <tr key={contract.reserveNumber}>
              <td>{contract.reserveNumber}</td>
              <td>{contract.clientName}</td>
              <td>{contract.confidential}</td>
              <td>{contract.hostType}</td>
              <td>{contract.hostName}</td>
              <td>{formatDate(contract.checkin)}</td>
              <td>{formatDate(contract.checkout)}</td>
              <td>{formatDate(contract.cancellationDate)}</td>
              <td>{contract.adults}</td>
              <td>{contract.children1}</td>
              <td>{contract.children2}</td>
              <td>{contract.reserveStatus}</td>
              <td>{contract.hotel}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{
                      idFrontReservations: contract.idFrontReservations,
                    }}
                    type="show"
                    tooltip="Ver detalhes"
                  />
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
