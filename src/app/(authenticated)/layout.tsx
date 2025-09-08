import { redirect } from "next/navigation";
import React from "react";
import { cookies } from "next/headers";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies();
  const hasAuthCookie = cookie.has("authToken");

  if (!hasAuthCookie) {
    redirect("/login");
  }

  return <>{children}</>;
}
