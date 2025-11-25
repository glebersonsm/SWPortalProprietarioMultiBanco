"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Box,
  IconButton,
  Grid,
  Card,
  Typography,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import {
  createRegraPaxFree,
  editRegraPaxFree,
} from "@/services/querys/regraPaxFree";
import { RegraPaxFree, RegraPaxFreeConfiguracao } from "@/utils/types/regraPaxFree";
import { toast } from "react-toastify";

type RegraPaxFreeFormProps = {
  open: boolean;
  onClose: () => void;
  regra: RegraPaxFree | null;
  onSuccess: () => void;
};

// Componente interno para renderizar cada configuração com label dinâmico
function ConfiguracaoItem({
  index,
  onRemove,
  disabled,
}: {
  index: number;
  onRemove: () => void;
  disabled: boolean;
}) {
  const tipoOperadorIdade = useWatch({
    name: `configuracoes.${index}.tipoOperadorIdade`,
    defaultValue: "<=",
  });

  const idadeLabel =
    tipoOperadorIdade === ">="
      ? "Idade mínima do pax free (anos)"
      : "Idade máxima do pax free (anos)";

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: "8px",
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            level="title-sm"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
            }}
          >
            Configuração {index + 1}
          </Typography>
          <IconButton
            size="sm"
            color="danger"
            variant="soft"
            onClick={onRemove}
            disabled={disabled}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={2}>
            <InputField
              field={`configuracoes.${index}.quantidadeAdultos`}
              label="Quantidade Adulto(s) Pagante(s)"
              type="number"
              required
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12} sm={6} md={2}>
            <SelectField
              field={`configuracoes.${index}.tipoOperadorIdade`}
              label="Operador de Idade"
              required
              disabled={disabled}
              options={[
                { id: "<=", name: "Inferior ou igual (<=)" },
                { id: ">=", name: "Superior ou igual (>=)" },
              ]}
            />
          </Grid>
          <Grid xs={12} sm={6} md={2}>
            <InputField
              field={`configuracoes.${index}.idadeMaximaAnos`}
              label={idadeLabel}
              type="number"
              required
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <SelectField
              field={`configuracoes.${index}.tipoDataReferencia`}
              label="Data de Referência"
              required
              disabled={disabled}
              options={[
                { id: "RESERVA", name: "Data da Reserva" },
                { id: "CHECKIN", name: "Data de Check-in" },
              ]}
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <InputField
              field={`configuracoes.${index}.quantidadePessoasFree`}
              label="Quantidade pax Free"
              type="number"
              required
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Stack>
    </Card>
  );
}

type RegraPaxFreeFormData = {
  id?: number;
  nome: string;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
  configuracoes: Array<{
    id?: number;
    quantidadeAdultos?: number;
    quantidadePessoasFree?: number;
    idadeMaximaAnos?: number;
    tipoOperadorIdade?: string;
    tipoDataReferencia?: string;
  }>;
  removerConfiguracoesNaoEnviadas?: boolean;
};

