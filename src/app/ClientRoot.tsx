"use client";

import React, { Suspense } from "react";
const ToastContainer = React.lazy(() => import("react-toastify").then((m) => ({ default: m.ToastContainer })));
import ThemeRegistry from "./ThemeRegistry";
import "react-toastify/dist/ReactToastify.css";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
      <Suspense fallback={null}>
        <ToastContainer />
      </Suspense>
    </>
  );
}

