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
import useCloseModal from "@/hooks/useCloseModal";
import { createGroupFaqs } from "@/services/querys/groupsFaqs";
import { setFormErrors } from "@/services/errors/formErrors";
import { toast } from "react-toastify";
import AlertError from "@/app/(auth)/_components/AlertError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupFaq } from "@/utils/types/faqs";
import { AxiosError } from "axios";
import OptionsWithPool from "@/components/OptionsWithPool";
import TagsInput from "@/components/TagsInput";

export default function AddGroupFaqModal({
  shouldOpen,
}: {
  shouldOpen: boolean;
}) {
  const form = useForm<GroupFaq>({
    defaultValues: {
      name: "",
      available: false,
      requiredTags: []
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
        "Não foi possível adicionar o grupo de FAQs nesse momento, por favor tente mais tarde!",
    });
  };

  const closeModal = useCloseModal();
  const queryClient = useQueryClient();
  const handleCreateGroupFaqs = useMutation({
    mutationFn: createGroupFaqs,
    onError: onErrorHandler,
  });

  function onSubmit(data: GroupFaq) {
    handleCreateGroupFaqs.mutate(
      {
        nome: data.name,
        disponivel: data.available ? 1 : 0,
        tagsRequeridas: data.requiredTags?.length
          ? data.requiredTags.map((tag) => tag.id)
          : null,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getGroupFaqs"],
          });
          toast.success(`Grupo de FAQs ${data.name} criado com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <Modal
      open={shouldOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          closeModal();
        }
      }}
    >
      <ModalDialog>
        <DialogTitle
          sx={{
            color: "primary.solidHoverBg",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800,
          }}
        >
          Adicionar novo grupo de FAQs
        </DialogTitle>
        <DialogContent
          sx={{
            color: "primary.plainColor",
            fontSize: "14px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          Preencha o formulário para adicionar um grupo de FAQs
        </DialogContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <InputField label="Nome do Grupo de FAQs" field="name" />
              <TagsInput name="requiredTags" />
              <OptionsWithPool />
              <AlertError error={errors.root?.generalError?.message} />
              <Stack direction={"row"} spacing={2} justifyContent={"flex-end"}>
                <Button
                  variant="outlined"
                  color="danger"
                  onClick={() => closeModal()}
                  sx={{
                    marginTop: "10px",
                    width: {
                      xs: "100%",
                      md: "200px",
                    },
                  }}
                >
                  Sair
                </Button>
                <Button
                  type="submit"
                  sx={{
                    marginTop: "10px",
                    width: {
                      xs: "100%",
                      md: "200px",
                    },
                  }}
                >
                  Adicionar
                </Button>
              </Stack>
            </Stack>
          </form>
        </FormProvider>
      </ModalDialog>
    </Modal>
  );
}
