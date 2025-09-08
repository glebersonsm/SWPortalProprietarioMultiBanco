"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout
      title={<span style={{ color: "var(--color-title)" }}>Alterar senha</span>}
    >
      {children}
    </PageLayout>
  );
}
