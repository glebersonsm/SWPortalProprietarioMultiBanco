import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import TagsInput from "@/components/TagsInput";
import { setFormErrors } from "@/services/errors/formErrors";
import { toast } from "react-toastify";
import { editGroupDocuments } from "@/services/querys/groupsDocuments";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupOfDocs } from "@/utils/types/documents";
import { untransformedGroupOfDocs } from "@/services/api/transformGroupOfDocs";
import { AxiosError } from "axios";
import OptionsWithPool from "@/components/OptionsWithPool";

type EditGroupOfDocsModalProps = {
  groupDocuments: GroupOfDocs;
  shouldOpen: boolean;
};

export default function EditGroupOfDocsModal({
  groupDocuments,
  shouldOpen,
}: EditGroupOfDocsModalProps) {
  const form = useForm<GroupOfDocs & { removeUnsetTags: boolean }>({
    defaultValues: {
      ...groupDocuments,
    },
  });

  const {
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível editar o grupo de documentos nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleEditGroupOfDocuments = useMutation({
    mutationFn: editGroupDocuments,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: GroupOfDocs & { removeUnsetTags: boolean }) {
    handleEditGroupOfDocuments.mutate(untransformedGroupOfDocs(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
        toast.success(`Grupo de documentos ${data.name} editado com sucesso!`);
        closeModal();
      },
    });
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Editar grupo de documentos"
      contentText={`Grupo de documento: ${groupDocuments?.name}`}
      type="edit"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome do grupo de documento" field="name" />
      <OptionsWithPool />
      <TagsInput />
    </FormModal>
  );
}
