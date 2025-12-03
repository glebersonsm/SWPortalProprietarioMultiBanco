"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ThemeRegistry from "./ThemeRegistry";
import "react-toastify/dist/ReactToastify.css";

const ToastContainer = dynamic(
  () => import("react-toastify").then((m) => m.ToastContainer),
  { ssr: false }
);

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
      {mounted && <ToastContainer />}
    </>
  );
}

