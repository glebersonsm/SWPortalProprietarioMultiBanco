"use client";

import React from "react";
import { Stack } from "@mui/joy";

export default function ReservarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={2}>
      {children}
    </Stack>
  );
}