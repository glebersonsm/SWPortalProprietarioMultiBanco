import LoadingData from "@/components/LoadingData";
import SelectField from "@/components/SelectField";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";
import {
  getAppointmentInventories,
  releasePoolWeak,
} from "@/services/querys/multiownership/appointments";
import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalOverflow,
  Stack,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ReleasePoolModalProps = {
  appointmentId: number | string;
  shouldOpen: boolean;
};

type submitData = {
  inventoryId: number | undefined;
};
export default function ReleasePoolModal({
  appointmentId,
  shouldOpen,
}: ReleasePoolModalProps) {
  const closeModal = useCloseModal();

  const { isLoading, data } = useQuery({
    queryKey: ["getAppointmentInventories", { appointmentId, isPool: true }],
    queryFn: async () =>
      await getAppointmentInventories({ appointmentId, isPool: true }),
  });

  const defaultValue = data && data.length > 0 ? data[0].id : undefined;

  const form = useForm({
    defaultValues: {
      inventoryId: defaultValue,
    },
  });

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível liberar a semana para o pool nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleReleasePool = useMutation({
    mutationFn: releasePoolWeak,
    onError: onErrorHandler,
  });

    const onSubmit = (data: submitData) => {
    handleReleasePool.mutate(
      {
        appointmentId: appointmentId,
        inventoryId: Number(data.inventoryId),
      },
      {
        onSuccess: (response) => {
          const success = response || response.success || response.data.success;

          if (!success) {
            const errorMessage =
            response.response?.data?.errors?.[0] || "Houve um problema ao liberar o agendamento para o pool.";
            toast.error(errorMessage);
            
            return;
          }
  
          queryClient.invalidateQueries({
            queryKey: ["getAppointmentsMultiOwnership"],
          });
          toast.success(`Agendamento ${appointmentId} foi liberado para pool`);
          closeModal();
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.errors?.[0] ||
            "Não foi possível liberar o agendamento do pool neste momento. Tente novamente mais tarde.";
          toast.error(errorMessage);
        },
      }
    );
  };

  useEffect(() => {
    if (defaultValue !== undefined) {
      form.setValue("inventoryId", defaultValue);
    }
  }, [defaultValue, form]);

  return (
    <Modal open={shouldOpen} onClose={(event, reason) => {
      if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
        closeModal();
      }
    }}>
      <ModalOverflow >
        <ModalDialog>
          <DialogTitle>Liberar semana para o pool</DialogTitle>
          <DialogContent>
            {isLoading ? (
              <LoadingData />
            ) : (
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <SelectField
                    options={data}
                    label="Inventário"
                    field="inventoryId"
                    defaultValue={defaultValue}
                  />
                  <Stack flexDirection={"row"} gap={"10px"} marginTop={"10px"}>
                    <Button
                      variant="outlined"
                      color="danger"
                      onClick={closeModal}
                      sx={{
                        marginTop: "10px",
                        width: {
                          xs: "100%",
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
                        },
                      }}
                    >
                      Liberar
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            )}
          </DialogContent>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
}
