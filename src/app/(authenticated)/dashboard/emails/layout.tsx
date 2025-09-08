"use client";

import React from "react";
import PageLayout from "../_components/PageLayout";

export default function EmailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout title="E-mails">{children}</PageLayout>;
}
