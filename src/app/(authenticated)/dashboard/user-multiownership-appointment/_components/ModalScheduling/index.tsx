import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  ModalDialog,
  ModalOverflow,
  Radio,
  Stack,
  Grid,
  DialogTitle,
  FormLabel,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useCloseModal from "@/hooks/useCloseModal";
import LoadingData from "@/components/LoadingData";
import WithoutData from "@/components/WithoutData";
import {
  AvailabilityForExchange,
  getAccountsBank,
  IncludeWeekUser,
  sendConfirmationCode,
} from "@/services/querys/user-multiownership-appointments";
import { Owner } from "@/utils/types/multiownership/owners";
import {
  PeriodReserveList,
  TypeIncludeWeekUserDataBody,
} from "@/utils/types/multiownership/appointments";
import { getWeek } from "date-fns";
import { formatWithSaturdayFormCheck } from "@/utils/dates";
import { FormProvider, useForm } from "react-hook-form";
import RadioGroupField from "@/components/RadioGroupField";
import { AxiosError } from "axios";
import { ContratoModel } from "../ContratoModel";
import InputField from "@/components/InputField";
import DocumentInput from "@/components/DocumentInput";
import CheckboxField from "@/components/CheckboxField";
import { Autocomplete, TextField } from "@mui/material";
import { getBankCodeType } from "../ReleasePoolModal/utils/bankCodeType";
import SelectField from "@/components/SelectField";

interface Props {
  owner: Owner;
  shouldOpen: boolean;
}

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function getWeekOfYear(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return getWeek(parsedDate);
}

const thereIsLocalStorage = typeof window != "undefined" && window.localStorage;

