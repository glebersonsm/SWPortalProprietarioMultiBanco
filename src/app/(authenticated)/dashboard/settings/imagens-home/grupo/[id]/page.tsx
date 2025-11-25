"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchGrupoImagemHome, GrupoImagemHome } from "@/services/querys/grupo-imagem-home";
import ImagensListPage from "../../_components/ImagensListPage";

export default function GerenciarImagensGrupoPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const { data: grupo, isLoading } = useQuery({
    queryKey: ["grupoImagemHome", id],
    queryFn: async () => {
      const grupos = await searchGrupoImagemHome({ quantidadeRegistrosRetornar: 100 });
      return grupos.find((g: GrupoImagemHome) => g.id === id) || null;
    },
    enabled: !!id && !isNaN(id),
  });

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Carregando...
      </div>
    );
  }

  if (!grupo) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Grupo não encontrado
      </div>
    );
  }

  return <ImagensListPage grupo={grupo} />;
}

