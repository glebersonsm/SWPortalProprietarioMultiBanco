"use client";

import AlertError from "@/app/(auth)/_components/AlertError";
import DynamicMultiForm from "@/components/DynamicMultiForm";
import InputField from "@/components/InputField";
import { setFormErrors } from "@/services/errors/formErrors";
import {
  AppointmentEditBooking,
  BookingGuest,
} from "@/utils/types/multiownership/appointments";
import { Button, Grid, Radio, Stack } from "@mui/joy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import HostsForm from "../HostsForm";
import { editBooking } from "@/services/querys/user-multiownership-appointments";
import { toast } from "react-toastify";
import { untransformedEditBookings } from "@/services/api/multiownership/transformedMultiOwnershipAppointments";
import SelectField from "@/components/SelectField";
import useCloseModal from "@/hooks/useCloseModal";
import { formatDate } from "@/utils/dates";
import RadioGroupField from "@/components/RadioGroupField";
import { useReservar } from "../../../../context.hook";
import { useSearchParams } from "next/navigation";

type BookingFormProps = {
  booking?: AppointmentEditBooking;
  appointmentId: string;
  initialDate: string;
  finalDate: string;
  isEditing?: boolean;
};

const defaultGuest: BookingGuest = {
  id: 0,
  main: true,
};

export default function BookingForm({
  booking,
  appointmentId,
  initialDate,
  finalDate,
  isEditing = false,
}: BookingFormProps) {
  const { reserva } = useReservar();

  const [isLoading, setIsLoading] = React.useState(false);
  const [_, setIsSubmitted] = React.useState(false);

  const form = useForm<AppointmentEditBooking>({
    defaultValues: {
      ...booking,
      checkin: formatDate(
        !isEditing ? initialDate ?? booking?.checkin : booking?.checkin,
        "yyyy-MM-dd"
      ),
      tipoUtilizacao: booking?.tipoUtilizacao ?? "proprietario",
      checkout: formatDate(
        !isEditing ? finalDate ?? booking?.checkout : booking?.checkout,
        "yyyy-MM-dd"
      ),
      status:
        booking?.status !== undefined ? booking?.status.substring(0, 2) : "AC",
      guests:
        isEditing || booking?.guests?.length
          ? booking?.guests?.map((guest) => ({
              ...guest,
              birthday:
                guest?.birthday != null
                  ? formatDate(guest?.birthday, "yyyy-MM-dd")
                  : null,
            }))
          : [defaultGuest],
      canChangeMainHostData:
        booking?.tipoUtilizacao?.includes("UC") ||
        booking?.tipoUtilizacao?.includes("C") ||
        booking?.tipoUtilizacao?.includes("Convidado")
          ? true
          : false,
    },
  });

  const {
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      errorIsFirst: true,
      error,
      form,
      generalMessage:
        "Não é possível editar ou adicionar a reserva nesse momento, por favor tente mais tarde!",
    });
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const queryClient = useQueryClient();

  const handleEditBooking = useMutation({
    mutationFn: editBooking,
    onError: onErrorHandler,
  });

  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  
  const redirectToAppointment = useCloseModal(
    isEditing
      ? `/dashboard/user-multiownership-appointment/${appointmentId}/bookings${from === "admin" ? "?from=admin" : ""}`
      : from === "admin" 
        ? `/dashboard/user-multiownership-appointment/ListAppointmentsAdmView`
        : `/dashboard/user-multiownership-appointment/ListAppointments`
  );

  function onSubmit(data: AppointmentEditBooking) {
    setIsLoading(true);
    setIsSubmitted(true);
    handleEditBooking.mutate(
      {
        appointmentId,
        booking: untransformedEditBookings({
          ...data,
          status: isEditing ? data.status.substring(0, 2) : "AC",
        }),
      },
      {
        onSuccess: async () => {
          queryClient.invalidateQueries({
            queryKey: ["getAppointmentBookingById"],
          });
          toast.success(
            `Reserva ${booking?.id} ${
              isEditing ? "editada" : "criada"
            } com sucesso!`
          );
          redirectToAppointment();
        },
      }
    );
  }

  const statusOptions = [
    { id: "AC", name: "AC - À confirmar" },
    { id: "CF", name: "CF - Confirmada" },
    { id: "CI", name: "CI - Checkin" },
    { id: "CO", name: "CO - Checkout" },
    { id: "NS", name: "NS - Noshow" },
    { id: "CL", name: "CL - Cancelada" },
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Grid container spacing={2} sx={{ 
          flexGrow: 1,
          backgroundColor: 'var(--form-container-bg)',
          borderRadius: 2,
          p: 3,
          border: '1px solid var(--form-input-border)'
        }}>
          <Grid xs={12} md={4}>
            <InputField
              label="Checkin"
              field="checkin"
              type="date"
              disabled={true}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <InputField
              label="Checkout"
              field="checkout"
              type="date"
              disabled={true}
            />
          </Grid>

          {isEditing && (
            <Grid xs={12} md={4}>
              <SelectField
                options={statusOptions}
                label="Status"
                field="status"
                defaultValue={"AC"}
                disabled={true}
              />
            </Grid>
          )}

          <Grid xs={12} marginTop={"1px"}>
            <RadioGroupField
              label="Tipo de uso"
              field="tipoUtilizacao"
              disabled={true}
            >
              <Radio value="UP" label="Uso Proprietário" />
              <Radio value="UC" label="Uso Convidado" />
            </RadioGroupField>
          </Grid>

          {isEditing && form.watch("tipoUtilizacao") != "I" && (
            <Grid xs={12} marginTop={"1px"}>
              <DynamicMultiForm
                title="Hóspedes"
                capacity={booking?.capacidade}
                verifyIfIsAdmin={false}
                name="guests"
                field={(index) => (
                  <HostsForm
                    index={index}
                    isDisabledMainHostDefault={
                      !booking?.tipoUtilizacao.includes("UC")
                    }
                  />
                )}
              />
            </Grid>
          )}
        </Grid>

        <Stack spacing={3}>
          <AlertError error={errors.root?.generalError?.message} />
        </Stack>

        <Stack
          flexDirection={"row"}
          gap={"10px"}
          justifyContent={"flex-end"}
          sx={{
            opacity: isLoading ? 0.2 : 1,
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <Button
            variant="outlined"
            color="danger"
            onClick={redirectToAppointment}
            sx={{
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
            }}
          >
            Sair
          </Button>
          <Button
            type="submit"
            sx={{
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
              backgroundColor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "var(--color-button-primary-hover)",
              },
            }}
          >
            {isEditing ? "Salvar" : "Confirmar"}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
