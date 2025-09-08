"use client";

import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import ListDocuments from "../ListDocuments";
import Badge from "@mui/joy/Badge";
import IconOpenModal from "@/components/IconOpenModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GroupOfDocs } from "@/utils/types/documents";
import useUser from "@/hooks/useUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";

export default function ListGroupOfDocuments({
  groupDocuments,
}: {
  groupDocuments: GroupOfDocs;
}) {
  const { isAdm } = useUser();

  return (
    <Accordion
      sx={{
        background: "var(--card-bg-gradient, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-surface, #1f1f1f) 100%))",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid var(--card-border-color, rgba(255, 255, 255, 0.1))",
        boxShadow: "0 8px 32px var(--card-shadow-color, rgba(0, 0, 0, 0.1))",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:before": { display: "none" },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 40px var(--card-shadow-color-hover, rgba(0, 0, 0, 0.15))",
          background: "var(--card-bg-gradient-hover, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.12)) 100%))",
        },
        "&.Mui-expanded": {
          marginTop: 2,
          transform: "scale(1.02)",
          background: "var(--card-bg-gradient-expanded, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.15)) 100%))",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon sx={{ 
            color: "white", 
            fontSize: "28px",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
            transition: "all 0.3s ease"
          }} />
        }
        disableRipple
        sx={{
          background: "var(--card-details-gradient, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.1)) 100%))",
          backdropFilter: "blur(15px)",
          flexDirection: "row-reverse",
          borderRadius: "12px",
          minHeight: "64px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": { 
            background: "linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.15)) 100%)",
            transform: "translateY(-1px)"
          },
          "&.Mui-expanded": {
            background: "linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.2)) 100%)",
            minHeight: "64px",
            transform: "scale(1.01)"
          },
          py: 1,
          px: 2,
          ".MuiAccordionSummary-content": {
            flexDirection: "row",
            alignItems: "center",
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 800,
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.4,
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateX(4px)",
              textShadow: "0 4px 8px rgba(0, 0, 0, 0.4)"
            }
          }}
        >
          {groupDocuments.name}
        </Typography>

        <Box ml="auto" />

        <Stack direction="row" spacing={1} alignItems="center">
          <Badge
            badgeContent={groupDocuments.documents.length}
            size="sm"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "var(--color-badge-bg)",
                color: "var(--color-badge-text)",
                fontWeight: 600,
                borderRadius: "8px",
              },
            }}
          >
            <DescriptionIcon sx={{ color: "var(--color-text-primary)" }} />
          </Badge>

          {isAdm ? (
            <>
              <IconOpenModal
                params={{ groupDocumentId: groupDocuments.id }}
                type="add-document"
                sxoverride={{ color: "var(--color-text-primary)" }}
                tooltip="Adicionar documento"
                icon={<AddCircleOutlineIcon />}
              />
              <IconOpenModal
                params={{ groupDocumentId: groupDocuments.id }}
                type="edit"
                sxoverride={{ color: "var(--color-text-primary)" }}
                tooltip="Editar grupo de documentos"
              />
              <IconOpenModal
                params={{ groupDocumentId: groupDocuments.id }}
                type="delete"
                sxoverride={{ color: "var(--color-text-primary)" }}
                tooltip="Deletar/Remover grupo de documentos"
              />
            </>
          ) : null}
        </Stack>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          background: "var(--card-details-gradient, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-surface, rgba(42, 42, 42, 0.02)) 100%))",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          borderTop: "none",
          p: 0,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "16px",
            right: "16px",
            height: "1px",
            background: "var(--card-border-gradient, linear-gradient(90deg, transparent 0%, var(--card-border-color, rgba(42, 42, 42, 0.3)) 50%, transparent 100%))"
          }
        }}
      >
        <Stack spacing={2} padding="10px">
          <ListDocuments groupDocuments={groupDocuments} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
