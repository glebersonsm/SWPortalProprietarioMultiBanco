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
                  color="danger"
                  onClick={closeModal}
                  sx={{
                    minWidth: { xs: "100%", sm: "120px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(220, 53, 69, 0.3)",
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
                    minWidth: { xs: "100%", sm: "120px" },
                    height: 44,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "12px",
                    fontFamily: "Montserrat, sans-serif",
                    background: "linear-gradient(135deg, #2ca2cc 0%, #035781 100%)",
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
