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
import TagsInput from "@/components/TagsInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupDocuments } from "@/services/querys/groupsDocuments";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import AlertError from "@/app/(auth)/_components/AlertError";
import useCloseModal from "@/hooks/useCloseModal";
import { AxiosError } from "axios";
import { RequiredTags } from "@/utils/types/tags";
import OptionsWithPool from "@/components/OptionsWithPool";

type AddGroupDocData = {
  name: string;
  requiredTags: RequiredTags[];
  isPublic: boolean;
  available: boolean;
};

export default function AddGroupOfDocsModal({
  shouldOpen,
}: {
  shouldOpen: boolean;
}) {
  const form = useForm<AddGroupDocData>({
    defaultValues: {
      name: "",
      requiredTags: [],
      isPublic: false,
      available: false,
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
        "Não foi possível adicionar o grupo de documentos nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleCreateGroupOfDocuments = useMutation({
    mutationFn: createGroupDocuments,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  const isPublic = !!form.watch("isPublic");

  function onSubmit(data: AddGroupDocData) {
    const newGroupDoc = {
      nome: data.name,
      tagsRequeridas: data.requiredTags?.map((tag) => tag.id),
      grupoPublico: data.isPublic ? 1 : 0,
      disponivel: data.available ? 1 : 0,
    };

    handleCreateGroupOfDocuments.mutate(newGroupDoc, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
        toast.success(`Grupo de documentos ${data.name} criado com sucesso!`);
        closeModal();
      },
    });
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
          maxWidth: { xs: "95vw", sm: "500px", md: "600px" },
          borderRadius: "16px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          p: 3,
        }}
      >
        <DialogTitle
          sx={{
            color: "primary.solidHoverBg",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            textAlign: "center",
            mb: 1,
          }}
        >
          Adicionar novo grupo de documentos
        </DialogTitle>
        <DialogContent
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
            textAlign: "center",
            mb: 2,
            opacity: 0.8,
          }}
        >
          Preencha o formulário para adicionar um grupo de documentos
        </DialogContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack 
              spacing={3}
              sx={{
                "& .MuiFormControl-root": {
                  "& .MuiInput-root": {
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(44, 162, 204, 0.15)",
                    },
                    "&.Mui-focused": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 16px rgba(44, 162, 204, 0.25)",
                    },
                  },
                },
              }}
            >
              {/* Informações Básicas */}
              <InputField 
                label="Nome do grupo de documento" 
                field="name" 
                placeholder="Digite o nome do grupo de documentos"
              />
              
              {/* Configurações de Disponibilidade */}
              <OptionsWithPool />
              
              {/* Tags e Categorização */}
              <TagsInput disabled={isPublic} />
              
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
