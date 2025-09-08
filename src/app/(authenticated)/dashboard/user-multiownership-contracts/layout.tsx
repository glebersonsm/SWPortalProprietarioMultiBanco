import React from "react";
import PageLayout from "../_components/PageLayout";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout title="Meus contratos">{children}</PageLayout>;
}
