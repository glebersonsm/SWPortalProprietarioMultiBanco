import * as React from "react";
import AlertDialogModal from "@/components/AlertDialogModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRegraPaxFree } from "@/services/querys/regraPaxFree";
import { RegraPaxFree } from "@/utils/types/regraPaxFree";
import { toast } from "react-toastify";

type DeleteRegraPaxFreeModalProps = {
  regra: RegraPaxFree;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteRegraPaxFreeModal({
  regra,
  open,
  onClose,
  onSuccess,
}: DeleteRegraPaxFreeModalProps) {
  const queryClient = useQueryClient();
  
  const handleDeleteRegra = useMutation({
    mutationFn: deleteRegraPaxFree,
  });

  const handleDelete = () => {
    if (!regra.id) return;
    
    handleDeleteRegra.mutate(regra.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["regrasPaxFree"] });
        toast.success(`Regra "${regra.nome}" removida com sucesso!`);
        onSuccess();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.errors?.[0];
        if (errorMessage) {
          toast.error(errorMessage);
        } else {
          toast.error(
            "Não foi possível deletar a regra nesse momento, por favor tente mais tarde!"
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
      message={`Você tem certeza que deseja deletar a regra "${regra.nome}"? Todas as configurações associadas também serão removidas.`}
      actionText="Deletar regra"
      title="Deletar Regra Tarifária"
      onHandleAction={handleDelete}
    />
  );
}

