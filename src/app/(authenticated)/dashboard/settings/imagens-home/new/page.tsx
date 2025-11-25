"use client";
import React from "react";
import { useRouter } from "next/navigation";
import GrupoImagemHomeFormPage from "../_components/GrupoImagemHomeFormPage";

export default function NewGrupoImagemHomePage() {
  const router = useRouter();

  return (
    <GrupoImagemHomeFormPage
      grupo={null}
      onSuccess={() => {
        router.push("/dashboard/settings/imagens-home");
      }}
      onCancel={() => {
        router.push("/dashboard/settings/imagens-home");
      }}
    />
  );
}

