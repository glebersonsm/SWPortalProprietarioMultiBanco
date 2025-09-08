"use client";
import React from "react";
import FormSettings from "./_components/FormSettings";
import useUser from "@/hooks/useUser";

export default function SettingsPage() {
  const { settingsParams } = useUser();

  return <FormSettings settingsParams={settingsParams} />;
}
