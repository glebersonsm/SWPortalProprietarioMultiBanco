"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";
import Add from "@mui/icons-material/Add";
import ButtonOpenModal from "@/components/ButtonOpenModal";
import useUser from "@/hooks/useUser";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdm } = useUser();

  return (
    <PageLayout
      title="Documentos"
      addButton={
        isAdm ? (
          <ButtonOpenModal
            sx={{
              bgcolor: "#035781",
              "&:hover": {
                filter: "brightness(1.2)",
              },
            }}
            type="add"
            startIcon={<Add />}
            text="Adicionar grupo de documentos"
          />
        ) : null
      }
    >
      {children}
    </PageLayout>
  );
}
