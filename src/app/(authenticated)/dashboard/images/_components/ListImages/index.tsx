import * as React from "react";
import IconOpenModal from "@/components/IconOpenModal";
import DeleteIcon from "@mui/icons-material/Delete";
import useUser from "@/hooks/useUser";
import { GroupImages } from "@/utils/types/groupImages";
import { Image } from "@/utils/types/images";
import { Box, List, ListItem, Typography } from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";

type ListImagesProps = {
  groupImages: GroupImages;
};

export default function ListImages({ groupImages }: ListImagesProps) {
  const { isAdm } = useUser();

  return (
    <Box sx={{ padding: 0 }}>
      <List sx={{ "--ListItem-paddingY": "0px", gap: 1.5 }}>
        {groupImages.images.map((image: Image) => (
          <ListItem
            key={image.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, var(--card-bg-primary, #035781) 0%, var(--card-bg-surface, rgba(3, 87, 129, 0.03)) 100%)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "10px",
              margin: "8px 16px",
              padding: "12px 20px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, var(--card-bg-primary, #035781) 0%, var(--card-bg-hover, rgba(3, 87, 129, 0.05)) 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "white",
                fontWeight: 600,
                fontSize: "0.95rem",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {image.name}
            </Typography>
            <Box>
              {isAdm ? (
                <>
                  <IconOpenModal
                    params={{
                      groupImagesId: groupImages.id,
                      imageId: image.id,
                    }}
                    type="delete-image"
                    icon={<DeleteIcon />}
                    sxoverride={{
                      color: "var(--color-doc-item-icon)",
                      transition: "0.6s",
                    }}
                    tooltip="Deletar/Remover imagem"
                  />
                </>
              ) : null}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
