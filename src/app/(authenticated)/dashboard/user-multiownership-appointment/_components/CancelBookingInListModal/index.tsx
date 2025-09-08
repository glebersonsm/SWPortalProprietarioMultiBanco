import { AppointmentBooking } from "@/utils/types/multiownership/appointments";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Stack, Typography, Table, Sheet } from "@mui/joy";
import { useState } from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelUserBooking } from "@/services/querys/user-multiownership-appointments";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/dates";
import { useSearchParams } from "next/navigation";

interface Props {
  booking: AppointmentBooking[] | undefined;
  shouldOpen: boolean;
  appointmentId?: string | number;
  title?: string;
  message?: string;
  cancelActionText?: string;
  actionText?: string;
}

export const CancelBookingInListModal = ({
  booking,
  shouldOpen,
  title = "Cancelar Reserva",
  message = "Tem certeza que deseja cancelar esta reserva?",
  appointmentId,
}: Props) => {
  const [selectedBooking, setSelectedBooking] = useState({
    id: -1,
    hostName: "",
  });
  const [openCorfimation, setOpenCorfimation] = useState(false);

  const handleConfirm = () => {
    setOpenCorfimation(true);
  };

  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  
  const closeModal = useCloseModal(
    from === "admin" 
      ? "/dashboard/user-multiownership-appointment/ListAppointmentsAdmView"
      : "/dashboard/user-multiownership-appointment/ListAppointments"
  );

  const queryClient = useQueryClient();
  const handleCancelBooking = useMutation({
    mutationFn: cancelUserBooking,
  });

  const handleDelete = () => {
    handleCancelBooking.mutate(
      { bookingId: selectedBooking.id, appointmentId: appointmentId ?? "" },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getUserAppointmentsMultiOwnership"],
          });
          toast.success(`Reserva ${selectedBooking.id} cancelada com sucesso!`);
          closeModal();
          return;
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.errors[0];
          if (errorMessage) {
            toast.error(errorMessage);
          } else {
            toast.error(
              "Não foi possível cancelar a reserva nesse momento, por favor tente mais tarde!"
            );
          }
        },
        onSettled: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <>
      <Modal
        open={shouldOpen}
        disableEscapeKeyDown
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            closeModal();
          }
        }}
      >
        <ModalDialog 
          variant="outlined" 
          role="alertdialog"
          sx={{
            maxWidth: "800px",
            width: "90vw",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(30, 122, 156, 0.15)",
            border: "1px solid var(--card-border-color)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              color: "var(--color-title)",
              fontWeight: 600,
              fontSize: "1.25rem",
              pb: 2,
            }}
          >
            <WarningRoundedIcon 
              sx={{ 
                color: "#d32f2f", 
                fontSize: "1.5rem" 
              }} 
            />
            {title}
          </DialogTitle>
          <Divider sx={{ my: 1 }} />
          <DialogContent sx={{ py: 2 }}>
            <Typography 
              sx={{
                color: "var(--color-info-text)",
                fontSize: "1rem",
                mb: 2,
                lineHeight: 1.6,
              }}
            >
              {message}
            </Typography>
            {booking && booking.length > 0 && (
              <Sheet
                sx={{
                  "--TableCell-height": "56px",
                  "--TableHeader-height": "calc(1 * var(--TableCell-height))",
                  "--Table-firstColumnWidth": "80px",
                  "--Table-lastColumnWidth": "120px",
                  overflow: "auto",
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  mb: 2,
                  border: "1px solid var(--card-border-color)",
                  boxShadow: "0 2px 8px rgba(30, 122, 156, 0.06)",
                }}
              >
                <Table
                  borderAxis="bothBetween"
                  size="md"
                  sx={{
                    minWidth: 600,
                    "& thead th": {
                       backgroundColor: "var(--color-primary)",
                       color: "white !important",
                       fontWeight: 600,
                       fontSize: "0.875rem",
                       textTransform: "uppercase",
                       letterSpacing: "0.5px",
                       borderBottom: "2px solid var(--color-secondary)",
                     },
                    "& tr > *:first-child, & th.id": {
                      position: "sticky",
                      left: 0,
                      boxShadow: "2px 0 4px rgba(30, 122, 156, 0.1)",
                      zIndex: 2,
                    },
                    "& tr > *:last-child": {
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                    },
                    "& th, & td": {
                      whiteSpace: "nowrap",
                      padding: "12px 16px",
                    },
                    "& tbody tr": {
                       cursor: "pointer",
                       transition: "all 0.2s ease-in-out",
                       "&:hover": {
                         backgroundColor: "rgba(30, 122, 156, 0.08)",
                       },
                       "&.selected": {
                         backgroundColor: "rgba(30, 122, 156, 0.12)",
                         "& td": {
                           backgroundColor: "rgba(30, 122, 156, 0.12) !important",
                         },
                       },
                     },
                  }}
                >
                  <thead>
                    <tr>
                      <th className="id">ID</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th>Status</th>
                      <th>Hóspede</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.map((b) => (
                      <tr
                        key={b.id}
                        className={selectedBooking.id === b.id ? 'selected' : ''}
                        onClick={() =>
                          setSelectedBooking({
                            id: b.id,
                            hostName: b.hostName,
                          })
                        }
                        style={{
                          cursor: "pointer",
                          background:
                            selectedBooking.id === b.id ? "#e3e8ef" : undefined,
                          transition: "background 0.2s",
                        }}
                      >
                        <td style={{ background: "#f5f7fa" }}>{b.id}</td>
                        <td>{formatDate(b.checkin)}</td>
                        <td>{formatDate(b.checkout)}</td>
                        <td>{b.status}</td>
                        <td>{b.hostName}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Sheet>
            )}
          </DialogContent>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="flex-end"
            sx={{ pt: 2 }}
          >
            <Button
              variant="outlined"
              color="neutral"
              onClick={closeModal}
              sx={{
                borderColor: "var(--card-border-color)",
                color: "var(--color-secondary)",
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "var(--color-secondary)",
                  backgroundColor: "rgba(30, 122, 156, 0.04)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Sair
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleConfirm}
              sx={{
                backgroundColor: "#d32f2f",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#b71c1c",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
                },
              }}
            >
              Cancelar Reserva
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>

      <AlertDialogModal
        openModal={openCorfimation}
        closeModal={() => setOpenCorfimation(false)}
        message={
          selectedBooking.id !== -1
            ? `Você tem certeza que deseja cancelar a reserva selecionada?\n\nID: ${selectedBooking.id}\nHóspede: ${selectedBooking.hostName}`
            : "Você tem certeza que deseja cancelar a reserva selecionada?"
        }
        actionText="Confirmar cancelamento"
        cancelActionText="Sair sem cancelar"
        title="Cancelar reserva"
        onHandleAction={handleDelete}
      />
    </>
  );
};
