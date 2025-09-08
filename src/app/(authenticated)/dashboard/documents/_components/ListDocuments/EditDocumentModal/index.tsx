import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDocument } from "@/services/querys/document";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import TagsInput from "@/components/TagsInput";
import useCloseModal from "@/hooks/useCloseModal";
import { Document } from "@/utils/types/documents";
import { untransformedDoc } from "@/services/api/transformDocs";
import { AxiosError } from "axios";
import OptionsWithPool from "@/components/OptionsWithPool";

type EditDocumentModalProps = {
  document: Document;
  shouldOpen: boolean;
};

export default function EditDocumentModal({
  document,
  shouldOpen,
}: EditDocumentModalProps) {
  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar o documento nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleEditDocuments = useMutation({
    mutationFn: editDocument,
    onError: onErrorHandler,
  });

  const form = useForm<Document & { removeUnsetTags: boolean }>({
    defaultValues: {
      ...document,
    },
  });
  const {
    formState: { errors },
  } = form;

  const closeModal = useCloseModal();

  function onSubmit(data: Document & { removeUnsetTags: boolean }) {
    const editedDocument = untransformedDoc(data);
    handleEditDocuments.mutate(
      { document: editedDocument },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.success(`Documento ${data.name} editado com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar um documento"
      contentText={`Formulário referente ao documento ${document?.name}`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome do documento" field="name" />
      <OptionsWithPool />
      <TagsInput />
    </FormModal>
  );
}
