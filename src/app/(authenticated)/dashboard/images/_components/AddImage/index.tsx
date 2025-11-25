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
} from "@mui/joy";
import { Modal, ModalDialog, DialogTitle, DialogContent, DialogActions } from "@mui/joy";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { GroupImages } from "@/utils/types/groupImages";
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

type AddImageModalProps = {
  groupImage: GroupImages;
  shouldOpen: boolean;
};

export default function AddImageModal({
  groupImage,
  shouldOpen,
}: AddImageModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const closeModal = useCloseModal();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ImageGroupImageInput & { requiredTags?: RequiredTags[] | null }>({
    defaultValues: {
      imageGroupId: groupImage.id,
      name: "",
      nomeBotao: "",
      linkBotao: "",
      dataInicioVigencia: "",
      dataFimVigencia: "",
      requiredTags: [],
    },
  });

  const {
    formState: { errors },
  } = form;

  const linkBotao = useWatch({ control: form.control, name: "linkBotao" });

  useEffect(() => {
    if (shouldOpen) {
      form.reset({
        imageGroupId: groupImage.id,
        name: "",
        nomeBotao: "",
        linkBotao: "",
        dataInicioVigencia: "",
        dataFimVigencia: "",
        requiredTags: [],
      });
      setSelectedFile(null);
      setPreview(null);
      setActiveTab(0);
    }
  }, [shouldOpen, groupImage.id, form]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveImageGroupImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
      toast.success("Imagem salva com sucesso!");
      closeModal();
      form.reset();
      setSelectedFile(null);
      setPreview(null);
    },
    onError: (error: AxiosError<{ errors?: string[] }>) => {
      setFormErrors({
        error,
        form,
        generalMessage: "Não foi possível salvar a imagem, por favor tente mais tarde!",
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

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Tipo de arquivo não suportado. Tipos permitidos: PNG, JPG, GIF, WEBP");
        e.target.value = "";
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ImageGroupImageInput & { requiredTags?: RequiredTags[] | null }) => {
    // Na criação, imagem é obrigatória
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    const imageToSave: ImageGroupImageInput = {
      imageGroupId: data.imageGroupId,
      name: data.name,
      imagem: selectedFile,
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
          Adicionar uma imagem
        </DialogTitle>
        <DialogContent
          sx={{
            p: 3,
            overflow: "auto",
            flex: 1,
          }}
        >
          <FormProvider {...form}>
            <form id="image-form" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value as number)}
                sx={{
                  width: "100%",
                  "& .MuiTab-root": {
                    borderRadius: 0,
                  },
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
                  <Tab sx={{ borderRadius: 0 }}>Imagem</Tab>
                  <Tab sx={{ borderRadius: 0 }}>Botão e Link</Tab>
                  <Tab sx={{ borderRadius: 0 }}>Período de visualização</Tab>
                  <Tab sx={{ borderRadius: 0 }}>Tags</Tab>
                </TabList>

                <TabPanel value={0}>
                  <Stack spacing={3}>
                    <InputField
                      field="name"
                      label="Nome da imagem"
                      required
                      disabled={mutation.isPending}
                      placeholder="Digite o nome da imagem"
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
                        Imagem *
                      </FormLabel>
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
                                e.preventDefault();
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                  setSelectedFile(null);
                                  setPreview(null);
                                }
                              }}
                              sx={{
                                mt: 1,
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                borderRadius: 0,
                              }}
                            >
                              Alterar imagem
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
                              Clique para escolher imagem
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
                        )}
                      </Box>
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
            form="image-form"
            loading={mutation.isPending}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              background: "linear-gradient(135deg, #035781 0%, #2ca2cc 100%)",
              borderRadius: 0,
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
              borderRadius: 0,
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
