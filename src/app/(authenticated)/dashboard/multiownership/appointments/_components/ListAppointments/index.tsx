import React, { useEffect, useState } from "react";
import Table from "@mui/joy/Table";
import { Sheet, Stack, useTheme } from "@mui/joy";
import { formatDate, formatWithSaturdayFormCheck } from "@/utils/dates";
import ButtonLink from "@/components/ButtonLink";
import IconOpenModal from "@/components/IconOpenModal";
import { AppointmentMultiOwnership } from "@/utils/types/multiownership/appointments";
import { useRouter } from "next/navigation";
import { addDays } from "date-fns";

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function ListAppointments({
  appointments,
}: {
  appointments: AppointmentMultiOwnership[];
}) {
  const router = useRouter();
  const LAST_SELECTED_ROW_INDEX = "multiownership_last_selected_row";
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const theme = useTheme();
  

  useEffect(() => {
    if (thereIsLocalStorage)
    {
      const savedRow = localStorage.getItem(LAST_SELECTED_ROW_INDEX);
      if (savedRow) {
        setSelectedRow(Number(savedRow));
      }
    }
  }, []);

  const handleRowClick = (id: number) => {
    setSelectedRow(id);
    if (thereIsLocalStorage)
    localStorage.setItem(LAST_SELECTED_ROW_INDEX, id.toString());
  };

  return (
    <Sheet
      sx={{
        "--TableCell-height": "50px",
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "120px",
        "--Table-lastColumnWidth": "150px",
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
          "& th.id": { width: 80 },
          "& th.year": { width: 100 },
          "& th.owner": { width: 200 },
          "& th.initialDate": { width: 120 },
          "& th.finalDate": { width: 120 },
          "& th.weekType": { width: 120 },
          "& th.coteName": { width: 200 },
          "& th.room": { width: 70 },
          "& th.availType": { width: 100 },
          "& th.reservations": { width: 200 },
          "& th.last": { width: 150 },
          "& td.last": { width: 150, alignItems: "center" },
          "& thead th": {
            color: "primary.solidHoverBg",
          },
        }}
      >
        <thead>
          <tr>
            <th className="id">Id</th>
            <th className="year">Ano</th>
            <th className="owner">Cliente MY MABU</th>
            <th className="initialDate">Data inicial</th>
            <th className="finalDate">Data final</th>
            <th className="weekType">Tipo</th>
            <th className="coteName">Nome da cota</th>
            <th className="room">Imóvel</th>
            <th className="availType">Tipo disponib.</th>
            <th className="reservations">Reservas vinculadas</th>
            <th className="last" aria-label="last">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr
              key={appointment.id}
              data-selected={appointment.id === selectedRow}
              onClick={() => handleRowClick(appointment.id)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  appointment.id === selectedRow ? "#e0f7fa" : "transparent",
                color:
                  appointment.id === selectedRow
                    ? "black"
                    : theme.palette.text.primary,
              }}
            >
              <td>{appointment.periodCoteAvailabilityId}</td>
              <td>{appointment.year}</td>
              <td>{appointment.ownershipName}</td>
              <td>{formatDate(appointment.initialDate)}</td>
              <td>{formatWithSaturdayFormCheck(appointment.finalDate)}</td>
              <td>{appointment.weekType}</td>
              <td>{appointment.coteName}</td>
              <td>{appointment.roomNumber}</td>
              <td>{appointment.availableTypeName}</td>
              <td>{appointment.reservations}</td>
              <td className="last" aria-label="last">
                <Stack flexDirection={"row"} alignItems={"center"}>
                {appointment.bookings && appointment.bookings?.length > 0 ? (
                  <ButtonLink
                    href={`/dashboard/multiownership/appointments/${appointment.id}/bookings`}
                    type="show"
                    colorIcon="primary.plainColor"
                    sxoverride={{ color: "primary.plainColor" }}
                    tooltip="Visualizar reserva(s)"
                    handleOnClick={() => {
                      setSelectedRow(appointment.id);
                    }}
                  />
                  ) : null}

                  {appointment.canRemovePool &&
                  !appointment.canReleasePool &&
                  new Date(appointment.initialDate) > addDays(new Date(),180) ? (
                    <IconOpenModal
                      params={{
                        appointmentId: appointment.id,
                      }}
                      sxoverride={{ color: "primary.plainColor" }}
                      type="cancel"
                      tooltip="Retirar do pool"
                    />
                  ) : null}

                  {!appointment.canRemovePool &&
                  appointment.canReleasePool &&
                  new Date(appointment.initialDate) > new Date() && 
                    appointment.availableTypeName.includes("USO") ? (
                    <IconOpenModal
                      params={{
                        appointmentId: appointment.id,
                      }}
                      sxoverride={{ color: "primary.plainColor" }}
                      type="reset"
                      tooltip="Liberar para pool"
                    />
                  ) : null}

                  <IconOpenModal
                    params={{
                      appointmentId: appointment.id,
                    }}
                    sxoverride={{ color: "primary.plainColor" }}
                    type="history"
                    tooltip="Visualizar históricos"
                  />

                  {/* {(appointment.bookings == undefined ||
                    appointment.bookings?.length == 0) &&
                  new Date(appointment.initialDate) > new Date() &&
                  appointment.availableTypeName === "Uso" ? (
                    <ButtonLink
                      href={`/dashboard/multiownership/appointments/reserve-exchange/${appointment.id}`}
                      type="calendar"
                      tooltip="Reservar a semana"
                    />
                  ) : null} */}
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
}