export default function RegraPaxFreeForm({
  open,
  onClose,
  regra,
  onSuccess,
}: RegraPaxFreeFormProps) {
  const [activeTab, setActiveTab] = useState(0);

  const form = useForm<RegraPaxFreeFormData>({
    defaultValues: {
      id: undefined,
      nome: "",
      dataInicioVigencia: "",
      dataFimVigencia: "",
      configuracoes: [],
      removerConfiguracoesNaoEnviadas: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "configuracoes",
  });

  useEffect(() => {
    if (open) {
      if (regra) {
        form.reset({
          id: regra.id,
          nome: regra.nome || "",
          dataInicioVigencia: regra.dataInicioVigencia
            ? regra.dataInicioVigencia.split("T")[0]
            : "",
          dataFimVigencia: regra.dataFimVigencia
            ? regra.dataFimVigencia.split("T")[0]
            : "",
          configuracoes:
            regra.configuracoes && regra.configuracoes.length > 0
              ? regra.configuracoes.map((config) => ({
                  id: config.id,
                  quantidadeAdultos: config.quantidadeAdultos,
                  quantidadePessoasFree: config.quantidadePessoasFree,
                  idadeMaximaAnos: config.idadeMaximaAnos,
                  tipoOperadorIdade: config.tipoOperadorIdade || "<=",
                  tipoDataReferencia: config.tipoDataReferencia || "RESERVA",
                }))
              : [],
          removerConfiguracoesNaoEnviadas: false,
        });
      } else {
        form.reset({
          id: undefined,
          nome: "",
          dataInicioVigencia: "",
          dataFimVigencia: "",
          configuracoes: [],
          removerConfiguracoesNaoEnviadas: false,
        });
      }
      setActiveTab(0);
    }
  }, [open, regra, form]);

  const mutation = useMutation({
    mutationFn: regra
      ? (data: RegraPaxFreeFormData) =>
          editRegraPaxFree({
            regra: {
              id: data.id!,
              nome: data.nome,
              dataInicioVigencia: data.dataInicioVigencia || undefined,
              dataFimVigencia: data.dataFimVigencia || undefined,
              configuracoes: data.configuracoes,
              removerConfiguracoesNaoEnviadas: data.removerConfiguracoesNaoEnviadas,
            },
          })
      : (data: RegraPaxFreeFormData) =>
          createRegraPaxFree({
            regra: {
              id: data.id,
              nome: data.nome,
              dataInicioVigencia: data.dataInicioVigencia || undefined,
              dataFimVigencia: data.dataFimVigencia || undefined,
              configuracoes: data.configuracoes,
              removerConfiguracoesNaoEnviadas: data.removerConfiguracoesNaoEnviadas,
            },
          }),
    onSuccess: () => {
      toast.success(regra ? "Regra atualizada com sucesso!" : "Regra criada com sucesso!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.errors?.[0] || "Erro ao salvar regra"
      );
    },
  });

  const onSubmit = (data: RegraPaxFreeFormData) => {
    if (data.configuracoes.length === 0) {
      toast.error("Adicione pelo menos uma configuração");
      return;
    }
    mutation.mutate({
      ...data,
      removerConfiguracoesNaoEnviadas: true,
    });
  };

  const handleAddConfiguracao = () => {
    append({
      quantidadeAdultos: undefined,
      quantidadePessoasFree: undefined,
      idadeMaximaAnos: undefined,
      tipoOperadorIdade: "<=",
      tipoDataReferencia: "RESERVA",
    });
  };

  return (
    <Modal 
      open={open} 
      onClose={(event, reason) => {
        // Só permite fechar pelo botão de fechar (X) ou botão Cancelar, não ao clicar fora
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
    >
      <ModalDialog
        sx={{
          maxWidth: { xs: "95vw", sm: "95vw", md: "1400px", lg: "1600px" },
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
            p: 2,
            m: 0,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          <span>
            {regra ? "Editar Regra Tarifária" : "Nova Regra Tarifária"}
          </span>
          <IconButton
            size="sm"
            variant="plain"
            onClick={onClose}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as number)}>
              <TabList>
                <Tab>Informações Básicas</Tab>
                <Tab>Período de Vigência</Tab>
                <Tab>Configurações</Tab>
              </TabList>

              <TabPanel value={0}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <InputField
                    field="nome"
                    label="Nome da Regra"
                    required
                    disabled={mutation.isPending}
                  />
                </Stack>
              </TabPanel>

              <TabPanel value={1}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <InputField
                    field="dataInicioVigencia"
                    label="Data Início Vigência"
                    type="date"
                    disabled={mutation.isPending}
                  />
                  <InputField
                    field="dataFimVigencia"
                    label="Data Fim Vigência"
                    type="date"
                    disabled={mutation.isPending}
                  />
                </Stack>
              </TabPanel>

              <TabPanel value={2}>
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      level="title-md"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Configurações da Regra
                    </Typography>
                    <Button
                      size="sm"
                      onClick={handleAddConfiguracao}
                      disabled={mutation.isPending}
                    >
                      Adicionar Configuração
                    </Button>
                  </Box>

                  {fields.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        border: "2px dashed",
                        borderColor: "divider",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        level="body-md"
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          color: "text.secondary",
                        }}
                      >
                        Nenhuma configuração adicionada. Clique em &quot;Adicionar Configuração&quot; para começar.
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {fields.map((field, index) => (
                        <ConfiguracaoItem
                          key={field.id}
                          index={index}
                          onRemove={() => remove(index)}
                          disabled={mutation.isPending}
                        />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </TabPanel>
              </Tabs>
            </form>
          </FormProvider>
        </DialogContent>

        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={form.handleSubmit(onSubmit)}
            loading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Salvar
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

