"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
} from "@mui/joy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputField from "@/components/InputField";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";
import {
  saveGrupoImagemHome,
  GrupoImagemHome,
  GrupoImagemHomeInput,
} from "@/services/querys/grupo-imagem-home";
import { toast } from "react-toastify";

type GrupoImagemHomeFormPageProps = {
  grupo: GrupoImagemHome | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function GrupoImagemHomeFormPage({
  grupo,
  onSuccess,
  onCancel,
}: GrupoImagemHomeFormPageProps) {
  const queryClient = useQueryClient();

  const form = useForm<GrupoImagemHomeInput & { requiredTags?: RequiredTags[] | null }>({
    defaultValues: {
      id: undefined,
      name: "",
      requiredTags: [],
    },
  });

  useEffect(() => {
    form.reset({
      id: grupo?.id,
      name: grupo?.name || "",
      requiredTags: grupo?.tagsRequeridas || [],
    });
  }, [grupo, form]);

  const mutation = useMutation({
    mutationFn: saveGrupoImagemHome,
    onSuccess: () => {
      toast.success(grupo ? "Grupo atualizado com sucesso!" : "Grupo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.errors?.[0] || "Erro ao salvar grupo"
      );
    },
  });

  const onSubmit = (data: GrupoImagemHomeInput & { requiredTags?: RequiredTags[] | null }) => {
    mutation.mutate({
      ...data,
      tagsRequeridas: data.requiredTags?.map((tag) => tag.id) || null,
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "800px", mx: "auto", p: 3 }}>
      <Stack spacing={0}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            color: "white",
            borderRadius: "12px 12px 0 0",
            p: 3,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="soft"
              size="sm"
              onClick={onCancel}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.25)",
                },
              }}
            >
              <ArrowBackIcon />
            </Button>
            <Typography
              level="h3"
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                color: "white",
                flex: 1,
              }}
            >
              {grupo ? "Editar Grupo de Imagens" : "Novo Grupo de Imagens"}
            </Typography>
          </Stack>
        </Box>

        {/* Form Card */}
        <Card
          sx={{
            borderRadius: "0 0 12px 12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <InputField
                    field="name"
                    label="Nome do Grupo"
                    required
                    disabled={mutation.isPending}
                  />
                  <TagsInput name="requiredTags" disabled={mutation.isPending} />

                  {/* Botões de Ação */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{
                      mt: 4,
                      pt: 3,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="danger"
                      onClick={onCancel}
                      disabled={mutation.isPending}
                      sx={{
                        minWidth: { xs: "100%", sm: "140px" },
                        height: 46,
                        borderRadius: 12,
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.875rem",
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
                        "&:active": {
                          transform: "translateY(0)",
                        },
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      loading={mutation.isPending}
                      sx={{
                        minWidth: { xs: "100%", sm: "160px" },
                        height: 46,
                        borderRadius: 12,
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                        color: "white",
                        border: "none",
                        boxShadow: "0 8px 20px rgba(44, 162, 204, 0.35)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: "-100%",
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                          transition: "left 0.5s ease",
                        },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 24px rgba(44, 162, 204, 0.4)",
                          "&::before": {
                            left: "100%",
                          },
                        },
                        "&:active": {
                          transform: "translateY(0)",
                          boxShadow: "0 6px 16px rgba(44, 162, 204, 0.3)",
                        },
                        "&:disabled": {
                          opacity: 0.7,
                        },
                      }}
                    >
                      {mutation.isPending ? "Salvando..." : grupo ? "Salvar" : "Criar"}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

