import { formatDate, formatWithSaturdayFormCheck } from "@/utils/dates";
import { useRouter } from "next/navigation";
import { useReservar } from "../../context.hook";
import { UserAppointmentMultiOwnership } from "@/utils/types/user-reservesMultiOwnership";
import IconOpenModal from "@/components/IconOpenModal";
import ButtonLink from "@/components/ButtonLink";
import { addDays } from "date-fns";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
  Divider,
  Box,
  Button,
  Grid,
} from "@mui/material";
import { IconButton, Tooltip } from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { toast } from "react-toastify";
import ExchangeDropdown from "@/components/ExchangeDropdown";

// Cria um novo objeto de data para a data de hoje.
const hoje = new Date();

// Adiciona 180 dias.
const dataFutura = addDays(hoje, 180);

export default function ListAppointmentsAdm({
  appointments,
}: {
  appointments: UserAppointmentMultiOwnership[];
}) {
  const { setReserva } = useReservar();
  const router = useRouter();

  const handleReleasePoolClick = (appointmentId: string) => {
    toast.info("Esta função só está disponível para uso do cliente.");
  };

  const goToReserva = (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => {
    setReserva({
      appointmentId,
      bookingId,
      capacity,
      initialDate,
      finalDate,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract,
    });
    router.push(
      `/dashboard/user-multiownership-appointment/${appointmentId}/bookings/add?from=admin`
    );
  };

  const handleWeekExchange = (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => {
    setReserva({
      appointmentId,
      bookingId,
      capacity,
      initialDate,
      finalDate,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract,
    });
    // Redireciona para a página de troca de semana
    router.push(
      `/dashboard/user-multiownership-appointment/reserve-exchange/${appointmentId}?action=week&from=admin`
    );
  };

  const handleUsageTypeExchange = (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => {
    setReserva({
      appointmentId,
      bookingId,
      capacity,
      initialDate,
      finalDate,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract,
    });
    // Redireciona para a página de troca de tipo de uso
    router.push(
      `/dashboard/user-multiownership-appointment/reserve-exchange/${appointmentId}?action=usage-type&from=admin`
    );
  };

  const goToShiftReserva = (
    appointmentId: string,
    bookingId: string,
    initialDate: string,
    finalDate: string,
    capacity: number,
    idIntercambiadora: string,
    ownershipName: string,
    pessoaTitular1Tipo: string,
    documentOwnership: string,
    coteId: number,
    roomCondominiumId: number,
    hasSCPContract: boolean
  ) => {
    setReserva({
      appointmentId,
      bookingId,
      capacity,
      initialDate,
      finalDate,
      idIntercambiadora,
      ownershipName,
      pessoaTitular1Tipo,
      documentOwnership,
      coteId,
      roomCondominiumId,
      hasSCPContract,
    });
    router.push(
      `/dashboard/user-multiownership-appointment/reserve-exchange/${appointmentId}?from=admin`
    );
  };

  return (
    <Grid container spacing={2}>
      {appointments.map((apt) => (
        <Grid item xs={12} md={6} key={apt.id}>
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(30, 122, 156, 0.08)",
            height: '100%',
            border: "1px solid var(--card-border-color)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(30, 122, 156, 0.15)",
              transform: "translateY(-2px)",
              borderColor: "var(--color-primary)",
            },
          }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography 
                   variant="h6" 
                   sx={{
                     color: "var(--color-title)",
                     fontWeight: 600,
                     fontSize: "1.1rem",
                     mb: 1.5,
                   }}
                 >
                   {apt.coteName}
                 </Typography>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: "var(--color-primary)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    mb: 1,
                  }}
                >
                  {apt.ownershipName} - {apt.roomNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  UH: {apt.roomNumber} | Capacidade: {apt.capacity} pessoas
                </Typography>
              </Box>

              <Divider />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="primary">
                    Período
                  </Typography>
                  <Typography variant="body2">
                    {formatWithSaturdayFormCheck(apt.initialDate)} até{" "}
                    {formatDate(apt.finalDate)}
                  </Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="primary">
                    Tipo de Semana
                  </Typography>
                  <Typography variant="body2">{apt.weekType}</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" color="primary">
                    Disponibilização
                  </Typography>
                  <Typography variant="body2">
                    {apt.availableTypeName}
                  </Typography>
                </Box>
              </Stack>

              {apt.bookings && apt.bookings.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      sx={{
                        color: "var(--color-primary)",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        mb: 1.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Reservas Vinculadas
                    </Typography>
                    <Stack spacing={1}>
                      {apt.bookings.map((booking, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2.5,
                            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                            borderRadius: 2,
                            border: "1px solid var(--card-border-color)",
                            boxShadow: "0 2px 8px rgba(30, 122, 156, 0.06)",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              boxShadow: "0 4px 12px rgba(30, 122, 156, 0.1)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Stack spacing={2}>
                            {/* Primeira linha - Número da Reserva */}
                            <Box>
                              <Typography 
                                variant="caption" 
                                sx={{
                                  color: "var(--color-secondary)",
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                Número da Reserva
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--color-primary)" }}>
                                #{booking.id}
                              </Typography>
                            </Box>
                            
                            {/* Segunda linha - Dados principais */}
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                            >
                              <Box flex={1}>
                                <Typography 
                                  variant="caption" 
                                  sx={{
                                    color: "var(--color-secondary)",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  Check-in/Check-out
                                </Typography>
                                <Typography variant="body2">
                                  {formatWithSaturdayFormCheck(booking.checkin)} até{" "}
                                  {formatDate(booking.checkout)}
                                </Typography>
                              </Box>
                              <Box flex={1}>
                                <Typography 
                                  variant="caption" 
                                  sx={{
                                    color: "var(--color-secondary)",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  Hóspede Principal
                                </Typography>
                                <Typography variant="body2">
                                  {booking.hostName}
                                </Typography>
                              </Box>
                              <Box flex={1}>
                                <Typography 
                                  variant="caption" 
                                  sx={{
                                    color: "var(--color-secondary)",
                                    fontWeight: 600,
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  Status
                                </Typography>
                                <Typography variant="body2">
                                  {booking.status}
                                </Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </Stack>
          </CardContent>

          <CardActions sx={{ p: 2.5, pt: 1.5 }}>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" alignItems="center">
              {apt.bookings && apt.bookings.length > 0 ? (
                <>
                  <Button
                     variant="outlined"
                     startIcon={<InfoOutlinedIcon />}
                     onClick={() =>
                       router.push(
                         `/dashboard/user-multiownership-appointment/${apt.id}/bookings?from=admin`
                       )
                     }
                     sx={{
                       color: "var(--color-primary)",
                       borderColor: "var(--color-primary)",
                       fontWeight: 500,
                       borderRadius: 2,
                       "&:hover": {
                         backgroundColor: "var(--color-primary)",
                         color: "white",
                       },
                     }}
                   >
                     Detalhes
                   </Button>
                  
                  
                  {new Date(apt.initialDate) > new Date() &&
                    apt.availableTypeName != "Intercambiadora" &&
                    (apt.availableTypeName != "Pool" || (apt.availableTypeName === "Pool" && new Date(apt.initialDate) >= dataFutura) ) &&
                     (
                      <>
                        <IconOpenModal
                          params={{ appointmentId: apt.id, from: "admin" }}
                          type="delete"
                          tooltip="Cancelar agendamento"
                          showIcon={true}
                          sxoverride={{
                            color: "red",
                            ":hover": {
                              color: "red",
                            },
                          }}
                        />
                      </>
                    )}

                    {new Date(apt.initialDate) > new Date() &&
                          apt.availableTypeName != "Intercambiadora" &&
                          (apt.availableTypeName != "Pool" || (apt.availableTypeName === "Pool" && new Date(apt.initialDate) >= dataFutura) ) &&
                           (
                            <>
                              <ExchangeDropdown
                                appointmentId={apt.id.toString()}
                                bookingId="-1"
                                initialDate={apt.initialDate}
                                finalDate={apt.finalDate}
                                capacity={apt.capacity}
                                idIntercambiadora={apt.idIntercambiadora}
                                ownershipName={apt.ownershipName}
                                pessoaTitular1Tipo={apt.pessoaTitular1Tipo}
                                documentOwnership={apt.documentOwnership}
                                coteId={apt.coteId}
                                roomCondominiumId={apt.roomCondominiumId}
                                hasSCPContract={apt.hasSCPContract}
                                onWeekExchange={handleWeekExchange}
                                onUsageTypeExchange={handleUsageTypeExchange}
                                tooltip="Opções de troca"
                              />
                           </>
                          )}

                  {new Date(apt.initialDate) > new Date() &&
                    apt.availableTypeName != "Intercambiadora" &&
                    apt.availableTypeName != "Pool" &&
                    (apt.availableTypeName.includes("Uso proprietário") ||
                      apt.availableTypeName.includes("Uso convidado")) && (
                      <Tooltip title="Liberar para pool">
                        <IconButton
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleReleasePoolClick(apt.id.toString());
                          }}
                        >
                          <RestartAltIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                  {new Date(apt.finalDate) > new Date() &&
                    apt.bookings.length > 0 && (
                      <IconOpenModal
                        params={{ appointmentId: apt.id }}
                        type="baixar"
                        tooltip="Baixar voucher"
                      />
                    )}
                </>
              ) : (
                <>
                  {new Date(apt.initialDate) > new Date() &&
                    apt.availableTypeName != "Intercambiadora" &&
                    (apt.availableTypeName.includes("Uso proprietário") ||
                      apt.availableTypeName.includes("Uso convidado")) && (
                      <Tooltip title="Liberar para pool">
                        <IconButton
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleReleasePoolClick(apt.id.toString());
                          }}
                        >
                          <RestartAltIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                  {new Date(apt.initialDate) > new Date() &&
                    apt.availableTypeName != "Intercambiadora" &&
                    (apt.availableTypeName != "Pool" || (apt.availableTypeName === "Pool" && new Date(apt.initialDate) >= dataFutura) ) &&
                    (
                      <IconOpenModal
                        params={{ appointmentId: apt.id, from: "admin" }}
                        type="delete"
                        tooltip="Cancelar agendamento"
                        showIcon={true}
                        sxoverride={{
                          color: "red",
                          ":hover": {
                            color: "red",
                          },
                        }}
                      />
                    )}

                  {new Date(apt.initialDate) > new Date() &&
                          apt.availableTypeName != "Intercambiadora" &&
                          (apt.availableTypeName != "Pool" || (apt.availableTypeName === "Pool" && new Date(apt.initialDate) >= dataFutura) ) &&
                           (
                            <>
                              <ExchangeDropdown
                                appointmentId={apt.id.toString()}
                                bookingId="-1"
                                initialDate={apt.initialDate}
                                finalDate={apt.finalDate}
                                capacity={apt.capacity}
                                idIntercambiadora={apt.idIntercambiadora}
                                ownershipName={apt.ownershipName}
                                pessoaTitular1Tipo={apt.pessoaTitular1Tipo}
                                documentOwnership={apt.documentOwnership}
                                coteId={apt.coteId}
                                roomCondominiumId={apt.roomCondominiumId}
                                hasSCPContract={apt.hasSCPContract}
                                onWeekExchange={handleWeekExchange}
                                onUsageTypeExchange={handleUsageTypeExchange}
                                tooltip="Opções de troca"
                              />
                           </>
                          )}
                </>
              )}

              {apt.canReleasePool &&
                !apt.canRemovePool &&
                new Date(apt.initialDate) > new Date() &&
                apt.availableTypeName.includes("USO") && (
                  <IconOpenModal
                    type="release"
                    params={{
                      appointmentId: apt.id.toString(),
                      quotaId: apt.coteId.toString(),
                    }}
                    asButton={true}
                    buttonText="Liberar para Pool"
                    sxoverride={{
                      color: "var(--color-title)",
                      fontWeight: "bold",
                      "&:hover": {
                        color: "var(--color-title)",
                      },
                    }}
                  />
                )}

              {apt.canRemovePool &&
                !apt.canReleasePool &&
                new Date(apt.initialDate) > addDays(new Date(),180) && (
                  <IconOpenModal
                    type="cancel"
                    params={{
                      appointmentId: apt.id.toString(),
                      quotaId: apt.coteId.toString(),
                    }}
                    asButton={true}
                    buttonText="Retirar do Pool"
                    sxoverride={{
                      color: "var(--color-title)",
                      fontWeight: "bold",
                      "&:hover": {
                        color: "var(--color-title)",
                      },
                    }}
                  />
                )}
            </Stack>
          </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}