"use client";

import { Button } from "@mui/joy";
import { useRouter } from "next/navigation";
import React from "react";

export default function BackButton({
  isAuthorized,
}: {
  isAuthorized: boolean;
}) {
  const router = useRouter();

  const handleBack = () =>
    isAuthorized ? router.back() : router.push("/login");
  return (
    <Button sx={{ width: "150px", height: "40px" }} onClick={handleBack}>
      {isAuthorized ? "Voltar" : "Voltar para Login"}
    </Button>
  );
}
