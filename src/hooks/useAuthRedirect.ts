"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookies";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("authToken");

    if (!token) {
      router.push("/login"); // redireciona para a tela de login
    }
  }, [router]);
}