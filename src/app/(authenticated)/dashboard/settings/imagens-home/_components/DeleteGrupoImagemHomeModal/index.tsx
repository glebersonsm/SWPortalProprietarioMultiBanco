import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGrupoImagemHome, GrupoImagemHome } from "@/services/querys/grupo-imagem-home";
import { toast } from "react-toastify";

type DeleteGrupoImagemHomeModalProps = {
  grupo: GrupoImagemHome;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteGrupoImagemHomeModal({
  grupo,
  open,
  onClose,
  onSuccess,
}: DeleteGrupoImagemHomeModalProps) {
  const queryClient = useQueryClient();
  
  const handleDeleteGrupo = useMutation({
    mutationFn: deleteGrupoImagemHome,
  });

  const handleDelete = () => {
    if (!grupo.id) return;
    
    handleDeleteGrupo.mutate(grupo.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["gruposImagemHome"] });
        toast.success(`Grupo de imagens ${grupo.name} removido com sucesso!`);
        onSuccess();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.errors?.[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar o grupo de imagens nesse momento, por favor tente mais tarde!"
          );
        }
        onClose();
      },
    });
  };

  return (
    <AlertDialogModal
      openModal={open}
      closeModal={onClose}
      message={`Você tem certeza que deseja deletar o grupo de imagens "${grupo.name}"? Todas as imagens associadas também serão removidas.`}
      actionText="Deletar grupo"
      title="Deletar Grupo de Imagens"
      onHandleAction={handleDelete}
    />
  );
}