export const ModalSchedulingUser = ({ owner, shouldOpen }: Props) => {
  const [openReleasePoolModal, setOpenReleasePoolModal] = useState(false);
  const [openContractModal, setOpenContractModal] = useState(false);
  const closeModal = useCloseModal();
  const router = useRouter();
  const queryClient = useQueryClient();
  const anoAtual = new Date().getFullYear();
  const anoProximo = anoAtual + 1;
  const [yearSelected, setYearSelected] = useState<number>();
  const [selectedWeek, setSelectedWeek] = useState<PeriodReserveList | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const { data: accountsBank } = useQuery({
    queryKey: ["getUsergetAccountsBank"],
    queryFn: async () => await getAccountsBank(),
  });

  const { data: disponibilidade, isLoading } = useQuery({
    queryKey: ["AvailabilityWeekModalScheduling", owner.quotaId, yearSelected],
    queryFn: () =>
      yearSelected != null
        ? AvailabilityForExchange({
            CotaAccessCenterId: owner.quotaId,
            Ano: yearSelected,
          })
        : Promise.resolve(null),
    enabled: shouldOpen && yearSelected != null,
  });

  // 🔧 Detecta CPF/CNPJ pelo documento do titular (11 dígitos = CPF, 14 = CNPJ)
  const onlyDigits = (owner?.clientDocument || "").replace(/\D/g, "");
  const tipoDocumento = onlyDigits.length > 11 ? "CNPJ" : "CPF";

  const defaultValue =
    accountsBank && accountsBank.length > 0 ? accountsBank[0].id : undefined;
  const existsAcounts = accountsBank != undefined && accountsBank?.length > 0;

  const form = useForm({
    defaultValues: {
      tipoUtilizacao: "",
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
      hasSCPContract: owner.hasSCPContract ?? false,
      accountHolderName: owner.clientName ?? "",
      accountDocument: owner.clientDocument ?? "",
    },
  });

  const useExistingBankAccount = form.watch("existAccounntBank");

  const mutationSwapWeek = useMutation({
    mutationFn: (data: TypeIncludeWeekUserDataBody) => IncludeWeekUser(data),
    onSuccess: () => {
      toast.success("Semana reservada com sucesso!");
      // Invalidar o cache para atualizar a lista de agendamentos
      queryClient.invalidateQueries({
        queryKey: ["getUserAppointmentsMultiOwnership"]
      });
      closeModal();
      router.push("/dashboard/user-multiownership-contracts");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0] ||
        error?.response?.data?.message ||
        error?.message ||
        "Erro ao reservar a semana. Por favor, tente novamente.";
      toast.error(errorMessage);
    },
  });

  const handleSelectYear = (ano: number) => {
    setYearSelected(ano);
  };

  const handleConfirmChangeWeek = () => {
    const { tipoUtilizacao } = form.getValues();

    // if (tipoUtilizacao === "Pool") {
    //   if (owner.hasSCPContract) {
    //     setOpenReleasePoolModal(true);
    //   } else {
    //     setOpenContractModal(true);
    //   }
    //   return;
    // }

    submitBooking({
      cotaId: owner.quotaId,
      uhCondominioId: owner.enterpriseId,
      cotaPortalNome: owner.fractionName,
      cotaPortalCodigo: owner.fractionCode,
      grupoCotaPortalNome: owner.quotaGroupNome,
      numeroImovel: owner.propertyNumber,
      cotaProprietarioId: owner.clientId,
      tipoUtilizacao: tipoUtilizacao,
      ...selectedWeek,
    });
  };

  const handleFormSubmit = (formData: any) => {
    const payload: any = {
      cotaId: owner.quotaId,
      uhCondominioId: owner.enterpriseId,
      cotaPortalNome: owner.fractionName,
      cotaPortalCodigo: owner.fractionCode,
      grupoCotaPortalNome: owner.quotaGroupNome,
      numeroImovel: owner.propertyNumber,
      cotaProprietarioId: owner.clientId,
      tipoUtilizacao: formData.tipoUtilizacao,
      codigoBanco: formData.bankCode,
      agencia: formData.agency,
      contaNumero: formData.accountNumber,
      variacao: formData.variation,
      documentoTitularConta: formData.accountDocument,
      chavePix: formData.pixKey,
      tipoChavePix: formData.pixKeyType,
      preferencial: formData.preference,
      codigoVerificacao: formData.code,
      ...selectedWeek,
    };

    submitBooking(payload);
  };

  const submitBooking = (data: any) => {
    if (selectedWeek) {
      mutationSwapWeek.mutate(data);
    }
  };

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    toast.error(
      error.response?.data?.errors?.[0] ||
        "Ocorreu um erro inesperado. Por favor, tente novamente."
    );
  };

  const handleSendCodeForEmail = useMutation({
    mutationFn: sendConfirmationCode,
    onError: onErrorHandler,
  });

  const handleRequestCode = () => {
    handleSendCodeForEmail.mutate(
      { appointmentId: owner.clientId },
      {
        onSuccess: (response: any) => {
          const success =
            response?.success === true ||
            response?.data?.success === true ||
            response?.data === true;
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
      }
    );
  };

  const handleContractAccepted = () => {
    setOpenContractModal(false);
    setOpenReleasePoolModal(true);
  };

  const isButtonDisabled = !owner.hasSCPContract &&
    ((!form.formState.isValid ||
    !form.getValues("code")) ||
    (infoUserPixContaIdioma?.podeInformarConta === 1 &&
      ((form.getValues("existAccounntBank") && !form.getValues("accountId")) ||
        (!form.getValues("existAccounntBank") &&
          !form.getValues("onlyPixKey") &&
          !(
            form.getValues("bankCode") &&
            form.getValues("agency") &&
            form.getValues("accountNumber") &&
            form.getValues("accountDocument")
          )))) ||
    (infoUserPixContaIdioma?.podeInformarPix === 1 &&
      form.getValues("onlyPixKey") &&
      !(form.getValues("pixKey") && form.getValues("pixKeyType"))));

  return (
    <>
      <Modal open={shouldOpen} onClose={closeModal}>
        <ModalOverflow>
          <ModalDialog
            sx={{
              width: { xs: "90%", sm: "80%", md: "70%" },
              maxWidth: "1080px",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              <Typography
                level="h4"
                sx={{
                  color: "var(--color-title)",
                  textAlign: "center",
                  width: "100%",
                  fontWeight: "bold",
                }}
              >
                Incluir agendamento
              </Typography>
              <IconButton
                variant="plain"
                onClick={closeModal}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography>
                Selecione o ano desejado para consultar as disponibilidades
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  my: 3,
                }}
              >
                {[anoAtual, anoProximo].map((ano) => (
                  <Button
                    key={ano}
                    onClick={() => handleSelectYear(ano)}
                    disabled={isLoading}
                    sx={{
                      width: "180px",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      backgroundColor:
                        yearSelected === ano
                          ? "var(--color-button-primary)"
                          : "transparent",
                      color:
                        yearSelected === ano
                          ? "var(--color-button-text)"
                          : "var(--color-button-primary)",
                      border:
                        yearSelected === ano
                          ? "none"
                          : "2px solid var(--color-button-primary)",
                      "&:hover": {
                        backgroundColor: "var(--color-button-primary-hover)",
                        color: "var(--color-button-text)",
                      },
                    }}
                  >
                    {ano}
                  </Button>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                {isLoading ? (
                  <Grid xs={12}>
                    <LoadingData />
                  </Grid>
                ) : disponibilidade?.length ? (
                  disponibilidade.map((item) => (
                    <Grid xs={12} sm={6} md={4} key={item.semanaId}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography>
                            Semana: {getWeekOfYear(item.semanaDataInicial)}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            <Chip variant="soft" color="primary">
                              {item.tipoSemanaNome}
                            </Chip>
                            <Chip variant="soft" color="neutral">
                              {item.grupoTipoSemanaNome}
                            </Chip>
                          </Box>
                          <Typography>Período:</Typography>
                          <Typography>
                            Inicial: {formatarData(item.semanaDataInicial)}
                          </Typography>
                          <Typography>
                            Final:{" "}
                            {formatWithSaturdayFormCheck(item.semanaDataFinal)}
                          </Typography>
                          <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Button
                              onClick={() => {
                                setSelectedWeek(item);
                                setConfirmOpen(true);
                              }}
                              fullWidth
                              sx={{
                                backgroundColor: "var(--color-button-primary)",
                                color: "var(--color-button-text)",
                                fontWeight: "bold",
                                "&:hover": {
                                  backgroundColor:
                                    "var(--color-button-primary-hover)",
                                },
                              }}
                            >
                              Selecionar Período
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid xs={12}>
                    {yearSelected ? (
                      <Typography color="danger" textAlign="center">
                        Nenhuma semana disponível foi encontrada.
                      </Typography>
                    ) : null}
                    <WithoutData />
                  </Grid>
                )}
              </Grid>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={closeModal}
                sx={{
                  border: "1.5px solid var(--color-button-exit-border)",
                  color: "var(--color-button-exit-text)",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "var(--color-button-exit-hover-bg)",
                    color: "var(--color-button-exit-hover-text)",
                    borderColor: "var(--color-button-exit-hover-border)",
                  },
                }}
              >
                Sair
              </Button>
            </Box>
          </ModalDialog>
        </ModalOverflow>
      </Modal>

      {/* Modal de confirmação */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <ModalDialog>
          <Typography
            level="h4"
            sx={{
              textAlign: "center",
              color: "var(--color-title)",
              fontWeight: "bold",
            }}
          >
            Favor escolher o tipo de utilização desejado
          </Typography>
          <Box>
            <FormProvider {...form}>
              <RadioGroupField label="Tipo de uso" field="tipoUtilizacao">
                <Radio value="UP" label="Uso Proprietário" />
                <Radio value="UC" label="Uso Convidado" />
                <Radio value="I" label="Intercambiadora" />
                {owner.hasSCPContract && (
                  <Radio value="Pool" label="Pool de locação" />
                )}
              </RadioGroupField>
            </FormProvider>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => setConfirmOpen(false)}
                sx={{
                  color: "var(--color-button-exit-text)",
                  border: "1px solid var(--color-button-exit-border)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  "&:hover": {
                    backgroundColor: "var(--color-button-exit-hover-bg)",
                    color: "var(--color-button-exit-hover-text)",
                    borderColor: "var(--color-button-exit-hover-border)",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                onClick={handleConfirmChangeWeek}
                sx={{
                  backgroundColor: "var(--color-button-primary)",
                  color: "var(--color-button-text)",
                  border: "1px solid var(--color-button-primary-border)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  "&:hover": {
                    backgroundColor: "var(--color-button-primary-hover)",
                  },
                }}
              >
                Confirmar
              </Button>
            </Stack>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Modal de Contrato */}
      {openContractModal && (
        <ContratoModel
          coteId={owner.quotaId}
          periodCoteAvailabilityId={0}
          roomCondominiumId={owner.enterpriseId}
          open={openContractModal}
          handleSubmitClose={handleContractAccepted}
          handleClose={() => setOpenContractModal(false)}
          language={infoUserPixContaIdioma?.idioma}
        />
      )}

      {/* Modal de Liberação para Pool */}
      <Modal
        open={openReleasePoolModal}
        onClose={() => setOpenReleasePoolModal(false)}
      >
        <ModalOverflow>
          <ModalDialog size="lg">
            <DialogTitle>Liberar semana para o pool</DialogTitle>
            <Divider />
            <Box sx={{ mt: 2 }}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid xs={12}>
                      <InputField
                        label="Nome do primeiro titular"
                        field="accountHolderName"
                        disabled
                      />
                    </Grid>

                    <Grid xs={12}>
                      <DocumentInput
                        field="accountDocument"
                        label="Documento do primeiro titular"
                        disabled
                        maskType={tipoDocumento}
                      />
                    </Grid>

                    <Grid xs={12}>
                      <Divider />
                    </Grid>

                    {/* {infoUserPixContaIdioma?.podeInformarConta === 1 && existsAcounts && (
                      <Grid xs={12}>
                        <CheckboxField
                          label="Usar conta bancária existente"
                          field="existAccounntBank"
                        />
                      </Grid>
                    )} */}

                    {!useExistingBankAccount &&
                      !existsAcounts &&
                      infoUserPixContaIdioma?.podeInformarConta === 1 &&
                      infoUserPixContaIdioma?.idioma === 0 && (
                        <Grid container spacing={2}>
                          <Grid xs={6}>
                            <FormLabel
                              sx={{
                                color: "primary.solidHoverBg",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                mb: 1,
                              }}
                            >
                              Selecione o banco
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
                              onChange={(_, value) => form.setValue("bankCode", value?.id || "")}
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
                                    "& .MuiInputBase-root": {
                                      height: "40px",
                                    },
                                  }}
                                />
                              )}
                            />
                          </Grid>
                          <Grid xs={6}>
                            <InputField
                              label="Agência (com dígito, se houver)"
                              field="agency"
                              placeholder="Ex: 1234-5"
                            />
                          </Grid>
                          <Grid xs={6}>
                            <InputField
                              label="Conta (com dígito)"
                              field="accountNumber"
                              placeholder="Ex: 123456-7"
                            />
                          </Grid>
                          <Grid xs={12}>
                            <SelectField
                              label="Tipo de conta"
                              field="variation"
                              options={[
                                { name: "Corrente", id: "corrente" },
                                { name: "Poupança", id: "poupanca" },
                              ]}
                            />
                          </Grid>
                          <Grid xs={12}>
                            <CheckboxField
                              label="Preferencial"
                              field="preference"
                            />
                          </Grid>
                        </Grid>
                      )}

                    <Grid xs={6} alignContent={"end"}>
                      <Button
                        onClick={handleRequestCode}
                        sx={{
                          backgroundColor: "var(--color-button-primary)",
                          color: "var(--color-button-text)",
                          fontWeight: "bold",
                          width: "100%",
                          height: "100%",
                          "&:hover": {
                            backgroundColor:
                              "var(--color-button-primary-hover)",
                          },
                        }}
                      >
                        Clique aqui para receber um código de confirmação por
                        email
                      </Button>
                    </Grid>

                    <Grid xs={6}>
                      <InputField
                        label="Código de confirmação"
                        field="code"
                        placeholder="Informe o código recebido no seu email"
                      />
                    </Grid>
                  </Grid>

                  <Stack flexDirection={"row"} gap={"10px"} mt={2}>
                    <Button
                      onClick={() => setOpenReleasePoolModal(false)}
                      sx={{
                        border: "1.5px solid var(--color-button-exit-border)",
                        color: "var(--color-button-exit-text)",
                        fontWeight: "bold",
                        backgroundColor: "transparent",
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "var(--color-button-exit-hover-bg)",
                          color: "var(--color-button-exit-hover-text)",
                          borderColor: "var(--color-button-exit-hover-border)",
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="plain"
                      sx={{
                        width: "100%",
                        backgroundColor: "var(--color-button-primary)",
                        color: "var(--color-button-text)",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "var(--color-button-primary-hover)",
                        },
                      }}
                      disabled={!!isButtonDisabled}
                    >
                      Liberar
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </Box>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
};
