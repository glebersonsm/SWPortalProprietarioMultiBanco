import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { createDocument } from "@/services/querys/document";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TagsInput from "@/components/TagsInput";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import useCloseModal from "@/hooks/useCloseModal";
import { GroupOfDocs, Document } from "@/utils/types/documents";
import { AxiosError } from "axios";
import { RequiredTags } from "@/utils/types/tags";
import OptionsWithPool from "@/components/OptionsWithPool";

type AddDocData = {
  name: string;
  requiredTags: RequiredTags[] | null;
  available: boolean;
  path: FileList;
};

type AddDocumentsModalProps = {
  groupDocuments: GroupOfDocs;
  shouldOpen: boolean;
};

export default function AddDocumentsModal({
  groupDocuments,
  shouldOpen,
}: AddDocumentsModalProps) {
  const form = useForm<Document>();

  const {
    formState: { errors },
  } = form;

  const onErrorHandler = (error: AxiosError<{ errors?: string[] }>) => {
    setFormErrors({
      error,
      form,
      generalMessage:
        "Não foi possível adicionar o documento nesse momento, por favor tente mais tarde!",
    });
  };

  const queryClient = useQueryClient();
  const handleCreateDocuments = useMutation({
    mutationFn: createDocument,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: AddDocData) {
    const newDocument = {
      nome: data.name,
      tagsRequeridas: data.requiredTags?.values != null ? data.requiredTags?.map((tag) => tag.id) : null,
      disponivel: data.available ? 1 : 0,
      path: data.path,
    };

    handleCreateDocuments.mutate(
      {
        document: newDocument,
        groupDocumentId: groupDocuments.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.success(`Documento ${data.name} criado com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Adicionar um documento"
      contentText={`Preencha o formulário para adicionar um novo documento ao grupo de documentos ${groupDocuments?.name}`}
      type="add"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      {/* Informações Básicas */}
      <InputField 
        label="Nome do documento" 
        field="name" 
        placeholder="Digite o nome do documento"
      />
      
      {/* Configurações de Disponibilidade */}
      <OptionsWithPool />
      
      {/* Tags e Categorização */}
      <TagsInput />
      
      {/* Upload de Arquivo */}
      <InputField 
        label="Arquivo" 
        field="path" 
        type="file"
        helperText="Selecione o arquivo do documento (PDF, DOC, DOCX)"
      />
    </FormModal>
  );
}
