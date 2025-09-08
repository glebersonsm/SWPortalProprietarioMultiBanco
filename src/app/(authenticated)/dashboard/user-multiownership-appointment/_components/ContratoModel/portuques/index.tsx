import { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  Box,
  Button,
  DialogActions,
} from "@mui/material";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

import { StepComponent } from "./steps";
import { GetInfoContractsData } from "@/utils/types/multiownership/owners";

interface Props {
  open: boolean;
  handleClose: VoidFunction;
  handleSubmitClose: () => void;
  data?: GetInfoContractsData[] | undefined;
}

export function Portuques({
  open,
  handleClose,
  handleSubmitClose,
  data,
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleNext = () => {
    if (activeStep === 3) {
      if (!acceptedTerms) {
        alert("Você deve aceitar os termos para continuar.");
        return;
      } else handleSubmitClose();
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog component={Box} sx={{ width: "100vw", height: "100vh" }}>
        <DialogTitle>Contrato de Liberação</DialogTitle>
        <DialogContent>
          <Box>
            {activeStep === 0 && <StepComponent.Step0 />}
            {activeStep === 1 && <StepComponent.Step01 />}
            {activeStep === 2 && <StepComponent.Step02 data={data} />}
            {activeStep === 3 && (
              <StepComponent.Step03
                acceptedTerms={acceptedTerms}
                setAcceptedTerms={setAcceptedTerms}
              />
            )}
          </Box>

          <DialogActions sx={{ display: "flex", mt: 2 }}>
            <Button
              onClick={activeStep === 0 ? handleClose : handleBack}
              sx={{
                color: "var(--color-button-exit-text)",
                border: "1px solid var(--color-button-exit-border)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "var(--color-button-exit-hover-bg)",
                  color: "var(--color-button-exit-hover-text)",
                  borderColor: "var(--color-button-exit-hover-border)",
                },
              }}
            >
              {activeStep === 0 ? "sair" : "Voltar"}
            </Button>

            <Button
              onClick={handleNext}
              sx={{
                backgroundColor: "var(--color-button-primary)",
                color: "var(--color-button-text)",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "var(--color-button-primary-hover)",
                },
              }}
            >
              Avançar
            </Button>
          </DialogActions>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
