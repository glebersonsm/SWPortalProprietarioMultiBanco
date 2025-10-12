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
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
            color: 'var(--color-title)',
            pb: 1,
          }}
        >
          Adicionar novo grupo de imagens
        </DialogTitle>
        <DialogContent
          sx={{
            fontSize: '0.95rem',
            color: 'text.secondary',
            pb: 3,
          }}
        >
          Preencha o formulário para adicionar um novo grupo de imagens ao sistema
        </DialogContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
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
                sx={{ mt: 4, pt: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={closeModal}
                  sx={{
                    minWidth: { xs: "100%", sm: "120px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    color: 'var(--color-button-exit-text)',
                    borderColor: 'var(--color-button-exit-border)',
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      backgroundColor: 'var(--color-button-exit-hover-bg)',
                      color: 'var(--color-button-exit-hover-text)',
                      borderColor: 'var(--color-button-exit-hover-border)',
                    },
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  loading={handleCreateGroupImages.isPending}
                  variant="solid"
                  sx={{
                    minWidth: { xs: "100%", sm: "120px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    bgcolor: 'var(--color-button-primary)',
                    color: 'var(--color-button-text)',
                    border: 'none',
                    boxShadow: '0 6px 16px rgba(14, 42, 71, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'var(--color-button-primary-hover)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(14, 42, 71, 0.30)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(14, 42, 71, 0.25)',
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
