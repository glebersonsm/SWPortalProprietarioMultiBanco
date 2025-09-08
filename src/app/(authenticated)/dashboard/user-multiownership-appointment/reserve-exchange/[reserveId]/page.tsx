"use client";

import { useState, useEffect } from "react";
import {
  AvailabilityForExchange,
  ForExchange,
  ForUsageTypeExchange,
  getAccountsBank,
  sendConfirmationCode,
  getUserAppointmentById,
} from "@/services/querys/user-multiownership-appointments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { PeriodReserveExchange } from "@/utils/types/multiownership/appointments";
import { useRouter, useSearchParams } from "next/navigation";
import { useReservar } from "../../context.hook";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { formatWithSaturdayFormCheck } from "@/utils/dates";
import WithoutData from "@/components/WithoutData";
import RadioGroupField from "@/components/RadioGroupField";
import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormLabel,
  Grid,
  Modal,
  ModalDialog,
  ModalOverflow,
  Radio,
  Stack,
  Typography,
  Box,
  DialogTitle,
} from "@mui/joy";
import { getWeek } from "date-fns";
import CheckboxField from "@/components/CheckboxField";
import InputField from "@/components/InputField";
import DocumentInput from "@/components/DocumentInput";
import { getBankCodeType } from "./utils/bankCodeType";
import { ContratoModel } from "../../_components/ContratoModel";
import { AxiosError } from "axios";
import { Autocomplete, TextField } from "@mui/material";

