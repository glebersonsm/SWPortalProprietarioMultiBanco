"use client";

import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LockIcon from "@mui/icons-material/Lock";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// Ícones removidos temporariamente
import { useRouter, useSelectedLayoutSegment, usePathname } from "next/navigation";
import Link from "next/link";
import { closeSidebar } from "../../_utils";
import { removeCookie } from "@/utils/cookies";
import useNavigation from "@/hooks/useNavigation";
import { Sheet, Typography } from "@mui/joy";
import Tooltip from "@mui/joy/Tooltip";
import useUser from "@/hooks/useUser";
import Submenu from "../Submenu";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useLoading } from "@/contexts/LoadingContext";
import "../../../../../styles/global.css";
import React, { useEffect, useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export default function Sidebar() {
  const segment = useSelectedLayoutSegment();
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { userData, settingsParams, isAdm } = useUser();
  const { DASHBOARD_ROUTES } = useNavigation();
  const { setIsLoading, setLoadingMessage } = useLoading();

  // Estado de recolhimento da sidebar (persistido em localStorage)
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      const isCollapsed = saved === "true";
      setCollapsed(isCollapsed);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      // Sincroniza a largura usada pelo layout principal
      document.documentElement.style.setProperty(
        "--Sidebar-width",
        collapsed ? "72px" : "280px"
      );
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(collapsed));
    }
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const handleNavigation = (path: string, routeName: string) => {
    // Verifica se já está na rota de destino
    if (pathname === path) {
      closeSidebar();
      return;
    }
    
    setLoadingMessage(`Carregando ${routeName}...`);
    setIsLoading(true);
    closeSidebar();
    
    // Pequeno delay para mostrar o loading
    setTimeout(() => {
      router.push(path);
    }, 100);
  };

  function handleLogout() {
    queryClient.clear();
    if (typeof window !== "undefined") localStorage.clear();
    removeCookie("sessionId");
    removeCookie("authToken");
    removeCookie("userLogin");
    router.replace("/login");
  }

  const validatedUrl =
    settingsParams?.websiteToBook?.startsWith("http://") ||
    settingsParams?.websiteToBook?.startsWith("https://")
      ? settingsParams?.websiteToBook
      : `http://${settingsParams?.websiteToBook}`;

  if (!userData) return null;

  return (
    <Sheet
      className={`Sidebar ${collapsed ? "collapsed" : ""}`}
      sx={{
        position: "fixed",
        border: "none",
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
        zIndex: 1000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderRight: "2px solid rgba(255, 255, 255, 0.1)",
        background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15), 2px 0 10px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "1px",
          height: "100%",
          background: "linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
        },
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          fontSize: "12px",
          ":root": {
            "--Sidebar-width": "280px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "280px",
            },
            td: {
              whiteSpace: "rap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "130px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--color-white)",
          borderRadius: "0 0 24px 24px",
          mb: 2,
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderTop: "none",
          px: collapsed ? 1 : 2,
          py: collapsed ? 1 : 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.06), transparent)",
          },
        }}
      >
        <Image
          src="/logo/BarretosCountry.png"
          alt="Logo Barretos Country"
          width={collapsed ? 56 : 130}
          height={collapsed ? 41 : 95}
          style={{ objectFit: "contain", display: "block" }}
          priority
        />
        {/* Botão de recolher/expandir */}
        <Tooltip title={collapsed ? "Expandir sidebar" : "Recolher sidebar"} placement="left" arrow>
          <IconButton
            onClick={toggleCollapsed}
            size="sm"
            variant="outlined"
            sx={{
              position: "absolute",
              right: collapsed ? 6 : 10,
              top: 8,
              backgroundColor: "var(--color-white)",
              color: "var(--color-secondary)",
              borderColor: "var(--color-white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              "&:hover": { backgroundColor: "var(--color-white)" },
            }}
          >
            {collapsed ? (
              <ChevronRightRoundedIcon />
            ) : (
              <ChevronLeftRoundedIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          px: 3,
          py: 1,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.4)",
            },
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1.5,
            "--List-nestedInsetStart": "32px",
            "--ListItem-radius": (theme) => theme.vars.radius.md,
            mb: 2,
          }}
        >
          {DASHBOARD_ROUTES.map((route) => {
            const isSelected = segment === route.segment;
            return route.submenu ? (
              <Submenu key={route.segment} route={route} segment={segment} collapsed={collapsed} />
            ) : (
              <ListItem
                key={route.name}
                sx={{ textDecoration: "none" }}
              >
                <Tooltip title={route.name} placement="right" arrow>
                  <ListItemButton
                    className={`sidebar-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleNavigation(route.path, route.name)}
                    sx={{
                      justifyContent: collapsed ? "center" : "flex-start",
                      px: collapsed ? 1 : 2,
                    }}
                  >
                    <route.icon sx={{ color: "inherit", fontSize: collapsed ? "1.25rem" : "1rem" }} />
                    {!collapsed && (
                      <ListItemContent>
                        <Typography
                          level="title-sm"
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            color: "inherit",
                            fontSize: "0.65rem",
                          }}
                        >
                          {route.name}
                        </Typography>
                      </ListItemContent>
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}

          {!collapsed && settingsParams?.websiteToBook &&
            settingsParams?.websiteToBook.length > 10 && (
              <>
                <Box
                  sx={{
                    mt: 4,
                    mb: 2,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      transform: "translateY(-50%)",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.4)",
                      boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
                    },
                  }}
                />
                <ListItem
                  href={validatedUrl}
                  component={Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", mb: 2 }}
                >
                  <ListItemButton
                    className="sidebar-item"
                    sx={{ 
                      justifyContent: "center",
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      "&:hover": {
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%) !important",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                      },
                    }}
                  >
                    <Typography
                      level="title-sm"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        color: "inherit",
                        letterSpacing: "0.5px",
                        fontSize: "0.65rem",
                      }}
                    >
                      RESERVAR AGORA
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <Box
                  sx={{
                    mb: 2,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: 0,
                      right: 0,
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                      transform: "translateY(-50%)",
                    },
                  }}
                />
              </>
            )}
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.md,
            "--List-gap": "12px",
            mb: 2,
            fontFamily: "sans-serif",
            pt: 2,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            },
          }}
        >
          <ListItem>
            <Tooltip title="Alterar senha" placement="right" arrow>
              <ListItemButton
                className={`sidebar-item ${
                  segment === "change-password" ? "selected" : ""
                }`}
                onClick={() => handleNavigation(`/dashboard/change-password`, "Alterar senha")}
                sx={{ justifyContent: collapsed ? "center" : "flex-start", px: collapsed ? 1 : 2 }}
              >
                <LockIcon sx={{ color: "inherit", fontSize: collapsed ? "1.25rem" : "1rem" }} />
                {!collapsed && (
                  <Typography
                    level="title-sm"
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      color: "inherit",
                      fontSize: "0.65rem",
                    }}
                  >
                    Alterar senha
                  </Typography>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>

          {isAdm && (
            <ListItem>
              <Tooltip title="Configurações" placement="right" arrow>
                <ListItemButton
                  className={`sidebar-item ${
                    segment === "settings" ? "selected" : ""
                  }`}
                  onClick={() => handleNavigation(`/dashboard/settings`, "Configurações")}
                  sx={{ justifyContent: collapsed ? "center" : "flex-start", px: collapsed ? 1 : 2 }}
                >
                  <SettingsRoundedIcon sx={{ color: "inherit", fontSize: collapsed ? "1.25rem" : "1rem" }} />
                  {!collapsed && (
                    <Typography
                      level="title-sm"
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        color: "inherit",
                        fontSize: "0.65rem",
                      }}
                    >
                      Configurações
                    </Typography>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )}
        </List>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px 24px 0 0",
          p: 3,
          width: "100%",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.15), 0 -2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
          mt: 2,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderBottom: "none",
          minHeight: 80,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)",
          },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            level="title-sm"
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "var(--color-sidebar-user-name)",
              fontSize: "0.65rem",
            }}
          >
            {userData?.name}
          </Typography>
          <Typography
            level="body-xs"
            sx={{
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              color: "var(--color-email-text)",
              fontSize: "0.65rem",
            }}
          >
            {userData?.email}
          </Typography>
        </Box>
        <Tooltip title="Sair do sistema" placement="top">
          <IconButton
            size="sm"
            variant="plain"
            sx={{
              color: "var(--color-button-exit-text)",
              border: "2px solid var(--color-button-exit-border)",
              borderRadius: "12px",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                transition: "left 0.6s ease",
              },
              "&:hover": {
                backgroundColor: "var(--color-button-exit-hover-bg)",
                color: "var(--color-button-exit-hover-text)",
                borderColor: "var(--color-button-exit-hover-border)",
                transform: "scale(1.08) translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 10px rgba(0, 0, 0, 0.1)",
                "&::before": {
                  left: "100%",
                },
              },
              "&:active": {
                transform: "scale(1.02) translateY(0px)",
                transition: "all 0.1s ease",
              },
            }}
            onClick={handleLogout}
          >
            <LogoutRoundedIcon sx={{ fontSize: "1.2rem" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Sheet>
  );
}
