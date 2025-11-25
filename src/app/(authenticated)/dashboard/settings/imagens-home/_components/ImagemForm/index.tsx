"use client";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Button,
  Box,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Grid,
} from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import InputField from "@/components/InputField";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";
import {
  saveImagemGrupoImagemHome,
  ImagemGrupoImagemHome,
  ImagemGrupoImagemHomeInput,
} from "@/services/querys/imagem-grupo-imagem-home";
import { toast } from "react-toastify";

type ImagemFormProps = {
  open: boolean;
  onClose: () => void;
  grupoId: number;
  imagem: ImagemGrupoImagemHome | null;
  onSuccess: () => void;
};

export default function ImagemForm({
  open,
  onClose,
  grupoId,
  imagem,
  onSuccess,
}: ImagemFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<ImagemGrupoImagemHomeInput & { imagemFile?: File; requiredTags?: RequiredTags[] | null }>({
    defaultValues: {
      id: undefined,
      grupoImagemHomeId: grupoId,
      name: "",
      nomeBotao: "",
      linkBotao: "",
      ordem: 0,
      dataInicioVigencia: "",
      dataFimVigencia: "",
      requiredTags: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: imagem?.id,
        grupoImagemHomeId: grupoId,
        name: imagem?.name || "",
        nomeBotao: imagem?.nomeBotao || "",
        linkBotao: imagem?.linkBotao || "",
        ordem: imagem?.ordem || 0,
        dataInicioVigencia: imagem?.dataInicioVigencia ? imagem.dataInicioVigencia.split('T')[0] : "",
        dataFimVigencia: imagem?.dataFimVigencia ? imagem.dataFimVigencia.split('T')[0] : "",
        requiredTags: imagem?.tagsRequeridas || [],
      });
      setSelectedFile(null);
      setShowUpload(false);
      setActiveTab(0); // Resetar para a primeira aba
      
      if (imagem?.imagemBase64) {
        const previewUrl = `data:image/jpeg;base64,${imagem.imagemBase64}`;
        setPreview(previewUrl);
        setOriginalPreview(previewUrl);
      } else {
        setPreview(null);
        setOriginalPreview(null);
        // Na criação, não mostrar upload diretamente - aguardar seleção
      }
    }
  }, [open, imagem, grupoId, form]);

  const mutation = useMutation({
    mutationFn: saveImagemGrupoImagemHome,
    onSuccess: () => {
      toast.success(imagem ? "Imagem atualizada com sucesso!" : "Imagem criada com sucesso!");
      onSuccess();
      form.reset();
      setSelectedFile(null);
      setPreview(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.errors?.[0] || "Erro ao salvar imagem");
    },
  });

  // Função para converter base64 para File
  const base64ToFile = (base64: string, filename: string, mimeType: string): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  };

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

  const onSubmit = (data: ImagemGrupoImagemHomeInput & { imagemFile?: File; requiredTags?: RequiredTags[] | null }) => {
    // Na criação, imagem é obrigatória
    if (!imagem && !selectedFile) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    // Validar tamanho da imagem se houver arquivo selecionado
    if (selectedFile) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (selectedFile.size > maxSize) {
        toast.error("A imagem deve ter no máximo 2MB");
        return;
      }
    }

    // Determinar qual imagem enviar
    let imagemToSend: File | undefined = undefined;
    
    if (selectedFile) {
      // Se houver nova imagem selecionada, usa ela
      imagemToSend = selectedFile;
    } else if (imagem?.imagemBase64) {
      // Se for edição e não houver nova imagem, converte o base64 existente para File
      try {
        // Remove o prefixo data:image/...;base64, se existir
        const base64Data = imagem.imagemBase64.includes(',') 
          ? imagem.imagemBase64.split(',')[1] 
          : imagem.imagemBase64;
        
        // Detecta o tipo MIME do base64
        const mimeType = imagem.imagemBase64.startsWith('data:image/')
          ? imagem.imagemBase64.split(';')[0].split(':')[1]
          : 'image/jpeg';
        
        // Cria um nome de arquivo baseado no nome da imagem
        const filename = imagem.name 
          ? `${imagem.name.replace(/\s+/g, '_')}.${mimeType.split('/')[1] || 'jpg'}`
          : `imagem_${imagem.id || 'edit'}.${mimeType.split('/')[1] || 'jpg'}`;
        
        imagemToSend = base64ToFile(base64Data, filename, mimeType);
      } catch (error) {
        console.error("Erro ao converter base64 para File:", error);
        toast.error("Erro ao processar a imagem existente");
        return;
      }
    }

    const imagemToSave: ImagemGrupoImagemHomeInput = {
      id: data.id,
      grupoImagemHomeId: grupoId,
      name: data.name,
      imagem: imagemToSend,
      nomeBotao: data.nomeBotao || undefined,
      linkBotao: data.linkBotao || undefined,
      ordem: data.ordem || 0,
      dataInicioVigencia: data.dataInicioVigencia || undefined,
      dataFimVigencia: data.dataFimVigencia || undefined,
      tagsRequeridas: data.requiredTags?.map((tag) => tag.id) || null,
    };

    mutation.mutate(imagemToSave);
  };

  // Componente interno para testar o link (precisa estar dentro do FormProvider)
  function LinkTestButtonWrapper({ disabled }: { disabled: boolean }) {
    const linkBotao = useWatch({ control: form.control, name: "linkBotao" });
    const nomeBotao = useWatch({ control: form.control, name: "nomeBotao" });

    const handleTestLink = () => {
      if (linkBotao) {
        // Adiciona http:// se não tiver protocolo
        let url = linkBotao.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `http://${url}`;
        }
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };

    if (!linkBotao || !linkBotao.trim()) {
      return null;
    }

    return (
      <Box sx={{ px: 3, pb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          size="sm"
          startDecorator={<OpenInNewIcon />}
          onClick={handleTestLink}
          disabled={disabled}
          sx={{
            width: "100%",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(44, 162, 204, 0.25)",
            },
          }}
        >
          {nomeBotao ? `Testar: ${nomeBotao}` : "Testar Link"}
        </Button>
      </Box>
    );
  }

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
          maxWidth: { xs: "95vw", sm: "600px", md: "750px" },
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          border: "none",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          p: { xs: 3, md: 4 },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            textAlign: "center",
            mb: 1,
            pb: 2.5,
            pt: 3,
            px: 3,
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            },
          }}
        >
          <Typography
            level="h4"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              color: "white",
              textAlign: "center",
            }}
          >
            {imagem ? "Editar Imagem" : "Nova Imagem"}
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 0,
            pt: 3,
            pb: 0,
          }}
        >
          <FormProvider {...form}>
            <form id="imagem-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Tab>Imagem</Tab>
                  <Tab>Botão e link</Tab>
                  <Tab>Período de visualização</Tab>
                  <Tab>Tags</Tab>
                </TabList>

                <TabPanel value={0}>
                  <Stack spacing={3}>
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={8}>
                        <InputField
                          field="name"
                          label="Nome da imagem"
                          required
                          disabled={mutation.isPending}
                        />
                      </Grid>
                      <Grid xs={12} sm={4}>
                        <InputField
                          field="ordem"
                          label="Ordem de exibição"
                          type="number"
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
                    fontWeight: 500,
                    mb: 1.5,
                    color: "var(--color-info-text)",
                    fontSize: "14px",
                  }}
                >
                  Imagem {imagem ? "" : "*"}
                </Typography>
                
                {/* Mostrar preview e botão "Alterar imagem" se não estiver mostrando upload */}
                {preview && !showUpload && (
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <Box
                        sx={{
                          width: "100%",
                          minHeight: 150,
                          maxHeight: 200,
                          borderRadius: "16px",
                          overflow: "hidden",
                          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.05) 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid",
                          borderColor: "divider",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                          position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(135deg, rgba(44, 162, 204, 0.03) 0%, rgba(25, 118, 210, 0.03) 100%)",
                            pointerEvents: "none",
                          },
                        }}
                      >
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          unoptimized
                          style={{
                            objectFit: "contain",
                            borderRadius: "14px",
                            zIndex: 1,
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startDecorator={<EditIcon />}
                        onClick={() => {
                          // Salvar o preview atual antes de mostrar o upload
                          setOriginalPreview(preview);
                          setShowUpload(true);
                        }}
                        disabled={mutation.isPending}
                        sx={{
                          width: "100%",
                          height: "100%",
                          minHeight: 150,
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderRadius: "12px",
                          border: "2px solid",
                          borderColor: "primary.400",
                          color: "primary.600",
                          backgroundColor: "rgba(44, 162, 204, 0.05)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 16px rgba(44, 162, 204, 0.25)",
                            borderColor: "primary.500",
                            backgroundColor: "rgba(44, 162, 204, 0.1)",
                          },
                        }}
                      >
                        Alterar Imagem
                      </Button>
                    </Grid>
                  </Grid>
                )}

                {/* Componente de upload - mostrar quando não há preview ou quando showUpload for true */}
                {(showUpload || !preview) && (
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <Box
                          component="label"
                          htmlFor="image-upload"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            minHeight: "80px",
                            padding: "16px",
                            borderRadius: "16px",
                            border: "2px dashed",
                            borderColor: selectedFile ? "primary.500" : "primary.300",
                            background: selectedFile
                              ? "linear-gradient(135deg, rgba(44, 162, 204, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)"
                              : "linear-gradient(135deg, rgba(44, 162, 204, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)",
                            cursor: mutation.isPending ? "not-allowed" : "pointer",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                              borderColor: mutation.isPending ? "primary.300" : "primary.500",
                              background: mutation.isPending
                                ? "linear-gradient(135deg, rgba(44, 162, 204, 0.05) 0%, rgba(25, 118, 210, 0.05) 100%)"
                                : "linear-gradient(135deg, rgba(44, 162, 204, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)",
                              transform: mutation.isPending ? "none" : "translateY(-2px)",
                              boxShadow: mutation.isPending
                                ? "none"
                                : "0 4px 12px rgba(44, 162, 204, 0.2)",
                            },
                          }}
                        >
                          <input
                            ref={fileInputRef}
                            id="image-upload"
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
                            }}
                          />
                          <CloudUploadIcon
                            sx={{
                              fontSize: 36,
                              color: selectedFile ? "primary.500" : "primary.400",
                              mb: 1,
                              transition: "all 0.2s ease",
                            }}
                          />
                          <Typography
                            level="body-md"
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              color: selectedFile ? "primary.600" : "text.secondary",
                              textAlign: "center",
                              mb: 0.5,
                            }}
                          >
                            {selectedFile
                              ? selectedFile.name
                              : "Clique para selecionar ou arraste uma imagem aqui"}
                          </Typography>
                          <Typography
                            level="body-xs"
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              color: "text.tertiary",
                              textAlign: "center",
                              fontSize: "0.75rem",
                              mb: 1,
                            }}
                          >
                            PNG, JPG, GIF até 2MB
                          </Typography>
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              fileInputRef.current?.click();
                            }}
                            disabled={mutation.isPending}
                            sx={{
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              borderRadius: "8px",
                              position: "relative",
                              zIndex: 2,
                            }}
                          >
                            Selecionar
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                
                {/* Botão Cancelar externo - mostrar quando mostrar upload e houver preview */}
                {showUpload && preview && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="danger"
                      startDecorator={<CancelIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowUpload(false);
                        setSelectedFile(null);
                        // Restaurar o preview original se existir
                        setPreview(originalPreview);
                        // Limpar o input de arquivo
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      disabled={mutation.isPending}
                      sx={{
                        width: "100%",
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
                      <LinkTestButtonWrapper disabled={mutation.isPending} />
                    </Box>
                  </Stack>
                </TabPanel>

                <TabPanel value={2}>
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                      <InputField
                        field="dataInicioVigencia"
                        label="Data inicial"
                        type="date"
                        required={false}
                        disabled={mutation.isPending}
                        sx={{ flex: 1 }}
                      />
                      <InputField
                        field="dataFimVigencia"
                        label="Data final"
                        type="date"
                        required={false}
                        disabled={mutation.isPending}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                    <Box>
                      <label>Obs.: Caso não informe o período de visualização, a imagem será exibida até que seja removida.</label>
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

        <DialogActions 
          sx={{ 
            px: 2, 
            py: 1.5, 
            width: "100%", 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end", 
            alignItems: "center",
            gap: 2 
          }}
        >
          <Button
            variant="outlined"
            color="danger"
            onClick={onClose}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: '120px' },
              height: 46,
              borderRadius: 12,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              border: '2px solid',
              borderColor: 'danger.400',
              color: 'danger.600',
              backgroundColor: 'rgba(211, 47, 47, 0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(211, 47, 47, 0.25)',
                borderColor: 'danger.500',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Fechar
          </Button>
          <Button
            type="submit"
            form="imagem-form"
            disabled={mutation.isPending}
            loading={mutation.isPending}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              minWidth: { xs: '100%', sm: '160px' },
              height: 46,
              borderRadius: 12,
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 8px 20px rgba(44, 162, 204, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transition: 'left 0.5s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 24px rgba(44, 162, 204, 0.4)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 6px 16px rgba(44, 162, 204, 0.3)',
              },
              '&:disabled': {
                opacity: 0.7,
                transform: 'none',
              },
            }}
          >
            {mutation.isPending ? "Salvando..." : imagem ? "Salvar" : "Criar"}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

