import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import useCloseModal from "@/hooks/useCloseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDocument } from "@/services/querys/document";
import { toast } from "react-toastify";
import { Document } from "@/utils/types/documents";

type DeleteDocumentModalProps = {
  document: Document;
  shouldOpen: boolean;
};

export default function DeleteDocumentModal({
  document,
  shouldOpen,
}: DeleteDocumentModalProps) {
  const queryClient = useQueryClient();

  const closeModal = useCloseModal();

  const handleDeleteDocument = useMutation({ mutationFn: deleteDocument });

  const handleDelete = () => {
    handleDeleteDocument.mutate(document.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
        toast.success(`Documento ${document.name} removido com sucesso!`);
      },
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
        toast.error(
          "Não foi possível deletar o documento nesse momento, por favor teste mais tarde!"
        );
      },
      onSettled: () => {
        closeModal();
      },
    });
  };
  return (
    <>
      <AlertDialogModal
        openModal={shouldOpen}
        closeModal={closeModal}
        message={`Você tem certeza que deseja deletar o documento ${document.name}`}
        actionText="Deletar documento"
        title={"Deletar documento"}
        onHandleAction={handleDelete}
      />
    </>
  );
}
