"use client";

import React from "react";
import FormModal from "@/components/FormModal";
import { useForm } from "react-hook-form";
import TextareaField from "@/components/TextareaField";
import useCloseModal from "@/hooks/useCloseModal";
import OptionsToFaq from "../../OptionsToFaq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editFaq } from "@/services/querys/faqs";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import { Faq, FaqSent, GroupFaq } from "@/utils/types/faqs";
import { untransformedFaq } from "@/services/api/transformFaqs";
import { AxiosError } from "axios";
import OptionsWithPool from "@/components/OptionsWithPool";
import TagsInput from "@/components/TagsInput";

type EditFaqModalProps = {
  faq: Faq;
  groupFaq: GroupFaq;
  shouldOpen: boolean;
};

type editFaqProps = {
  faq: FaqSent;
};

export default function EditFaqModal({
  faq,
  groupFaq,
  shouldOpen,
}: EditFaqModalProps) {
  const form = useForm<Faq  & { removeUnsetTags: boolean }>({
    defaultValues: {
      ...faq,
      removeUnsetTags: false,
    },
  });

  const {
    formState: { errors },
  } = form;

  const closeModal = useCloseModal();
  const queryClient = useQueryClient();

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar a FAQ nesse momento, por favor tente mais tarde!",
    });
  };
  const handleEditFaq = useMutation({
    mutationFn: editFaq,
    onError: onErrorHandler,
  });

  function onSubmit(data: Faq  & { removeUnsetTags: boolean }) {
    const editedFaq = untransformedFaq(data);
    handleEditFaq.mutate(
      {
        faq: editedFaq,
        groupFaqId: groupFaq.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupFaqs"] });
          toast.success(`FAQ editada com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar FAQ"
      contentText={`Formulário referente a pergunta "${faq?.question}"`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <TextareaField colorLabel="primary.solidHoverBg" label="Pergunta" field="question" />
      <TextareaField colorLabel="primary.solidHoverBg" label="Resposta" field="response" />
      <TagsInput name="requiredTags" />
      <OptionsWithPool />
    </FormModal>
  );
}
