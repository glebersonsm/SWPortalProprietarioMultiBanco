import { Button, Card, Divider, Stack } from "@mui/joy";
import Image, { StaticImageData } from "next/image";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import EmptyImage from "@/assets/empty-image.png";

interface props {
  initialImage?: string;
  field: string;
}

export default function PreviewImage({ initialImage, field }: props) {
  const [previewImage, setPreviewImage] = useState<string | StaticImageData>(
    initialImage?.trim() || EmptyImage
  );

  const { setValue } = useFormContext();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue(field, file);
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card sx={{ width: 170, height: 180 }}>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Image
          src={previewImage || EmptyImage}
          alt="Imagem"
          width={120}
          height={80}
          unoptimized
          className="preview-image"
        />
      </Stack>

      <Divider />

      <Stack direction="row" justifyContent="center">
        <input
          ref={fileInput}
          type="file"
          hidden
          accept="image/*"
          id={field}
          className="hidden-input"
          onChange={handleImageChange}
        />

        <label htmlFor={field}>
          <Button onClick={() => fileInput.current?.click()}>
            {previewImage && previewImage !== EmptyImage
              ? "Alterar"
              : "Adicionar"}
          </Button>
        </label>
      </Stack>
    </Card>
  );
}
