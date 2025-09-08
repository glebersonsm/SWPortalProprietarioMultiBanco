import * as React from "react";
import Image from "next/image";
import { Box, IconButton, List, ListItem, Typography, Modal, ModalDialog, DialogTitle, DialogContent } from "@mui/joy";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import IconOpenModal from "@/components/IconOpenModal";
import { downloadDocument, viewDocument } from "@/services/querys/document";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Document, GroupOfDocs } from "@/utils/types/documents";
import useUser from "@/hooks/useUser";
import { Tooltip } from "@mui/material";

type ListDocumentsProps = {
  groupDocuments: GroupOfDocs;
};

export default function ListDocuments({ groupDocuments }: ListDocumentsProps) {
  const { isAdm } = useUser();
  const [viewerData, setViewerData] = React.useState<{
    url: string;
    contentType: string;
    documentName: string;
  } | null>(null);

  const handleViewDocument = async (documentId: number, documentName: string) => {
    try {
      const data = await viewDocument(documentId);
      setViewerData({
        url: data.url,
        contentType: data.contentType,
        documentName,
      });
    } catch (error) {
      console.error('Erro ao visualizar documento:', error);
    }
  };

  const handleCloseViewer = () => {
    if (viewerData?.url) {
      URL.revokeObjectURL(viewerData.url);
    }
    setViewerData(null);
  };

  return (
    <Box sx={{ padding: "0 10px" }}>
      <List sx={{ "--ListItem-paddingY": "8px" }}>
        {groupDocuments.documents.map((document: Document) => (
          <ListItem
            key={document.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--card-bg-gradient, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-surface, #1f1f1f) 100%))",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--card-border-color, rgba(255, 255, 255, 0.1))",
              borderRadius: "10px",
              margin: "8px 16px",
              padding: "12px 20px",
              boxShadow: "0 4px 16px var(--card-shadow-color, rgba(0, 0, 0, 0.08))",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "var(--card-bg-gradient-hover, linear-gradient(135deg, var(--card-bg-primary, #2a2a2a) 0%, var(--card-bg-hover, rgba(42, 42, 42, 0.12)) 100%))",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px var(--card-shadow-color-hover, rgba(0, 0, 0, 0.12))",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "var(--card-text-color, white)",
                fontWeight: 600,
                fontSize: "0.95rem",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              {document.name}
            </Typography>

            <Box>
              <IconButton
                size="sm"
                sx={{ color: "var(--color-doc-icon)" }}
                onClick={() => handleViewDocument(document.id, document.name)}
              >
                <Tooltip title="Visualizar documento">
                  <VisibilityIcon />
                </Tooltip>
              </IconButton>
              
              <IconButton
                size="sm"
                sx={{ color: "var(--color-doc-icon)" }}
                onClick={() => downloadDocument(document.id)}
              >
                <Tooltip title="Fazer download do documento">
                  <DownloadIcon />
                </Tooltip>
              </IconButton>

              {isAdm ? (
                <>
                  <IconOpenModal
                    params={{
                      groupDocumentId: groupDocuments.id,
                      documentId: document.id,
                    }}
                    sxoverride={{ color: "var(--color-doc-icon)" }}
                    type="edit-document"
                    tooltip="Editar documento"
                    icon={<EditIcon />}
                  />
                  <IconOpenModal
                    params={{
                      groupDocumentId: groupDocuments.id,
                      documentId: document.id,
                    }}
                    sxoverride={{ color: "var(--color-doc-icon)" }}
                    type="history"
                    tooltip="Visualizar históricos"
                  />
                  <IconOpenModal
                    params={{
                      groupDocumentId: groupDocuments.id,
                      documentId: document.id,
                    }}
                    type="delete-document"
                    sxoverride={{ color: "var(--color-doc-icon)" }}
                    icon={<DeleteIcon />}
                    tooltip="Deletar/Remover documento"
                  />
                </>
              ) : null}
            </Box>
          </ListItem>
        ))}
      </List>
      
      {/* Modal de Visualização de Documento */}
      <Modal open={!!viewerData} onClose={handleCloseViewer}>
        <ModalDialog
          sx={{
            width: { xs: "95vw", sm: "90vw", md: "85vw", lg: "80vw" },
            height: { xs: "95vh", sm: "90vh", md: "85vh" },
            maxWidth: "1200px",
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
            }}
          >
            <Typography level="title-lg" fontWeight="700">
              {viewerData?.documentName || "Visualizar Documento"}
            </Typography>
            <IconButton
              size="sm"
              variant="plain"
              onClick={handleCloseViewer}
              sx={{ ml: 1 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent
            sx={{
              flex: 1,
              p: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {viewerData && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {viewerData.contentType.includes("pdf") ? (
                  <iframe
                    src={viewerData.url}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    title={viewerData.documentName}
                  />
                ) : viewerData.contentType.includes("image") ? (
                  <Image
                    src={viewerData.url}
                    alt={viewerData.documentName}
                    width={800}
                    height={600}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      p: 4,
                    }}
                  >
                    <Typography level="body-lg">
                      Tipo de arquivo não suportado para visualização
                    </Typography>
                    <Typography level="body-sm" color="neutral">
                      Tipo: {viewerData.contentType}
                    </Typography>
                    <IconButton
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = viewerData.url;
                        link.download = viewerData.documentName;
                        link.click();
                      }}
                      sx={{ mt: 2 }}
                    >
                      <DownloadIcon />
                      <Typography sx={{ ml: 1 }}>Fazer Download</Typography>
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
