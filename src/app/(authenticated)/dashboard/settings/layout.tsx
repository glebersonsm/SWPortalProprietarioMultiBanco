"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout title="Configurações">{children}</PageLayout>;
}
