import React from "react";
import Table from "@mui/joy/Table";
import { Box, Sheet } from "@mui/joy";
import IconOpenModal from "@/components/IconOpenModal";
import { UserReserveWrittenOff } from "@/utils/types/user-time-sharing-ReservesWrittenOff";
import { formatDate } from "@/utils/dates";

export default function ListUserReservesWrittenOff({
  reserves,
}: {
  reserves: UserReserveWrittenOff[];
}) {
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
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "var(--Table-firstColumnWidth)" }}>
              Reserva
            </th>
            <th style={{ width: 200 }}>Nome do cliente</th>
            <th style={{ width: 160 }}>Número contrato</th>
            {/* <th style={{ width: 120 }}>Lista de espera</th> */}
            <th style={{ width: 120 }}>Hotel</th>
            <th style={{ width: 120 }}>Checkin</th>
            <th style={{ width: 120 }}>Checkout</th>
            <th style={{ width: 120 }}>Tipo de reserva</th>
            <th style={{ width: 80 }}>Adultos</th>
            <th style={{ width: 90 }}>Crianças 1</th>
            <th style={{ width: 90 }}>Crianças 2</th>
            <th
              aria-label="last"
              style={{ width: "var(--Table-lastColumnWidth)" }}
            />
          </tr>
        </thead>
        <tbody>
          {reserves.map((contract) => (
            <tr key={contract.reserveNumber}>
              <td>{contract.reserveNumber}</td>
              <td>{contract.tsSaleId}</td>
              <td>{contract.clientName}</td>
              <td>{contract.contractNumber}</td>
              {/* <td>{contract.waitingList}</td> */}
              <td>{contract.hotel}</td>
              <td>{formatDate(contract.checkin)}</td>
              <td>{formatDate(contract.checkout)}</td>
              <td>{contract.reserveType}</td>
              <td>{contract.adults}</td>
              <td>{contract.children1}</td>
              <td>{contract.children2}</td>
              <td>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconOpenModal
                    params={{ tsSaleId: contract.tsSaleId }}
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
