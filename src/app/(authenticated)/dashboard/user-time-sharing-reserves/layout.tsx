"use client";
import React from "react";
import PageLayout from "../_components/PageLayout";
import { ReserveSearchProvider } from "@/contexts/ReserveSearchContext";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReserveSearchProvider>
      <PageLayout title="Reservas">{children}</PageLayout>
    </ReserveSearchProvider>
  );
}
