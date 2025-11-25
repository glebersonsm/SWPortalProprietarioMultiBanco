"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormModal from "@/components/FormModal";
import InputField from "@/components/InputField";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";
import {
  saveGrupoImagemHome,
  GrupoImagemHome,
  GrupoImagemHomeInput,
} from "@/services/querys/grupo-imagem-home";
import { toast } from "react-toastify";

type GrupoImagemHomeFormProps = {
  open: boolean;
  onClose: () => void;
  grupo: GrupoImagemHome | null;
  onSuccess: () => void;
};

export default function GrupoImagemHomeForm({
  open,
  onClose,
  grupo,
  onSuccess,
}: GrupoImagemHomeFormProps) {
  const form = useForm<GrupoImagemHomeInput & { requiredTags?: RequiredTags[] | null }>({
    defaultValues: {
      id: undefined,
      name: "",
      requiredTags: [],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        id: grupo?.id,
        name: grupo?.name || "",
        requiredTags: grupo?.tagsRequeridas || [],
      });
    }
  }, [open, grupo, form]);

  const mutation = useMutation({
    mutationFn: saveGrupoImagemHome,
    onSuccess: () => {
      toast.success(grupo ? "Grupo atualizado com sucesso!" : "Grupo criado com sucesso!");
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.errors?.[0] || "Erro ao salvar grupo"
      );
    },
  });

  const onSubmit = (data: GrupoImagemHomeInput & { requiredTags?: RequiredTags[] | null }) => {
    mutation.mutate({
      ...data,
      tagsRequeridas: data.requiredTags?.map((tag) => tag.id) || null,
    });
  };

  return (
    <FormModal
      open={open}
      closeModal={onClose}
      title={grupo ? "Editar Grupo de Imagens" : "Novo Grupo de Imagens"}
      contentText={
        grupo
          ? "Edite as informações do grupo de imagens"
          : "Preencha os dados para criar um novo grupo de imagens"
      }
      type={grupo ? "edit" : "add"}
      form={form}
      errorMessage={undefined}
      onSubmit={onSubmit}
    >
      <InputField
        field="name"
        label="Nome do Grupo"
        required
        disabled={mutation.isPending}
      />
      <TagsInput name="requiredTags" disabled={mutation.isPending} />
    </FormModal>
  );
}