export default function AppointmentsPage({
  params: { reserveId },
}: {
  params: { reserveId: string };
}) {
  const { reserva, owner } = useReservar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const [openModal, setOpenModal] = useState(false);
  const [openReleasePoolModal, setOpenReleasePoolModal] = useState(false);
  const [openContractModal, setOpenContractModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    SemanaId: number;
  } | null>(null);

  const [infoUserPixContaIdioma, _] = useState(() => {
    if (typeof window !== "undefined") {
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

  // Buscar dados do appointment por ID
  const { data: appointment } = useQuery({
    queryKey: ["getUserAppointmentById", reserveId, owner?.quotaId],
    queryFn: () => getUserAppointmentById(reserveId, owner?.quotaId),
    enabled: !!reserveId,
  });

  // Log dos dados do appointment
  useEffect(() => {
    console.log("Appointment:", appointment);
    console.log("Appointment year:", appointment?.year);
    if (appointment) {
      console.log("Appointment TipoUso:", appointment.TipoUso);
      console.log("Appointment bookings:", appointment.bookings);
      if (appointment.bookings && appointment.bookings.length > 0) {
        console.log("First booking tipoUtilizacao:", appointment.bookings[0].tipoUtilizacao);
      }
    }
  }, [appointment]);

  const tipoDocumento = (appointment?.pessoaTitular1Tipo || reserva.pessoaTitular1Tipo) === "J" ? "CNPJ" : "CPF";
  const defaultValue =
    accountsBank && accountsBank.length > 0 ? accountsBank[0].id : undefined;

  // Determinar o tipo de uso atual
  const tipoUsoAtual = appointment?.availableTypeName;

  const form = useForm({
    defaultValues: {
      tipoUtilizacao: tipoUsoAtual,
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
      hasSCPContract: appointment?.hasSCPContract ?? reserva.hasSCPContract ?? false,
      accountHolderName: appointment?.ownershipName ?? reserva.ownershipName ?? "",
      accountDocument: appointment?.documentOwnership ?? reserva.documentOwnership ?? "",
    },
  });

  // Definir valor padrão do tipo de uso quando appointment for carregado
  useEffect(() => {
    if (appointment && action === "usage-type" && tipoUsoAtual) {
      form.setValue("tipoUtilizacao", tipoUsoAtual);
      console.log("Tipo de uso atual definido no formulário:", tipoUsoAtual);
    }
  }, [appointment, action, form, tipoUsoAtual]);

  function getWeekOfYear(date: Date | string) {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return getWeek(parsedDate);
  }

  const { isLoading: isLoadingPeriod, data } = useQuery({
    queryKey: ["AvailabilityForExchange", { reserveId, year: appointment?.year }],
    queryFn: () =>
      AvailabilityForExchange({ 
        Agendamentoid: parseInt(reserveId),
        Ano: appointment?.year 
      }),
    enabled: parseInt(reserveId) > 0 && !!appointment?.year,
  });

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    toast.error(
      error.response?.data?.errors?.[0] ||
        "Ocorreu um erro inesperado. Por favor, tente novamente."
    );
  };

  const handleEditBooking = useMutation({
    mutationFn: action === "usage-type" ? ForUsageTypeExchange : ForExchange,
    onError: onErrorHandler,
  });

  const handleSendCodeForEmail = useMutation({
    mutationFn: sendConfirmationCode,
    onError: onErrorHandler,
  });

  function handleConfirmSelection(dataSel: { SemanaId: number }) {
    setSelectedPeriod(dataSel);
    setOpenModal(true);
  }

  function handleSubmit() {
    const { tipoUtilizacao } = form.getValues();

    if (tipoUtilizacao === "Pool") {
      if (appointment?.hasSCPContract ?? reserva.hasSCPContract) {
        setOpenReleasePoolModal(true);
      } else {
        setOpenContractModal(true);
      }
      return;
    }

    submitBooking({
      tipoUso: tipoUtilizacao,
      agendamentoId: parseInt(reserveId),
      trocaDeTipoUso: true,
      idIntercambiadora: appointment?.idIntercambiadora ?? reserva.idIntercambiadora,
      ...selectedPeriod,
    });
  }

  const handleFormSubmit = (formData: any) => {
    const payload: PeriodReserveExchange = {
      agendamentoId: parseInt(reserveId),
      tipoUso: formData.tipoUtilizacao,
      codigoBanco: formData.bankCode,
      agencia: formData.agency,
      contaNumero: formData.accountNumber,
      variacao: formData.variation,
      documentoTitularConta: formData.accountDocument,
      chavePix: formData.pixKey,
      tipoChavePix: formData.pixKeyType,
      preferencial: formData.preference,
      codigoVerificacao: formData.code,
      idIntercambiadora: appointment?.idIntercambiadora ?? reserva.idIntercambiadora,
      ...selectedPeriod,
    };

    submitBooking(payload);
  };

  const submitBooking = (dataPayload: PeriodReserveExchange) => {
    handleEditBooking.mutate(
      {
        ...dataPayload,
        ...selectedPeriod,
        AgendamentoId: parseInt(reserveId),
        idIntercambiadora: appointment?.idIntercambiadora ?? reserva.idIntercambiadora,
        tipoUso: dataPayload.tipoUso,
      },
      {
        onSuccess: () => {
          goBack();
          toast.success("Reserva realizada com sucesso!");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Erro ao realizar a reserva. Tente novamente."
          );
        },
      }
    );
    setOpenModal(false);
  };

  const from = searchParams.get("from");
  
  const goBack = () => {
    const returnPath = from === "admin" 
      ? "/dashboard/user-multiownership-appointment/ListAppointmentsAdmView"
      : "/dashboard/user-multiownership-appointment/ListAppointments";
    router.push(returnPath);
  };

  const isData = data !== undefined && data.length === 0;

  const handleRequestCode = () => {
    handleSendCodeForEmail.mutate(
      { appointmentId: parseInt(appointment?.appointmentId ?? reserva.appointmentId) },
      {
        onSuccess: (response) => {
          const success =
            (response as any).success === true ||
            (response as any).data?.success === true ||
            (response as any).data === true;
          if (!success) {
            const errorMessage =
              (response as any)?.data?.errors?.[0] ||
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

  const isButtonDisabled = (
    !(appointment?.hasSCPContract ?? reserva.hasSCPContract) &&
    (!form.formState.isValid ||
      !form.getValues("code") ||
      (infoUserPixContaIdioma?.podeInformarConta === 1 &&
        ((form.getValues("existAccounntBank") &&
          !form.getValues("accountId")) ||
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
        !(form.getValues("pixKey") && form.getValues("pixKeyType"))))
  );

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      maxWidth: '1200px', 
      mx: 'auto',
      minHeight: '100vh',
      backgroundColor: 'background.body'
    }}>
      {action === "usage-type" ? (
        <FormProvider {...form}>
          <Typography 
            level="h4" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            Alterar Tipo de Uso
          </Typography>

          <Card 
            variant="outlined" 
            sx={{ 
              mb: 4,
              borderRadius: 'lg',
              boxShadow: 'sm',
              '&:hover': {
                boxShadow: 'md'
              }
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 3,
                  color: 'text.primary',
                  fontWeight: 600
                }}
              >
                Informações do Agendamento
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <Typography level="body-sm" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Período:
                  </Typography>
                  <Typography level="body-md" sx={{ color: 'text.primary' }}>
                    {appointment?.initialDate && appointment?.finalDate ? 
                      `${formatWithSaturdayFormCheck(appointment.initialDate)} até ${formatWithSaturdayFormCheck(appointment.finalDate)}` : 
                      'Carregando...'}
                  </Typography>
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <Typography level="body-sm" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Tipo contrato:
                  </Typography>
                  <Typography level="body-md" sx={{ color: 'text.primary' }}>
                    {appointment?.coteName || ""}
                  </Typography>
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <Typography level="body-sm" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Unidade:
                  </Typography>
                  <Typography level="body-md" sx={{ color: 'text.primary' }}>
                    {appointment?.roomNumber || ""}
                  </Typography>
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <Typography level="body-sm" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Tipo de Semana:
                  </Typography>
                  <Typography level="body-md" sx={{ color: 'text.primary' }}>
                    {appointment?.weekType || ""}
                  </Typography>
                </Grid>
                
                <Grid xs={12} sm={6}>
                  <Typography level="body-sm" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Tipo de Uso Atual:
                  </Typography>
                  <Typography level="body-md" sx={{ color: 'text.primary' }}>
                    {appointment?.availableTypeName.includes('ropriet')  ? 'UP - Uso proprietário' : 
                     appointment?.availableTypeName.includes('vidad')  ? 'UC - Uso convidado' : 
                     appointment?.availableTypeName.includes('pool')  ? 'P - Pool' : 
                     appointment?.availableTypeName.includes('ntercambia') ? 'I - Intercambiadora' : 
                     appointment?.availableTypeName || ''}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mb: 4 }}>
              <RadioGroupField
                field="tipoUtilizacao"
                label="Selecione o novo tipo de uso:"
              >
                <Radio value="UP" label="UP - Uso proprietário" />
                <Radio value="UC" label="UC - Uso convidado" />
                <Radio value="I" label="I - Intercambiadora" />
              </RadioGroupField>
            </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            sx={{ mt: 3 }}
          >
            <Button 
              variant="outlined" 
              onClick={goBack}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                borderRadius: 'md',
                borderColor: 'neutral.300',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'neutral.400',
                  backgroundColor: 'neutral.50'
                }
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              loading={handleEditBooking.isPending}
              disabled={handleEditBooking.isPending}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                borderRadius: 'md',
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
                }
              }}
            >
              Confirmar
            </Button>
          </Stack>
        </FormProvider>
      ) : (
        <>
          <Typography 
            level="h4" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            Períodos Disponíveis para Troca
          </Typography>

          {isLoadingPeriod ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : isData ? (
            <WithoutData />
          ) : (
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }} 
              sx={{ 
                mb: 4,
                px: { xs: 0, sm: 1 }
              }}
            >
              {data?.map((item: any, index: number) => (
                <Grid xs={12} sm={6} md={4} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{
                      height: '100%',
                      borderRadius: 'lg',
                      boxShadow: 'sm',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 'md',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Typography 
                        level="title-md" 
                        sx={{ 
                          mb: 2,
                          color: 'text.primary',
                          fontWeight: 600
                        }}
                      >
                        Semana: {getWeekOfYear(item.semanaDataInicial)}
                      </Typography>
                      
                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          variant="soft" 
                          color="primary" 
                          sx={{ fontWeight: 500 }}
                        >
                          {item.tipoSemanaNome}
                        </Chip>
                        <Chip 
                          variant="soft" 
                          color="neutral" 
                          sx={{ fontWeight: 500 }}
                        >
                          {item.grupoTipoSemanaNome}
                        </Chip>
                      </Stack>
                      
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                          <strong>Inicial:</strong> {formatWithSaturdayFormCheck(item.semanaDataInicial)}
                        </Typography>
                        <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                          <strong>Final:</strong> {formatWithSaturdayFormCheck(item.semanaDataFinal)}
                        </Typography>
                      </Stack>
                      
                      <Button
                        fullWidth
                        onClick={() => handleConfirmSelection({ SemanaId: item.semanaId })}
                        sx={{
                          borderRadius: 'md',
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
                            transform: 'scale(1.02)'
                          }
                        }}
                      >
                        Selecionar
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Divider sx={{ my: 4 }} />
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
          >
            <Button 
              variant="outlined" 
              onClick={goBack}
              sx={{
                minWidth: { xs: '100%', sm: '120px' },
                borderRadius: 'md',
                borderColor: 'neutral.300',
                color: 'text.secondary',
                boxShadow: 'sm',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'neutral.400',
                  backgroundColor: 'neutral.50',
                  boxShadow: 'md'
                }
              }}
            >
              Voltar
            </Button>
          </Stack>
        </>
      )}

      {/* Modal de confirmação de período */}
      <Modal 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ModalOverflow>
          <ModalDialog 
            sx={{ 
              maxWidth: '500px',
              width: '90%',
              borderRadius: 'lg',
              boxShadow: 'xl'
            }}
          >
            <DialogTitle 
              sx={{ 
                textAlign: 'center',
                fontSize: 'lg',
                fontWeight: 600,
                color: 'text.primary',
                mb: 2
              }}
            >
              Confirmar Seleção
            </DialogTitle>
            
            <Typography 
              level="body-md" 
              sx={{ 
                textAlign: 'center',
                mb: 3,
                color: 'text.secondary'
              }}
            >
              Selecione o tipo de uso para esta reserva:
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <RadioGroupField
                field="tipoUtilizacao"
                label=""
              >
                <Radio value="UP" label="UP - Uso proprietário" />
                <Radio value="UC" label="UC - Uso convidado" />
                <Radio value="I" label="I - Intercambiadora" />
              </RadioGroupField>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setOpenModal(false)}
                sx={{ minWidth: '80px' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                loading={handleEditBooking.isPending}
                disabled={handleEditBooking.isPending}
                sx={{
                  minWidth: '80px',
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1e88e5)'
                  }
                }}
              >
                Confirmar
              </Button>
            </Stack>
          </ModalDialog>
        </ModalOverflow>
      </Modal>

      {/* Modal de Contrato */}
      {openContractModal && (
        <ContratoModel
          coteId={appointment?.coteId ?? reserva.coteId}
          periodCoteAvailabilityId={0}
          roomCondominiumId={appointment?.roomCondominiumId ?? reserva.roomCondominiumId}
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ModalOverflow>
          <ModalDialog 
            sx={{ 
              maxWidth: '600px',
              width: '90%',
              borderRadius: 'lg',
              boxShadow: 'xl'
            }}
          >
            <DialogTitle 
              sx={{ 
                textAlign: 'center',
                fontSize: 'lg',
                fontWeight: 600,
                color: 'text.primary',
                mb: 3
              }}
            >
              Liberação para Pool
            </DialogTitle>
            
            <Box sx={{ mb: 3 }}>
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                  <Stack spacing={3}>
                    <DocumentInput
                      field="accountDocument"
                      label="Documento do Titular da Conta"
                      maskType={tipoDocumento}
                    />

                    {infoUserPixContaIdioma?.podeInformarConta === 1 && (
                      <>
                        <Controller
                          name="bankCode"
                          control={form.control}
                          render={({ field: { onChange, value, ...field } }) => (
                            <Autocomplete
                              {...field}
                              options={getBankCodeType}
                              value={getBankCodeType.find(option => option.id === value) || null}
                              getOptionLabel={(option) => option.name}
                              onChange={(_, newValue) => onChange(newValue?.id || "")}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Banco"
                                  variant="outlined"
                                  fullWidth
                                  placeholder="Selecione o banco"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 'md'
                                    }
                                  }}
                                />
                              )}
                            />
                          )}
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                          <InputField
                            field="agency"
                            label="Agência"
                            required
                          />
                          <InputField
                            field="accountNumber"
                            label="Número da Conta"
                            required
                          />
                        </Stack>
                      </>
                    )}

                    {infoUserPixContaIdioma?.podeInformarPix === 1 && (
                      <CheckboxField
                        field="onlyPixKey"
                        label="Usar apenas chave PIX"
                      />
                    )}

                    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-end' }}>
                      <InputField
                        field="code"
                        label="Código de Confirmação"
                        required
                      />
                      <Button
                        variant="outlined"
                        onClick={handleRequestCode}
                        sx={{
                          minWidth: '120px',
                          height: '40px'
                        }}
                      >
                        Solicitar Código
                      </Button>
                    </Stack>

                    <CheckboxField
                      field="preference"
                      label="Marcar como preferencial"
                    />
                  </Stack>
                </form>
              </FormProvider>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => setOpenReleasePoolModal(false)}
                sx={{ width: "100%" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={form.handleSubmit(handleFormSubmit)}
                disabled={!!isButtonDisabled}
                sx={{ width: "100%" }}
              >
                Liberar
              </Button>
            </Stack>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </Box>
  );
}
