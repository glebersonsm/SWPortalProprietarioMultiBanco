"use client";

import React, { useEffect } from "react";
import Sidebar from "./_components/Sidebar";
import { Breadcrumbs, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import Header from "./_components/Header";
import Link from "@/components/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import {
  redirect,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";
import useNavigation from "@/hooks/useNavigation";
import useUser from "@/hooks/useUser";
import { ADM_SEGMENTS } from "@/utils/adminSegments";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useNavigationLoading } from "@/hooks/useNavigationLoading";

const DashboardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <LoadingProvider>
      <DashboardContent>{children}</DashboardContent>
      <LoadingOverlay />
    </LoadingProvider>
  );
};

const DashboardContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const segment = useSelectedLayoutSegment();
  const segments = useSelectedLayoutSegments();
  const { isAdm } = useUser();
  const { getCurrentRoute } = useNavigation();
  const currentRoute = getCurrentRoute(segment);
  const isHomePage = currentRoute?.name === "Home";
  
  // Inicializa o hook de navegação com loading
  useNavigationLoading();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const padrao = localStorage.getItem("padraoDeCor");
      if (padrao?.toLowerCase() === "black") {
        const existing = document.getElementById(
          "theme-css"
        ) as HTMLLinkElement;
        if (existing) {
          existing.href = "/styles/theme-black.css";
        } else {
          const link = document.createElement("link");
          link.id = "theme-css";
          link.rel = "stylesheet";
          link.href = "/styles/theme-black.css";
          document.head.appendChild(link);
        }

        document.documentElement.setAttribute("data-theme", "Black");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }, []);

  // Evita retornar null para não causar diferenças de hidratação entre SSR/CSR.
  // O layout renderiza de forma estável e o breadcrumb só aparece quando a rota atual estiver disponível.

  if (!isAdm && segment && ADM_SEGMENTS.includes(segment)) {
    redirect("/dashboard");
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        className="MainContent"
        sx={{
          px: isHomePage ? { xs: 4, md: 12 } : { xs: 2, md: 6 },
          pt: isHomePage
            ? {
                xs: "calc(22px + var(--Header-height))",
                sm: "calc(22px + var(--Header-height))",
                md: 6,
              }
            : {
                xs: "calc(22px + var(--Header-height))",
                sm: "calc(22px + var(--Header-height))",
                md: 3,
              },
          pb: isHomePage ? { xs: 4, sm: 4, md: 6 } : { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100dvh",
          gap: 1,
          marginLeft: { md: "var(--Sidebar-width)" },
        }}
      >
        {currentRoute && !isHomePage && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="/dashboard"
                aria-label="Home"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  color: "var(--color-breadcrumb-home)",
                  outline: "none",
                  "&:hover": { outline: "none" },
                  "&:focus": { outline: "none" },
                }}
              >
                <HomeRoundedIcon />
              </Link>

              <Link
                underline="hover"
                href="/dashboard"
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  color: "var(--color-breadcrumb-dashboard)",
                  outline: "none",
                  "&:hover": { outline: "none" },
                  "&:focus": { outline: "none" },
                }}
              >
                Dashboard
              </Link>

              {segments.map((segment, index) => {
                const route = getCurrentRoute(segment);
                const likeLastItem = index === segments.length - 1;
                const noRote =
                  route?.name === "multiownership" ||
                  route?.name === "time-sharing" ||
                  route?.name === "Multipropriedade" ||
                  route?.name === "Time Sharing";
                return likeLastItem || noRote ? (
                  <Typography
                    key={`${segment}-${index}`}
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      color: "var(--color-breadcrumb-final)",
                    }}
                  >
                    {route?.name}
                  </Typography>
                ) : (
                  <Link
                    key={`${segment}-${index}`}
                    underline="hover"
                    color="neutral"
                    href={noRote ? "#" : route?.path}
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 700,
                      color: "var(--color-breadcrumb-final)",
                      outline: "none",
                      "&:hover": { outline: "none" },
                      "&:focus": { outline: "none" },
                    }}
                  >
                    {route?.name}
                  </Link>
                );
              })}
            </Breadcrumbs>
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            margin: "auto%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
