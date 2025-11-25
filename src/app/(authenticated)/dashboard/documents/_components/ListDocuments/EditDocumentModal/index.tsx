import * as React from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/InputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDocument } from "@/services/querys/document";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import TagsInput from "@/components/TagsInput";
import useCloseModal from "@/hooks/useCloseModal";
import { Document } from "@/utils/types/documents";
import { untransformedDoc } from "@/services/api/transformDocs";
import { AxiosError } from "axios";
import CheckboxField from "@/components/CheckboxField";
import {
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
  Button,
  Box,
  Typography,
  FormLabel,
  Grid,
} from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

type EditDocumentModalProps = {
  document: Document;
  shouldOpen: boolean;
};

export default function EditDocumentModal({
  document,
  shouldOpen,
}: EditDocumentModalProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [showUpload, setShowUpload] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Estado para armazenar o preview original quando em modo de edição
  const originalFileName = React.useRef<string | null>(null);

  const form = useForm<Document & { removeUnsetTags: boolean }>({
    defaultValues: {
      ...document,
      requiredTags: document.requiredTags || [],
      dataInicioVigencia: document.dataInicioVigencia || "",
      dataFimVigencia: document.dataFimVigencia || "",
    },
  });
  const {
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (shouldOpen) {
      form.reset({
        ...document,
        requiredTags: document.requiredTags || [],
        dataInicioVigencia: document.dataInicioVigencia || "",
        dataFimVigencia: document.dataFimVigencia || "",
      });
      setActiveTab(0);
      setSelectedFile(null);
      setShowUpload(false);
      // Salvar o nome do arquivo original
      originalFileName.current = document.nomeArquivo || null;
    }
  }, [shouldOpen, document, form]);

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar o documento nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleEditDocuments = useMutation({
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
      setShowUpload(false); // Esconder upload quando arquivo for selecionado
    }
  };

  const handleCancelUpload = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowUpload(false);
    setSelectedFile(null);
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function onSubmit(data: Document & { removeUnsetTags: boolean }) {
    const tagsIds = data.requiredTags && data.requiredTags.length > 0 
      ? data.requiredTags.map((tag) => tag.id).filter((id): id is number => id != null)
      : [];

    const newDocument = {
      id: document.id,
      nome: data.name,
      tagsRequeridas: tagsIds.length > 0 ? tagsIds : null,
      disponivel: data.available ? 1 : 0,
      dataInicioVigencia: data.dataInicioVigencia || undefined,
      dataFimVigencia: data.dataFimVigencia || undefined,
      arquivo: selectedFile || undefined,
    };

    handleEditDocuments.mutate(
      {
        document: newDocument,
        groupDocumentId: document.groupDocumentId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.success(`Documento ${data.name} editado com sucesso!`);
          closeModal();
          setSelectedFile(null);
          setShowUpload(false);
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
          Editar documento
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            overflow: "auto",
            flex: 1,
          }}
        >
          <FormProvider {...form}>
            <form id="edit-document-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    <InputField label="Nome do documento" field="name" />
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
                      
                      {!showUpload && !selectedFile && document.nomeArquivo && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "1px solid",
                            borderColor: "neutral.300",
                            borderRadius: "12px",
                            backgroundColor: "background.surface",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                color: "text.primary",
                                mb: 0.5,
                              }}
                            >
                              {document.nomeArquivo}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                color: "text.secondary",
                              }}
                            >
                              Arquivo atual
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="sm"
                            startDecorator={<EditIcon />}
                            onClick={() => setShowUpload(true)}
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            Alterar arquivo
                          </Button>
                        </Box>
                      )}

                      {showUpload && (
                        <Grid container spacing={2}>
                          <Grid xs={12} sm={6}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                minHeight: "120px",
                                border: "2px dashed",
                                borderColor: "neutral.300",
                                borderRadius: "16px",
                                backgroundColor: "background.surface",
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
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={handleFileChange}
                                disabled={handleEditDocuments.isPending}
                                aria-label="Selecionar arquivo"
                                title="Selecionar arquivo"
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  opacity: 0,
                                  cursor: handleEditDocuments.isPending ? "not-allowed" : "pointer",
                                  zIndex: 1,
                                  top: 0,
                                  left: 0,
                                }}
                              />
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
                            </Box>
                          </Grid>
                          {/* Botão Cancelar - mostrar quando mostrar upload e houver arquivo original */}
                          {originalFileName.current && (
                            <Grid xs={12} sm={6}>
                              <Button
                                variant="outlined"
                                color="danger"
                                startDecorator={<CancelIcon />}
                                onClick={handleCancelUpload}
                                disabled={handleEditDocuments.isPending}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  minHeight: 120,
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  borderRadius: "12px",
                                  border: "2px solid",
                                  borderColor: "danger.400",
                                  color: "danger.600",
                                  backgroundColor: "rgba(211, 47, 47, 0.05)",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 16px rgba(211, 47, 47, 0.25)",
                                    borderColor: "danger.500",
                                    backgroundColor: "rgba(211, 47, 47, 0.1)",
                                  },
                                }}
                              >
                                Cancelar Alteração
                              </Button>
                            </Grid>
                          )}
                        </Grid>
                      )}

                      {selectedFile && !showUpload && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "1px solid",
                            borderColor: "primary.300",
                            borderRadius: "12px",
                            backgroundColor: "rgba(44, 162, 204, 0.05)",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                color: "text.primary",
                                mb: 0.5,
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
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB - Novo arquivo selecionado
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="sm"
                            startDecorator={<EditIcon />}
                            onClick={() => setShowUpload(true)}
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            Alterar arquivo
                          </Button>
                        </Box>
                      )}
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
                          disabled={handleEditDocuments.isPending}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <InputField
                          field="dataFimVigencia"
                          label="Data final"
                          type="date"
                          required={false}
                          disabled={handleEditDocuments.isPending}
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
            form="edit-document-form"
            loading={handleEditDocuments.isPending}
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
