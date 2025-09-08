import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroupDocuments } from "@/services/querys/groupsDocuments";
import { toast } from "react-toastify";
import useCloseModal from "@/hooks/useCloseModal";
import { GroupOfDocs } from "@/utils/types/documents";

type DeleteGroupOfDocsModalProps = {
  groupDocuments: GroupOfDocs;
  shouldOpen: boolean;
};

export default function DeleteGroupOfDocsModal({
  groupDocuments,
  shouldOpen,
}: DeleteGroupOfDocsModalProps) {
  const queryClient = useQueryClient();
  const handleDeleteGroupOfDocuments = useMutation({
    mutationFn: deleteGroupDocuments,
  });

  const closeModal = useCloseModal();
  

  const handleDelete = () => {
    handleDeleteGroupOfDocuments.mutate(groupDocuments.id, {
      onSuccess: () => {
        queryClient.refetchQueries({ queryKey: ["getGroupsDocuments"] });
        toast.success(
          `Grupo de documentos ${groupDocuments.name} removido com sucesso!`
        );
      },
      onError: (error: any) => {
        const errorMessage = error.response.data.errors[0];
        if (errorMessage) {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.error(errorMessage);
        } else {
          queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
          toast.error(
            "Não foi possível deletar o grupo de documentos nesse momento, por favor teste mais tarde!"
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["getGroupsDocuments"] });
        closeModal();
      },
    });
  };

  return (
    <AlertDialogModal
      openModal={shouldOpen}
      closeModal={closeModal}
      message={`Você tem certeza que deseja deletar o grupo de documentos ${groupDocuments.name}`}
      actionText="Deletar o grupo"
      title={"Deletar Grupo de Documentos"}
      onHandleAction={handleDelete}
    />
  );
}
