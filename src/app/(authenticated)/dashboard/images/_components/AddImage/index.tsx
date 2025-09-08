import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import useCloseModal from "@/hooks/useCloseModal";
import { FormLabel, Typography, Box } from "@mui/joy";
import { AxiosError } from "axios";
import { GroupImages } from "@/utils/types/groupImages";
import { addImage } from "@/services/querys/images";
import TagsInput from "@/components/TagsInput";
import { RequiredTags } from "@/utils/types/tags";

type AddImageData = {
  name: string;
  url: FileList;
  requiredTags: RequiredTags[] | null;
};

type AddImageModalProps = {
  groupImage: GroupImages;
  shouldOpen: boolean;
};

export default function AddImageModal({
  groupImage,
  shouldOpen,
}: AddImageModalProps) {
  const form = useForm<AddImageData>();

  const {
    formState: { errors },
    register,
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

  const handleAddImage = useMutation({
    mutationFn: addImage,
    onError: onErrorHandler,
  });

  const closeModal = useCloseModal();

  function onSubmit(data: AddImageData) {
    handleAddImage.mutate(
      {
        image: data,
        groupImageId: groupImage.id,
        tagsRequeridas: null
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getGroupsImages"] });
          toast.success(`Imagem ${data.name} criada com sucesso!`);
          closeModal();
        },
      }
    );
  }

  return (
    <FormModal
      open={shouldOpen}
      closeModal={closeModal}
      title="Adicionar uma imagem"
      contentText={`Preencha o formulário para adicionar uma nova imagem ao grupo de imagens ${groupImage.name}`}
      type="add"
      form={form}
      onSubmit={onSubmit}
      errorMessage={errors.root?.generalError?.message}
    >
      <InputField label="Nome da imagem" field="name" />
      {/* <TagsInput /> */}
      <Typography color="danger" level="title-sm">
        *Obs.: Por favor, adicione apenas imagens com proporção em torno de 1:8 de no máximo 2mb.
      </Typography>
      <FormLabel>Imagem</FormLabel>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          "& input[type='file']": {
            padding: "12px 16px",
            cursor: "pointer",
            border: "2px solid #e2e8f0",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.875rem",
            width: "100%",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            "&:hover": {
              borderColor: "#2ca2cc",
              backgroundColor: "#f8fafc",
              boxShadow: "0 4px 8px rgba(44, 162, 204, 0.1)",
            },
            "&:focus": {
              outline: "none",
              borderColor: "#2ca2cc",
              boxShadow: "0 0 0 3px rgba(44, 162, 204, 0.1)",
            },
          },
          "& input[type='file']::-webkit-file-upload-button": {
            backgroundColor: "#2ca2cc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            marginRight: "12px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 4px rgba(44, 162, 204, 0.2)",
            "&:hover": {
              backgroundColor: "#035781",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 8px rgba(44, 162, 204, 0.3)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 2px 4px rgba(44, 162, 204, 0.2)",
            },
          },
          "& input[type='file']::-moz-file-upload-button": {
            backgroundColor: "#2ca2cc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            marginRight: "12px",
            cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#035781",
            },
          },
        }}
      >
        <input accept="image/*" type="file" {...register("url")} />
      </Box>
    </FormModal>
  );
}
