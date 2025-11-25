"use client";

import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import { FormProvider, useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import AlertError from "@/app/(auth)/_components/AlertError";
import useCloseModal from "@/hooks/useCloseModal";
import { AxiosError } from "axios";
import { createGroupImages } from "@/services/querys/groupImages";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";

type AddGroupImages = {
  name: string;
  requiredTags: RequiredTags[] | null;
};

export default function AddGroupImagesModal({
  shouldOpen,
}: {
  shouldOpen: boolean;
}) {
  const form = useForm<AddGroupImages>({
    defaultValues: {
      name: "",
      requiredTags: [],
    },
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível adicionar o grupo de imagens nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleCreateGroupImages = useMutation({
    mutationFn: createGroupImages,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: AddGroupImages) {
    handleCreateGroupImages.mutate(
      {
        ...data,
        tagsRequeridas:
          data.requiredTags?.values != null
            ? data.requiredTags?.map((tag) => tag.id)
            : null,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
          toast.success(`Grupo de images ${data.name} criado com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <Modal
      open={shouldOpen}
      onClose={(_, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          closeModal();
        }
      }}
    >
      <ModalDialog
        sx={{
          maxWidth: { xs: '95vw', sm: '500px', md: '600px' },
          width: '100%',
          borderRadius: 0,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          p: { xs: 3, md: 4 },
          background: 'var(--modal-bg-gradient, linear-gradient(135deg, #ffffff 0%, #f8fafc 100%))',
          border: '1px solid var(--modal-border-color, rgba(44, 162, 204, 0.1))',
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: "var(--font-puffin, Montserrat), sans-serif",
            textAlign: 'center',
            mb: 1,
            pb: 2,
            background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            borderBottom: '2px solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            mx: { xs: -3, md: -4 },
            mt: { xs: -3, md: -4 },
            px: { xs: 3, md: 4 },
            pt: { xs: 3, md: 4 },
          }}
        >
          Adicionar novo grupo de imagens
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: { xs: '0.875rem', md: '0.95rem' },
            color: 'var(--modal-text-color, text.secondary)',
            fontFamily: "var(--font-puffin, Montserrat), sans-serif",
            fontWeight: 500,
            textAlign: 'center',
            mb: 3,
            pt: 2,
            px: 0,
            pb: 0,
            opacity: 0.85,
          }}
        >
          Preencha o formulário para adicionar um novo grupo de imagens ao sistema
        </DialogContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack 
              spacing={3}
              sx={{
                "& .MuiFormControl-root": {
                  "& .MuiFormLabel-root": {
                    fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--form-label-color, #035781)',
                    mb: 1,
                  },
                  "& .MuiInput-root": {
                    borderRadius: 0,
                    fontSize: '0.875rem',
                    fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                    transition: "all 0.3s ease",
                    backgroundColor: 'var(--form-input-bg, #ffffff)',
                    border: '1px solid var(--form-input-border, rgba(44, 162, 204, 0.2))',
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(44, 162, 204, 0.15)",
                      borderColor: 'rgba(44, 162, 204, 0.4)',
                    },
                    "&.Mui-focused": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(44, 162, 204, 0.25)",
                      borderColor: '#2ca2cc',
                    },
                  },
                },
              }}
            >
              {/* Seção de informações básicas */}
              <InputField 
                label="Nome do grupo de imagens" 
                field="name" 
                placeholder="Digite o nome do grupo de imagens"
              />
              
              {/* Seção de tags */}
              <TagsInput />
              
              <AlertError error={errors.root?.generalError?.message} />
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent={{ xs: "stretch", sm: "flex-end" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ 
                  mt: 4, 
                  pt: 3, 
                  borderTop: '2px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  variant="outlined"
                  color="danger"
                  onClick={closeModal}
                  sx={{
                    minWidth: { xs: "100%", sm: "140px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: 0,
                    fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                    border: '1.5px solid',
                    color: 'var(--color-button-exit-text, #dc3545)',
                    borderColor: 'var(--color-button-exit-border, #dc3545)',
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(220, 53, 69, 0.3)",
                      backgroundColor: 'rgba(220, 53, 69, 0.05)',
                      borderColor: '#c82333',
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
                  loading={handleCreateGroupImages.isPending}
                  sx={{
                    minWidth: { xs: "100%", sm: "140px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: 0,
                    fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                    background: "linear-gradient(135deg, #2ca2cc 0%, #035781 100%)",
                    color: '#ffffff',
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #035781 0%, #024a6b 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(44, 162, 204, 0.4)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 4px 12px rgba(44, 162, 204, 0.3)",
                    },
                  }}
                >
                  Criar
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormProvider>
      </ModalDialog>
    </Modal>
  );
}
