import * as React from "react";
import { useForm } from "react-hook-form";
import InputField from "@/components/InputField";
import FormModal from "@/components/FormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { setFormErrors } from "@/services/errors/formErrors";
import useCloseModal from "@/hooks/useCloseModal";
import { FormLabel, Typography, Box, Button } from "@mui/joy";
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

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = React.useState<string>("");

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
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          border: "1px solid var(--form-input-border)",
          borderRadius: "12px",
          backgroundColor: "var(--form-input-bg)",
          padding: "10px 12px",
        }}
      >
        {(() => {
          const urlRegister = register("url");
          return (
            <input
              accept="image/*"
              type="file"
              id="image-upload"
              style={{ display: "none" }}
              {...urlRegister}
              ref={(el) => {
                urlRegister.ref(el);
                fileInputRef.current = el;
              }}
              onChange={(e) => {
                urlRegister.onChange(e);
                const files = e.target.files;
                setSelectedFileName(
                  files && files.length ? files[0].name : ""
                );
              }}
            />
          );
        })()}

        <Button
          variant="solid"
          color="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          Escolha uma Imagem
        </Button>
        <Typography level="body-sm" sx={{ color: "var(--modal-text-color)" }}>
          {selectedFileName || "Nenhum arquivo selecionado"}
        </Typography>
      </Box>
    </FormModal>
  );
}
