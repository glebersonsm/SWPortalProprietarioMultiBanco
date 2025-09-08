import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFaq } from "@/services/querys/faqs";
import {
  Button,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import AlertError from "@/app/(auth)/_components/AlertError";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import TextareaField from "@/components/TextareaField";
import { Faq, GroupFaq } from "@/utils/types/faqs";
import { AxiosError } from "axios";
import useUser from "@/hooks/useUser";
import OptionsWithPool from "@/components/OptionsWithPool";
import TagsInput from "@/components/TagsInput";

type AddFaqModalProps = {
  shouldOpen: boolean;
  groupFaqs: GroupFaq;
};

export default function AddFaqModal({
  shouldOpen,
  groupFaqs,
}: AddFaqModalProps) {
  const { isAdm } = useUser();

  const form = useForm<Faq>({
    defaultValues: {
      question: "",
      response: "",
      available: false,
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
        "Não foi possível adicionar a FAQ nesse momento, por favor tente mais tarde!",
    });
  };

  const closeModal = useCloseModal();
  const queryClient = useQueryClient();
  const handleCreateFaq = useMutation({
    mutationFn: createFaq,
    onError: onErrorHandler,
  });

  function onSubmit(data: Faq) {
    handleCreateFaq.mutate(
      {
        faq: {
          pergunta: data.question,
          resposta: data.response,
          disponivel: data.available ? 1 : 0,
          tagsRequeridas: data.requiredTags?.length
            ? data.requiredTags.map((tag) => tag.id)
            : null,
        },
        groupFaqId: groupFaqs.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["getGroupFaqs"],
          });
          toast.success(`FAQ criada com sucesso!`);
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
          Adicionar novo FAQ
        </DialogTitle>
        <DialogContent
          sx={{
            color: "primary.plainColor",
            fontSize: "14px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          Preencha o formulário para adicionar um FAQ
        </DialogContent>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextareaField label="Pergunta" field="question" />
              <TagsInput name="requiredTags" />

              {isAdm ? (
                <>
                  <TextareaField
                    label="Resposta"
                    field="response"
                    required={false}
                  />
                  <OptionsWithPool />
                </>
              ) : null}
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
                    bgcolor: "#2ca2cc",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#035781",
                    },
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
