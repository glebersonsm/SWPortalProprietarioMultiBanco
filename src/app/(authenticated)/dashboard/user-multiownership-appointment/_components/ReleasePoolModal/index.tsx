import CheckboxField from "@/components/CheckboxField";
import LoadingData from "@/components/LoadingData";
import SelectField from "@/components/SelectField";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";
import {
  getAccountsBank,
  releaseMyWeakForPool,
  sendConfirmationCode,
} from "@/services/querys/user-multiownership-appointments";
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  Modal,
  ModalDialog,
  ModalOverflow,
  Stack,
} from "@mui/joy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "@/components/InputField";
import { getBankCodeType } from "./utils/bankCodeType";
import DocumentInput from "@/components/DocumentInput";
import { UserAppointmentMultiOwnership } from "@/utils/types/user-reservesMultiOwnership";
import { Autocomplete, TextField } from "@mui/material";
import { ContratoModel } from "../ContratoModel";

type ReleasePoolModalProps = {
  appointmentId: number;
  coteId: number;
  periodCoteAvailabilityId: number;
  hasSCPContract: boolean;
  roomCondominiumId: number;
  shouldOpen: boolean;
  appointment: UserAppointmentMultiOwnership;
};

type submitData = {
  accountId?: string | number;
  agency?: string;
  agencyDigit?: string;
  accountNumber?: string;
  pixKeyType?: string;
  pixKey?: string;
  code?: string;
  preference?: boolean;
  accountDocument?: string;
  bankCode?: string;
};

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export default function ReleasePoolModal({
  appointmentId,
  coteId,
  periodCoteAvailabilityId,
  roomCondominiumId,
  hasSCPContract,
  shouldOpen,
  appointment,
}: ReleasePoolModalProps) {
  const closeModal = useCloseModal();
  const [showForm, setShowForm] = useState(hasSCPContract);

  const [infoUserPixContaIdioma, _] = useState(() => {
    if (thereIsLocalStorage) {
      const item = localStorage.getItem("info_user_pix_conta_idioma");
      if (item) {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const { isLoading, data: accountsBank } = useQuery({
    queryKey: ["getUsergetAccountsBank"],
    queryFn: async () => await getAccountsBank(),
  });

  const tipoDocumento = appointment.pessoaTitular1Tipo === "J" ? "CNPJ" : "CPF";

  const defaultValue =
    accountsBank && accountsBank.length > 0 ? accountsBank[0].id : undefined;

  const form = useForm({
    defaultValues: {
      accountId: defaultValue,
      existAccounntBank: false,
      onlyPixKey: false,
      bankCode: "",
      agency: "",
      accountNumber: "",
      pixKeyType: "",
      pixKey: "",
      code: "",
      preference: false,
      variation: "-1",
      hasSCPContract: appointment.hasSCPContract ?? false,
      accountHolderName: appointment.ownershipName ?? "",
      accountDocument: appointment.documentOwnership ?? "",
    },
  });

  const useExistingBankAccount = form.watch("existAccounntBank");
  const useOnlyPixKey = form.watch("onlyPixKey");
  const existsAcounts = accountsBank != undefined && accountsBank?.length > 0;

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
    mutationFn: releaseMyWeakForPool,
    onError: onErrorHandler,
  });

  const handleSendCodeForEmail = useMutation({
    mutationFn: sendConfirmationCode,
    onError: onErrorHandler,
  });

  const onSubmit = (data: submitData) => {
    const dataUsingOnlyPixKey = {
      pixKeyType: data.pixKeyType,
      pixKey: data.pixKey,
      code: data.code,
    };

    const dataFull = { ...data };
    const dataForSend = useOnlyPixKey ? dataUsingOnlyPixKey : dataFull;

    handleReleasePool.mutate(
      {
        ...dataForSend,
        appointmentId: appointmentId,
      },
      {
        onSuccess: (response) => {
          const success = response || response.data.success || response.success;
          if (!success) {
            const errorMessage =
              response.response?.data?.errors?.[0] ||
              "Houve um problema ao liberar o agendamento para o pool.";
            toast.error(errorMessage);
            return;
          }

          queryClient.invalidateQueries({
            queryKey: ["getUserAppointmentsMultiOwnership"],
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

  const handleRequestCode = () => {
    handleSendCodeForEmail.mutate(
      { appointmentId },
      {
        onSuccess: (response) => {
          const success =
            response.success === true ||
            response.data?.success === true ||
            response.data === true;
          if (!success) {
            const errorMessage =
              response?.data?.errors?.[0] ||
              "Houve uma falha no envio do código de confirmação por email.";
            toast.error(errorMessage);
            return;
          }

          toast.success(
            "Favor acesse o seu email para pegar o código recebido, necessário para confirmação dessa operação"
          );
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.errors?.[0] ||
            "Não foi possível enviar o código de confirmação. Favor tente novamente mais tarde.";
          toast.error(errorMessage);
        },
      }
    );
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (defaultValue !== undefined) {
      form.setValue("accountId", defaultValue);
    }
  }, [defaultValue, form]);

  const handleButtonClick = async () => {
    const {
      code,
      existAccounntBank,
      accountId,
      onlyPixKey,
      pixKey,
      pixKeyType,
      bankCode,
      agency,
      accountNumber,
    } = form.getValues();

    const isValid = await form.trigger(undefined, { shouldFocus: true });

    if (!isValid) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!code && !hasSCPContract) {
      toast.error("Por favor, informe o código de confirmação.");
      return;
    }

    if (
      !hasSCPContract &&
      infoUserPixContaIdioma !== null &&
      infoUserPixContaIdioma != undefined &&
      infoUserPixContaIdioma?.podeInformarConta === 1 &&
      ((existAccounntBank && !accountId) ||
        (onlyPixKey && !(pixKey && pixKeyType)) ||
        (!existAccounntBank &&
          !onlyPixKey &&
          !(bankCode && agency && accountNumber)))
    ) {
      toast.error(
        "Por favor, preencha as informações de pagamento corretamente."
      );
      return;
    }

    form.handleSubmit(onSubmit)();
  };

  const isButtonEnabled =
    hasSCPContract || (form.formState.isValid &&
    ((infoUserPixContaIdioma?.podeInformarPix === 1 &&
        form.getValues("onlyPixKey") &&
        (form.getValues("pixKey") && form.getValues("pixKeyType")) && form.getValues("code")) ||
    ((infoUserPixContaIdioma.podeInformarConta === 1 || infoUserPixContaIdioma?.idioma === 0) && 
      form.getValues("code") &&
      (((form.getValues("existAccounntBank") && form.getValues("accountId")) ||
          (!form.getValues("existAccounntBank") &&
            (form.getValues("bankCode") &&
              form.getValues("agency") &&
              form.getValues("accountNumber") &&
              form.getValues("accountDocument")
            )))))));

  if (!hasSCPContract && !showForm) {
    return (
      <ContratoModel
        coteId={coteId}
        periodCoteAvailabilityId={periodCoteAvailabilityId}
        roomCondominiumId={roomCondominiumId}
        open={shouldOpen}
        handleSubmitClose={() => setShowForm(true)}
        handleClose={closeModal}
        language={infoUserPixContaIdioma?.idioma}
      />
    );
  }

  return (
    <>
      <Modal
        open={shouldOpen && showForm}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            closeModal();
          }
        }}
      >
        <ModalOverflow>
          <ModalDialog sx={{ width: "800px" }}>
            <DialogTitle>Liberar semana para o pool</DialogTitle>
            <Box>
              {isLoading && <LoadingData />}
              {!isLoading && (
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    style={{ width: "100%" }}
                  >
                    <Grid container spacing={2}>
                      {!hasSCPContract &&
                      ((infoUserPixContaIdioma !== null &&
                        infoUserPixContaIdioma !== undefined &&
                        infoUserPixContaIdioma?.podeinformarconta == 1) ||
                        infoUserPixContaIdioma?.idioma == 0) ? (
                        <Grid container spacing={2}>
                          <Grid xs={12} md={6}>
                            <InputField
                              label="Nome do primeiro titular"
                              field="accountHolderName"
                              disabled
                            />
                          </Grid>

                          <Grid xs={12} md={6}>
                            <DocumentInput
                              field="accountDocument"
                              label="Documento do primeiro titular"
                              disabled
                              maskType={tipoDocumento}
                            />
                          </Grid>

                          <Grid xs={12}>
                            <FormLabel
                              sx={{
                                color: "primary.solidHoverBg",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                mb: 1,
                              }}
                            >
                              Banco
                            </FormLabel>
                            <Autocomplete
                              {...form.register("bankCode")}
                              options={getBankCodeType}
                              sx={{
                                color: "primary.solidHoverBg",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                              }}
                              onChange={(_, value) => 
                                form.setValue("bankCode", value?.id || "")
                              }
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"

                                  sx={{
                                    color: "primary.solidHoverBg",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                  }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid xs={12} md={3}>
                            <InputField
                              label="Agência"
                              field="agency"
                              placeholder="Ex: 1234-5"
                            />
                          </Grid>
                          <Grid xs={12} md={3}>
                            <InputField
                              label="Conta"
                              field="accountNumber"
                              placeholder="Ex: 123456-7"
                            />
                          </Grid>
                          <Grid xs={12} md={6}>
                            <SelectField
                              label="Tipo de conta"
                              field="variation"
                              options={[
                                { name: "Corrente", id: "corrente" },
                                { name: "Poupança", id: "poupanca" },
                              ]}
                            />
                          </Grid>
                          <Grid xs={12} md={12}>
                            <CheckboxField
                              label="Preferencial"
                              field="preference"
                            />
                          </Grid>
                        </Grid>
                      ) : (
                        <p>Clique em liberar para confirmar a operação.</p>
                      )}
                      <Grid xs={12}>
                        <Divider />
                      </Grid>

                      {/* {(!hasSCPContract && (infoUserPixContaIdioma.podeInformarConta === 1 || 
                        infoUserPixContaIdioma.idioma === 0)) &&
                        existsAcounts && (
                          <Grid xs={12}>
                            <CheckboxField
                              label="Usar conta bancária existente"
                              field="existAccounntBank"
                            />
                          </Grid>
                        )} */}

                      {!hasSCPContract && (
                        <Grid xs={6} alignContent={"end"}>
                          <Button
                            onClick={handleRequestCode}
                            sx={{
                              backgroundColor: "var(--color-button-primary)",
                              color: "var(--color-button-text)",
                              fontWeight: "bold",
                              width: {
                                xs: "100%",
                                height: "100%",
                              },
                              "&:hover": {
                                backgroundColor:
                                  "var(--color-button-primary-hover)",
                              },
                            }}
                          >
                            Clique aqui para receber um código de confirmação
                            por email
                          </Button>
                        </Grid>
                      )}

                      {!hasSCPContract && (
                        <Grid xs={6}>
                          <InputField
                            label="Código de confirmação"
                            field="code"
                            placeholder="Informe o código recebido no seu email"
                          />
                        </Grid>
                      )}
                    </Grid>

                    <Stack flexDirection={"row"} gap={"10px"} mt={2}>
                      <Button
                        onClick={closeModal}
                        sx={{
                          width: "100%",
                          backgroundColor: "transparent",
                          color: "var(--color-button-exit-text)",
                          border: "1px solid var(--color-button-exit-border)",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor:
                              "var(--color-button-exit-hover-bg)",
                            color: "var(--color-button-exit-hover-text)",
                            borderColor: "var(--color-button-exit-hover-border)",
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleButtonClick}
                        type="button"
                        disabled={!isButtonEnabled}
                        sx={{
                          width: "100%",
                          backgroundColor: "var(--color-button-primary)",
                          color: "var(--color-button-text)",
                          fontWeight: "bold",
                          "&:hover": {
                            backgroundColor:
                              "var(--color-button-primary-hover)",
                          },
                        }}
                      >
                        Liberar
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              )}
            </Box>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
}
