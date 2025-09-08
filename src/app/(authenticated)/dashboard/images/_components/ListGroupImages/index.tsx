"use client";

import Badge from "@mui/joy/Badge";
import IconOpenModal from "@/components/IconOpenModal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useUser from "@/hooks/useUser";
import { GroupImages } from "@/utils/types/groupImages";
import ListImages from "../ListImages";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";

export default function ListGroupImages({
  groupImages,
}: {
  groupImages: GroupImages;
}) {
  const { isAdm } = useUser();

  return (
    <Accordion
      disableGutters
      elevation={0}
      square={false}
      sx={{
        background: "var(--gallery-bg-gradient, linear-gradient(135deg, #035781 0%, rgba(3, 87, 129, 0.1) 100%))",
        borderRadius: "12px",
        boxShadow: "0 4px 20px var(--gallery-shadow-color, rgba(3, 87, 129, 0.15)), 0 2px 8px var(--gallery-shadow-color, rgba(44, 162, 204, 0.1))",
        border: "1px solid var(--gallery-border-color, rgba(44, 162, 204, 0.2))",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          marginTop: 2,
          transform: "translateY(-2px)",
          background: "var(--gallery-bg-gradient-expanded, linear-gradient(135deg, #035781 0%, rgba(3, 87, 129, 0.15) 100%))",
          boxShadow: "0 8px 32px var(--gallery-shadow-color-expanded, rgba(3, 87, 129, 0.25)), 0 4px 16px var(--gallery-shadow-color, rgba(44, 162, 204, 0.15))"
        },
        "&:hover": {
          transform: "translateY(-1px)",
          background: "var(--gallery-bg-gradient-hover, linear-gradient(135deg, #035781 0%, rgba(3, 87, 129, 0.12) 100%))",
          boxShadow: "0 6px 24px var(--gallery-shadow-color-hover, rgba(3, 87, 129, 0.2)), 0 3px 12px var(--gallery-shadow-color, rgba(44, 162, 204, 0.12))"
        }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ 
              color: "white",
              fontSize: "1.5rem",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              transition: "all 0.3s ease"
            }}
          />
        }
        disableRipple
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          flexDirection: "row-reverse",
          borderRadius: "12px 12px 0 0",
          minHeight: "64px !important",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.15)",
            transform: "scale(1.01)"
          },
          "&.Mui-expanded": {
            borderRadius: "12px 12px 0 0",
            background: "rgba(255, 255, 255, 0.2)"
          },
          py: 2,
          px: 3,
          ".MuiAccordionSummary-content": {
            flexDirection: "row",
            alignItems: "center",
            margin: "0 !important"
          },
          ".MuiAccordionSummary-expandIconWrapper": {
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          }
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "white",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "1.1rem",
            lineHeight: 1.4,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease",
            flex: 1,
            "&:hover": {
              transform: "translateX(4px)",
              textShadow: "0 3px 6px rgba(0,0,0,0.4)"
            }
          }}
        >
          {groupImages.name}
        </Typography>
        <Box ml="auto" />

        <Stack direction="row" spacing={1} alignItems="center">
          <Badge
            badgeContent={groupImages.images.length}
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
            <InsertPhotoOutlinedIcon sx={{ color: "var(--color-doc-icon)" }} />
          </Badge>

          <IconOpenModal
            params={{ groupImagesId: groupImages.id }}
            type="show-images"
            sxoverride={{
              color: "var(--color-doc-icon)",
              transition: "0.3s",
            }}
            icon={<VisibilityIcon />}
            tooltip="Visualizar imagens"
          />

          {isAdm ? (
            <>
              <IconOpenModal
                params={{ groupImagesId: groupImages.id }}
                type="add-image"
                sxoverride={{ color: "var(--color-doc-icon)" }}
                icon={<AddCircleOutlineIcon />}
                tooltip="Adicionar imagem"
              />
              <IconOpenModal
                params={{ groupImagesId: groupImages.id }}
                type="edit"
                sxoverride={{
                  color: "var(--color-doc-icon)",
                  transition: "0.6s",
                }}
                tooltip="Editar grupo de imagens"
              />
              <IconOpenModal
                params={{ groupImagesId: groupImages.id }}
                sxoverride={{
                  color: "var(--color-doc-icon)",
                  transition: "0.6s",
                }}
                type="delete"
                tooltip="Deletar/Remover grupo de imagens"
              />
            </>
          ) : null}
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          background: "var(--gallery-details-gradient, linear-gradient(180deg, #035781 0%, rgba(3, 87, 129, 0.05) 100%))",
          backdropFilter: "blur(10px)",
          borderRadius: "0 0 12px 12px",
          border: "1px solid var(--gallery-border-color, rgba(44, 162, 204, 0.1))",
          borderTop: "none",
          px: 3,
          py: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "var(--gallery-border-gradient, linear-gradient(90deg, #035781 0%, rgba(3, 87, 129, 0.3) 100%))"
          }
        }}
      >
        <ListImages groupImages={groupImages} />
      </AccordionDetails>
    </Accordion>
  );
}
