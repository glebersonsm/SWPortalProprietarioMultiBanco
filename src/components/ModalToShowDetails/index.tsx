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
        backdropFilter: "blur(2px)",
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
        }}
      >
        <DialogTitle
          sx={{
            px: 2,
            py: 1,
            color: "primary.solidHoverBg",
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
          <Button variant="outlined" color="danger" onClick={closeModal}>
            Sair
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
