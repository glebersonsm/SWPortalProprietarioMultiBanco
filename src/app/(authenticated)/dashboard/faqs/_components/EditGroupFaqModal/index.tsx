"use client";

import React from "react";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { useForm } from "react-hook-form";
import OptionsGroup from "../OptionsToGroupFaqs";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editGroupFaqs } from "@/services/querys/groupsFaqs";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import { GroupFaq } from "@/utils/types/faqs";
import { untransformedGroupFaqs } from "@/services/api/transformGroupFaqs";
import { AxiosError } from "axios";
import OptionsToGroupFaqs from "../OptionsToGroupFaqs";
import OptionsWithPool from "@/components/OptionsWithPool";
import TagsInput from "@/components/TagsInput";

type EditGroupFaqModalProps = {
  shouldOpen: boolean;
  groupFaqs: GroupFaq;
};

export default function EditGroupFaqModal({
  groupFaqs,
  shouldOpen,
}: EditGroupFaqModalProps) {
  const form = useForm<GroupFaq>({
    defaultValues: {
      ...groupFaqs,
      requiredTags: groupFaqs?.requiredTags || []
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
        "Não foi possível editar o grupo de FAQs nesse momento, por favor tente mais tarde!",
    });
  };

  const handleEditGroupFaqs = useMutation({
    mutationFn: editGroupFaqs,
    onError: onErrorHandler,
  });

  function onSubmit(data: GroupFaq) {
    const editGroupFaq = untransformedGroupFaqs(data);
    handleEditGroupFaqs.mutate(editGroupFaq, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupFaqs"] });
        toast.success(`Grupo de FAQs ${data.name} editado com sucesso!`);
        closeModal();
      },
    });
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar Grupo de FAQs"
      contentText={`Grupo de FAQ: ${groupFaqs.name}`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome do FAQ" field="name" />
      <TagsInput name="requiredTags" />
      <OptionsWithPool />
    </FormModal>
  );
}
