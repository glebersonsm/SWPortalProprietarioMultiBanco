import * as React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { Stack } from "@mui/joy";

type AlertDialogProps = {
  openModal: boolean;
  closeModal: () => void;
  message: string;
  title: string;
  actionText: string;
  cancelActionText?: string;
  onHandleAction: () => void;
};

export default function AlertDialogModal({
  openModal,
  closeModal,
  message,
  title,
  actionText,
  cancelActionText,
  onHandleAction,
}: AlertDialogProps) {
  return (
    <Modal
      open={openModal}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          closeModal();
        }
      }}
    >
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle
          sx={{
            color: "primary.solidHoverBg",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
          }}
        >
          <WarningRoundedIcon />
          {title}
        </DialogTitle>
        <Divider />
        <DialogContent
          sx={{
            color: "primary.plainColor",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 500,
          }}
        >
          {message}
        </DialogContent>
        <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
          <Button
            variant="outlined"
            color="danger"
            sx={{
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
            }}
            onClick={closeModal}
          >
            {cancelActionText ?? "Sair"}
          </Button>
          <Button
            variant="solid"
            color="danger"
            sx={{
              marginTop: "10px",
              width: {
                xs: "100%",
                md: "200px",
              },
            }}
            onClick={onHandleAction}
          >
            {actionText}
          </Button>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
