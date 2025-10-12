import useCloseModal from "@/hooks/useCloseModal";
import {
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  Button,
  DialogActions,
  IconButton,
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

type ModalToShowDetailsProps = {
  shouldOpen: boolean;
  title: string;
  children: React.ReactNode;
};

export default function ModalToShowDetails({
  shouldOpen,
  title,
  children,
}: ModalToShowDetailsProps) {
  const closeModal = useCloseModal();

  return (
    <Modal
      open={shouldOpen}
      onClose={(_, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          closeModal();
        }
      }}
      sx={{
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(14, 42, 71, 0.25)",
      }}
    >
      <ModalDialog
        size="lg"
        sx={{
          height: { xs: "90vh", sm: "85vh", md: "80vh" },
          maxHeight: { xs: "90vh", sm: "85vh", md: "80vh" },
          width: { xs: "95%", sm: "90%", md: "85%", lg: "75%", xl: "65%" },
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          p: 0,
          background: "var(--modal-bg-gradient)",
          border: "1px solid var(--modal-border-color)",
          boxShadow: "0 12px 28px var(--modal-shadow-color)",
          color: "var(--modal-text-color)",
        }}
      >
        <DialogTitle
          sx={{
            px: 2,
            py: 1,
            color: "var(--modal-header-text-color)",
            backgroundColor: "var(--modal-header-bg)",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.3rem" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {title}
          <IconButton
            aria-label="Sair"
            size="sm"
            variant="plain"
            color="neutral"
            sx={{ color: "var(--modal-header-text-color)" }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Conteúdo rolável */}
        <DialogContent
          sx={{
            flex: 1, 
            overflow: "auto",
            px: 2,
            pt: 0,
            pb: 0,
          }}
        >
          {children}
        </DialogContent>

        {/* Rodapé fixo */}
        <DialogActions sx={{ px: 2, py: 1 }}>
          <Button 
            variant="solid" 
            onClick={closeModal}
            sx={{
              bgcolor: "var(--color-button-primary)",
              color: "var(--color-button-text)",
              "&:hover": { bgcolor: "var(--color-button-primary-hover)" },
            }}
          >
            Sair
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
