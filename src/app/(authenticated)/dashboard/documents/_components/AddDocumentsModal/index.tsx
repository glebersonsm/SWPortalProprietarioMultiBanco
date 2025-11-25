import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/InputField";
import { createDocument } from "@/services/querys/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TagsInput from "@/components/TagsInput";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import useCloseModal from "@/hooks/useCloseModal";
import { GroupOfDocs, Document } from "@/utils/types/documents";
import { AxiosError } from "axios";
import { RequiredTags } from "@/utils/types/tags";
import CheckboxField from "@/components/CheckboxField";
import {
  Box,
  Typography,
  Button,
  FormLabel,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
} from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type AddDocData = {
  name: string;
  requiredTags: RequiredTags[];
  available: boolean;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
};

type AddDocumentsModalProps = {
  groupDocuments: GroupOfDocs;
  shouldOpen: boolean;
};

export default function AddDocumentsModal({
  groupDocuments,
  shouldOpen,
}: AddDocumentsModalProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [activeTab, setActiveTab] = React.useState(0);
  
  const form = useForm<AddDocData>({
    defaultValues: {
      name: "",
      requiredTags: [],
      available: false,
      dataInicioVigencia: "",
      dataFimVigencia: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (shouldOpen) {
      form.reset({
        name: "",
        requiredTags: [],
        available: false,
        dataInicioVigencia: "",
        dataFimVigencia: "",
      });
      setSelectedFile(null);
      setActiveTab(0);
    }
  }, [shouldOpen, form]);

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível adicionar o documento nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleCreateDocuments = useMutation({
    mutationFn: createDocument,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const extensao = file.name.split('.').pop()?.toLowerCase();
      const tiposPermitidos = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
      if (!extensao || !tiposPermitidos.includes(extensao)) {
        toast.error("Tipo de arquivo não suportado. Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX");
        e.target.value = ""; // Limpa o input
        setSelectedFile(null);
        return;
      }

      // Validar tamanho (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("O arquivo deve ter no máximo 10MB.");
        e.target.value = ""; // Limpa o input
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  function onSubmit(data: AddDocData) {
    if (!selectedFile) {
      toast.error("Por favor, selecione um arquivo.");
      return;
    }

    const tagsIds = data.requiredTags && data.requiredTags.length > 0 
      ? data.requiredTags.map((tag) => tag.id).filter((id): id is number => id != null)
      : [];

    const newDocument = {
      nome: data.name,
      tagsRequeridas: tagsIds.length > 0 ? tagsIds : null,
      disponivel: data.available ? 1 : 0,
      dataInicioVigencia: data.dataInicioVigencia || undefined,
      dataFimVigencia: data.dataFimVigencia || undefined,
      arquivo: selectedFile,
    };

    handleCreateDocuments.mutate(
      {
        document: newDocument,
        groupDocumentId: groupDocuments.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.success(`Documento ${data.name} criado com sucesso!`);
          closeModal();
          form.reset();
          setSelectedFile(null);
        },
      }
    );
  }

  return (
    <Modal 
      open={shouldOpen} 
      onClose={(event, reason) => {
        // Só permite fechar pelo botão de fechar (X) ou botão Cancelar, não ao clicar fora
        if (reason === 'backdropClick') {
          return;
        }
        closeModal();
      }}
    >
      <ModalDialog
        sx={{
          maxWidth: 800,
          width: "90%",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #035781 0%, rgba(3, 87, 129, 0.8) 100%)",
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            py: 2,
            px: 3,
          }}
        >
          Adicionar um documento
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            overflow: "auto",
            flex: 1,
          }}
        >
          <FormProvider {...form}>
            <form id="document-form" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value as number)}
                sx={{
                  width: "100%",
                }}
              >
                <TabList
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    bgcolor: "background.level1",
                    p: 0.5,
                  }}
                >
                  <Tab>Documento</Tab>
                  <Tab>Período de visualização</Tab>
                  <Tab>Tags</Tab>
                </TabList>

                <TabPanel value={0}>
                  <Stack spacing={3}>
                    <InputField 
                      label="Nome do documento" 
                      field="name" 
                      placeholder="Digite o nome do documento"
                    />
                    
                    <CheckboxField label="Disponível" field="available" />
                    
                    <Box>
                      <FormLabel
                        sx={{
                          color: "var(--color-info-text)",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          mb: 1,
                          display: "block",
                        }}
                      >
                        Arquivo
                      </FormLabel>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          minHeight: "120px",
                          border: "2px dashed",
                          borderColor: selectedFile ? "primary.400" : "neutral.300",
                          borderRadius: "16px",
                          backgroundColor: selectedFile 
                            ? "rgba(44, 162, 204, 0.05)" 
                            : "background.surface",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: "primary.400",
                            backgroundColor: "rgba(44, 162, 204, 0.08)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 24px rgba(44, 162, 204, 0.15)",
                          },
                        }}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileChange}
                          disabled={handleCreateDocuments.isPending}
                          aria-label="Selecionar arquivo"
                          title="Selecionar arquivo"
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            cursor: handleCreateDocuments.isPending ? "not-allowed" : "pointer",
                            zIndex: 1,
                            top: 0,
                            left: 0,
                          }}
                        />
                        {selectedFile ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1,
                              zIndex: 0,
                            }}
                          >
                            <CloudUploadIcon
                              sx={{
                                fontSize: 48,
                                color: "primary.500",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                color: "text.primary",
                                textAlign: "center",
                              }}
                            >
                              {selectedFile.name}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                color: "text.secondary",
                              }}
                            >
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const input = document.querySelector('#document-form input[type="file"]') as HTMLInputElement;
                                if (input) {
                                  input.value = "";
                                  setSelectedFile(null);
                                }
                              }}
                              sx={{
                                mt: 1,
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              Alterar arquivo
                            </Button>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: 1.5,
                              zIndex: 0,
                            }}
                          >
                            <CloudUploadIcon
                              sx={{
                                fontSize: 48,
                                color: "neutral.400",
                                transition: "all 0.3s ease",
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                fontSize: "1rem",
                                color: "text.primary",
                                textAlign: "center",
                              }}
                            >
                              Clique para escolher arquivo
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                color: "text.secondary",
                                textAlign: "center",
                                maxWidth: "400px",
                              }}
                            >
                              PDF, DOC, DOCX, XLS, XLSX (máximo 10MB)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={1}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <InputField
                          field="dataInicioVigencia"
                          label="Data inicial"
                          type="date"
                          required={false}
                          disabled={handleCreateDocuments.isPending}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <InputField
                          field="dataFimVigencia"
                          label="Data final"
                          type="date"
                          required={false}
                          disabled={handleCreateDocuments.isPending}
                        />
                      </Grid>
                    </Grid>
                    <Box>
                      <Typography
                        level="body-sm"
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          color: "text.secondary",
                          fontSize: "0.875rem",
                        }}
                      >
                        Obs.: Caso não informe o período de visualização, o documento será exibido até que seja removido.
                      </Typography>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={2}>
                  <Stack spacing={3}>
                    <TagsInput />
                  </Stack>
                </TabPanel>
              </Tabs>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", flexDirection: "row-reverse", gap: 2 }}>
          <Button
            type="submit"
            form="document-form"
            loading={handleCreateDocuments.isPending}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              background: "linear-gradient(135deg, #035781 0%, #2ca2cc 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #024a6b 0%, #1e8fb8 100%)",
              },
            }}
          >
            Salvar
          </Button>
          <Button
            variant="outlined"
            onClick={closeModal}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
        {errors.root?.generalError?.message && (
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ color: "danger.500", fontSize: "0.875rem" }}>
              {errors.root.generalError.message}
            </Typography>
          </Box>
        )}
      </ModalDialog>
    </Modal>
  );
}
