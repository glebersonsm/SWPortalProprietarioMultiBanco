"use client";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  Stack,
  Button,
  Box,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
  FormLabel,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/joy";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { GroupImages } from "@/utils/types/groupImages";
import { Image as ImageType } from "@/utils/types/images";
import { saveImageGroupImage, ImageGroupImageInput } from "@/services/querys/images";
import InputField from "@/components/InputField";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import useCloseModal from "@/hooks/useCloseModal";
import { setFormErrors } from "@/services/errors/formErrors";

type EditImageModalProps = {
  shouldOpen: boolean;
  image: ImageType;
  groupImages: GroupImages;
};

export default function EditImageModal({
  shouldOpen,
  image,
  groupImages,
}: EditImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const closeModal = useCloseModal();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ImageGroupImageInput & { requiredTags?: RequiredTags[] | null }>({
    defaultValues: {
      id: image?.id,
      imageGroupId: groupImages.id,
      name: image?.name || "",
      nomeBotao: image?.nomeBotao || "",
      linkBotao: image?.linkBotao || "",
      dataInicioVigencia: image?.dataInicioVigencia ? image.dataInicioVigencia.split('T')[0] : "",
      dataFimVigencia: image?.dataFimVigencia ? image.dataFimVigencia.split('T')[0] : "",
      requiredTags: image?.tagsRequeridas || [],
    },
  });

  const linkBotao = useWatch({ control: form.control, name: "linkBotao" });

  useEffect(() => {
    if (shouldOpen && image) {
      form.reset({
        id: image.id,
        imageGroupId: groupImages.id,
        name: image.name || "",
        nomeBotao: image.nomeBotao || "",
        linkBotao: image.linkBotao || "",
        dataInicioVigencia: image.dataInicioVigencia ? image.dataInicioVigencia.split('T')[0] : "",
        dataFimVigencia: image.dataFimVigencia ? image.dataFimVigencia.split('T')[0] : "",
        requiredTags: image.tagsRequeridas || [],
      });
      setSelectedFile(null);
      setShowUpload(false);
      setActiveTab(0);
      
      if (image.imagemBase64) {
        const previewUrl = `data:image/jpeg;base64,${image.imagemBase64}`;
        setPreview(previewUrl);
        setOriginalPreview(previewUrl);
      } else {
        setPreview(null);
        setOriginalPreview(null);
      }
    }
  }, [shouldOpen, image, groupImages.id, form]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveImageGroupImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
      toast.success("Imagem atualizada com sucesso!");
      closeModal();
      form.reset();
      setSelectedFile(null);
      setPreview(null);
      setShowUpload(false);
    },
    onError: (error: AxiosError<{ errors?: string[] }>) => {
      setFormErrors({
        error,
        form,
        generalMessage: "Não foi possível atualizar a imagem, por favor tente mais tarde!",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho máximo de 2MB
      const maxSize = 2 * 1024 * 1024; // 2MB em bytes
      if (file.size > maxSize) {
        toast.error("A imagem deve ter no máximo 2MB");
        e.target.value = ""; // Limpa o input
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      setShowUpload(false); // Esconder upload quando imagem for selecionada
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelUpload = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setShowUpload(false);
    setSelectedFile(null);
    // Restaurar o preview original se existir
    setPreview(originalPreview);
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: ImageGroupImageInput & { requiredTags?: RequiredTags[] | null }) => {
    const imageToSave: ImageGroupImageInput = {
      id: data.id,
      imageGroupId: data.imageGroupId,
      name: data.name,
      imagem: selectedFile || undefined,
      nomeBotao: data.nomeBotao,
      linkBotao: data.linkBotao,
      dataInicioVigencia: data.dataInicioVigencia,
      dataFimVigencia: data.dataFimVigencia,
      tagsRequeridas: data.requiredTags?.map((tag) => tag.id) || null,
    };

    mutation.mutate(imageToSave);
  };

  const handleTestLink = () => {
    if (linkBotao) {
      window.open(linkBotao, "_blank", "noopener,noreferrer");
    }
  };

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
      slotProps={{
        root: {
          // Evita problemas com ref no React 19
        },
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
          borderRadius: 0,
        }}
        slotProps={{
          root: {
            // Evita problemas com ref no React 19
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            color: "white",
            fontFamily: "var(--font-puffin, Montserrat), sans-serif",
            fontWeight: 700,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            textAlign: 'center',
            mb: 1,
            pb: 2,
            borderBottom: '2px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            mx: { xs: -3, md: -4 },
            mt: { xs: -3, md: -4 },
            px: { xs: 3, md: 4 },
            pt: { xs: 3, md: 4 },
          }}
        >
          Editar Imagem
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            overflow: "auto",
            flex: 1,
          }}
        >
          <FormProvider {...form}>
            <form id="edit-image-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    borderRadius: 0,
                    bgcolor: "background.level1",
                    p: 0.5,
                  }}
                >
                  <Tab>Imagem</Tab>
                  <Tab>Botão e Link</Tab>
                  <Tab>Período de visualização</Tab>
                  <Tab>Tags</Tab>
                </TabList>

                <TabPanel value={0}>
                  <Stack spacing={3}>
                    <InputField
                      field="name"
                      label="Nome da imagem"
                      required
                      disabled={mutation.isPending}
                    />

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
                        Imagem
                      </FormLabel>
                      
                      {/* Mostrar preview e botão "Alterar imagem" se não estiver mostrando upload e não houver arquivo novo selecionado */}
                      {preview && !showUpload && !selectedFile && originalPreview && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "1px solid",
                            borderColor: "neutral.300",
                            borderRadius: 0,
                            backgroundColor: "background.surface",
                          }}
                        >
                          <Box
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: 0,
                              overflow: "hidden",
                              border: "1px solid",
                              borderColor: "divider",
                              position: "relative",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={preview}
                              alt="Preview"
                              fill
                              unoptimized
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          </Box>
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
                              {image.name || "Imagem atual"}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 500,
                                fontSize: "0.8rem",
                                color: "text.secondary",
                              }}
                            >
                              Imagem atual
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            size="sm"
                            startDecorator={<EditIcon />}
                            onClick={() => {
                              // Salvar o preview atual antes de mostrar o upload
                              setOriginalPreview(preview);
                              setShowUpload(true);
                            }}
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                            }}
                          >
                            Alterar imagem
                          </Button>
                        </Box>
                      )}

                      {/* Componente de upload - mostrar quando não há preview ou quando showUpload for true */}
                      {(showUpload || !preview) && (
                        <Grid container spacing={2}>
                          <Grid xs={12} sm={6}>
                            <Box
                              sx={{
                                position: "relative",
                                width: "100%",
                                minHeight: "120px",
                                border: "2px dashed",
                                borderColor: selectedFile ? "primary.400" : "neutral.300",
                                borderRadius: 0,
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
                                ref={fileInputRef}
                                id="image-upload-edit"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={mutation.isPending}
                                aria-label="Selecionar imagem"
                                title="Selecionar imagem"
                                style={{
                                  position: "absolute",
                                  width: "100%",
                                  height: "100%",
                                  opacity: 0,
                                  cursor: mutation.isPending ? "not-allowed" : "pointer",
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
                                    color: selectedFile ? "primary.500" : "neutral.400",
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
                                  {selectedFile
                                    ? selectedFile.name
                                    : "Clique para escolher imagem"}
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
                                  PNG, JPG, GIF (máximo 2MB)
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          {/* Botão Cancelar - mostrar quando mostrar upload e houver preview */}
                          {showUpload && preview && (
                            <Grid xs={12} sm={6}>
                              <Button
                                variant="outlined"
                                color="danger"
                                startDecorator={<CancelIcon />}
                                onClick={handleCancelUpload}
                                disabled={mutation.isPending}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  minHeight: 120,
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "0.875rem",
                                  borderRadius: 0,
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
                      
                      {/* Preview da imagem selecionada quando não está em modo upload */}
                      {selectedFile && !showUpload && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            border: "1px solid",
                            borderColor: "primary.300",
                            borderRadius: 0,
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
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB - Nova imagem selecionada
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
                            Alterar imagem
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={1}>
                  <Stack spacing={3}>
                    <InputField
                      field="nomeBotao"
                      label="Nome do botão"
                      required={false}
                      disabled={mutation.isPending}
                    />

                    <Box>
                      <InputField
                        field="linkBotao"
                        label="Link do botão"
                        required={false}
                        disabled={mutation.isPending}
                      />
                      {linkBotao && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startDecorator={<OpenInNewIcon />}
                          onClick={handleTestLink}
                          disabled={mutation.isPending}
                          sx={{
                            mt: 1,
                            width: "100%",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            borderRadius: 0,
                          }}
                        >
                          Testar Link
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={2}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6}>
                        <InputField
                          field="dataInicioVigencia"
                          label="Data inicial"
                          type="date"
                          required={false}
                          disabled={mutation.isPending}
                        />
                      </Grid>
                      <Grid xs={12} sm={6}>
                        <InputField
                          field="dataFimVigencia"
                          label="Data final"
                          type="date"
                          required={false}
                          disabled={mutation.isPending}
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
                        Obs.: Caso não informe o período de visualização, a imagem será exibida até que seja removida.
                      </Typography>
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={3}>
                  <Stack spacing={3}>
                    <TagsInput name="requiredTags" disabled={mutation.isPending} />
                  </Stack>
                </TabPanel>
              </Tabs>
            </form>
          </FormProvider>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", flexDirection: "row-reverse", gap: 2 }}>
          <Button
            type="submit"
            form="edit-image-form"
            loading={mutation.isPending}
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
        {form.formState.errors.root?.generalError?.message && (
          <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ color: "danger.500", fontSize: "0.875rem" }}>
              {form.formState.errors.root.generalError.message}
            </Typography>
          </Box>
        )}
      </ModalDialog>
    </Modal>
  );
}

