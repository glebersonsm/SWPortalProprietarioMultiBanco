// Submenu.tsx
import React, { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments, useRouter, usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Stack,
  Typography,
} from "@mui/joy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/joy/Tooltip";
import type { RouteProps } from "@/utils/types/routes";
import { useLoading } from "@/contexts/LoadingContext";
import { closeSidebar } from "../../_utils";

const HoverSummary = styled(AccordionSummary)({
  backgroundColor: "var(--color-secondary)",
  borderRadius: 6,
  height: "32px",
  padding: "0 8px",
  "&:hover": {
    backgroundColor: "var(--color-hover-bg)",
  },
  "&.Mui-expanded": {
    backgroundColor: "var(--color-secondary)",
  },
  "&.Mui-expanded:hover": {
    backgroundColor: "var(--color-hover-bg)",
  },

  "&:before": {
    display: "none",
  },
});

type SubmenuProps = {
  route: RouteProps;
  segment: string | null;
  collapsed?: boolean;
};

export default function Submenu({ route, segment, collapsed = false }: SubmenuProps) {
  const [expanded, setExpanded] = useState(false);
  const segments = useSelectedLayoutSegments();
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading, setLoadingMessage } = useLoading();

  const handleSubmenuNavigation = (path: string, routeName: string) => {
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

  return (
    <>
      <ListItem
        component={Button}
        onClick={() => !collapsed && setExpanded(!expanded)}
        sx={{ textDecoration: "none" }}
      >
        <Tooltip title={route.name} placement="right" arrow>
          <ListItemButton
            className="sidebar-item"
            sx={{
              borderRadius: "md",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 1 : 2,
              "&:hover": {
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%) !important",
                transform: "translateX(4px) scale(1.02)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 6px 15px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)",
                borderColor: "rgba(255, 255, 255, 0.35)",
                backdropFilter: "blur(15px)",
              },
              "&:active": {
                transform: "translateX(2px) scale(0.99)",
                transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <route.icon sx={{ color: "white", fontSize: collapsed ? "1.25rem" : "1rem" }} />
            {!collapsed && (
              <ListItemContent>
                <Typography
                  level="title-sm"
                  sx={{ color: "white", fontWeight: 600, fontSize: "0.65rem" }}
                >
                  {route.name}
                </Typography>
              </ListItemContent>
            )}
            {!collapsed && (
              <ExpandMoreIcon
                sx={{
                  color: "white",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>

      {!collapsed && (
      <Box
        sx={{
          overflow: "hidden",
          transition: "all 0.6s ease",
          maxHeight: expanded ? 500 : 0,
          opacity: expanded ? 1 : 0,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {route.submenu!.map((submenu) => (
          <ListItem
            key={submenu.name}
            sx={{ textDecoration: "none", py: 0.5 }}
          >
            <Tooltip title={submenu.name} placement="right" arrow>
              <ListItemButton
                className={`sidebar-item ${segments.join("/") === submenu.segment ? "selected" : ""}`}
                selected={segments.join("/") === submenu.segment}
                onClick={() => handleSubmenuNavigation(submenu.path, submenu.name)}
                sx={{
                  pl: 4,
                  borderRadius: "md",
                  ml: 2,
                  mr: 2,
                  maxWidth: "calc(100% - 16px)",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important",
                    transform: "translateX(4px) scale(1.01)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(255, 255, 255, 0.25)",
                    backdropFilter: "blur(12px)",
                  },
                  "&.Mui-selected": {
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.12) 100%) !important",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25), 0 6px 15px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    backdropFilter: "blur(15px)",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: "-4px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "50%",
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%)",
                      borderRadius: "0 2px 2px 0",
                      boxShadow: "0 2px 6px rgba(255, 255, 255, 0.2)",
                    },
                  },
                  "&:active": {
                    transform: "translateX(2px) scale(0.99)",
                    transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.15), 0 1px 6px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
              <submenu.icon sx={{ color: "white", fontSize: "1.1rem" }} />
              <ListItemContent>
                <Typography
                  level="title-sm"
                  sx={{ 
                    color: "white", 
                    fontWeight: 500, 
                    fontSize: "0.65rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "180px"
                  }}
                >
                  {submenu.name}
                </Typography>
              </ListItemContent>
            </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </Box>
      )}
    </>
  );
}
