import LoadingData from "@/components/LoadingData";
import SelectField from "@/components/SelectField";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";
import {
  getAppointmentInventories,
  removePoolWeak,
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
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type RemovePoolModalProps = {
  appointmentId: string | number;
  shouldOpen: boolean;
};

type submitData = {
  inventoryId: number | string;
};
export default function RemovePoolModal({
  appointmentId,
  shouldOpen,
}: RemovePoolModalProps) {
  const closeModal = useCloseModal();

  const { isLoading, data } = useQuery({
    queryKey: ["getAppointmentInventories", { appointmentId, isPool: false }],
    queryFn: async () =>
      await getAppointmentInventories({ appointmentId, isPool: false }),
  });

  const defaultValue = data && data.length > 0 ? data[0].id : -1;

  const form = useForm({
    defaultValues: {
      inventoryId: defaultValue,
    },
  });

  React.useEffect(() => {
    if (data && data.length > 0) {
      form.setValue("inventoryId", data[0].id);
    }
  }, [data, form]);

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível retirar a semana do pool nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleRemovePool = useMutation({
    mutationFn: removePoolWeak,
    onError: onErrorHandler,
  });

  const onSubmit = (data: submitData) => {
    handleRemovePool.mutate(
      {
        appointmentId: appointmentId,
        inventoryId: data.inventoryId,
      },
      {
        onSuccess: (response) => {
          const success = response || response.success || response.data.success;
  
          if (!success) {
            const errorMessage =
              response?.data?.errors?.[0] ||
              "Houve um problema ao retirar o agendamento do pool.";
            toast.error(errorMessage);
            return;
          }
  
          queryClient.invalidateQueries({
            queryKey: ["getAppointmentsMultiOwnership"],
          });
          toast.success(`Agendamento ${appointmentId} foi retirado do pool`);
          closeModal();
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.errors?.[0] ||
            "Não foi possível retirar o agendamento do pool neste momento. Tente novamente mais tarde.";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Modal open={shouldOpen} onClose={closeModal}>
      <ModalOverflow>
        <ModalDialog>
          <DialogTitle>Retirar semana do pool</DialogTitle>
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
                    //defaultValue={defaultValue}
                    {...form.register("inventoryId")}
                  />
                  <Stack flexDirection={"row"} gap={"10px"} marginTop={"10px"}>
                    <Button
                      variant="outlined"
                      onClick={closeModal}
                      sx={{
                        marginTop: "10px",
                        width: {
                          xs: "100%",
                        },
                      }}
                    >
                      Cancelar
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
                      Retirar
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
