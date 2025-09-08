"use client";
import React from "react";
import CreateReserva from "../_components/CreateReserva";
import { Stack, Divider } from "@mui/joy";

export default function CreateReservaPage() {
  return (
    <Stack spacing={3}>
      <CreateReserva />
      <Divider />
    </Stack>
  );
}