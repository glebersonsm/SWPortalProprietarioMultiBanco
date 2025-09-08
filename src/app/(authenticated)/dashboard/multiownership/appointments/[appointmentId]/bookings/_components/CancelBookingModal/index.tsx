"use client";

import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelBooking } from "@/services/querys/multiownership/appointments";
import { AppointmentBooking } from "@/utils/types/multiownership/appointments";

type CancelBookingModalProps = {
  booking: AppointmentBooking;
  shouldOpen: boolean;
  appointmentId: string | number;
};

export default function CancelBookingModal({
  booking,
  shouldOpen,
  appointmentId,
}: CancelBookingModalProps) {
  const closeModal = useCloseModal();

  const queryClient = useQueryClient();
  const handleCancelBooking = useMutation({
    mutationFn: cancelBooking,
  });

  const handleDelete = () => {
    handleCancelBooking.mutate(
      { bookingId: booking.id, appointmentId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getAppointmentShowBookings"],
          });
          toast.success(`Reserva ${booking.id} cancelada com sucesso!`);
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
      <AlertDialogModal
        openModal={shouldOpen}
        closeModal={closeModal}
        message={`Você tem certeza que deseja cancelar a reserva`}
        actionText="Confirmar cancelamento"
        cancelActionText="Sair sem cancelar"
        title={"Cancelar reserva"}
        onHandleAction={handleDelete}
      />
    </>
  );
}
