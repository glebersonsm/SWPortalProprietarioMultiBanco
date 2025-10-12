import { Button, IconButton } from "@mui/joy";
import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import AlertError, {
  AlertErrorProps,
} from "@/app/(auth)/_components/AlertError";

type FormModalProps<T extends FieldValues> = {
  title: string;
  contentText: string;
  type: string;
  children: React.ReactNode;
  form: UseFormReturn<T>;
  errorMessage: string | undefined;
  onSubmit: (data: T) => void;
  open: boolean;
  closeModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FormModal<T extends FieldValues>({
  open,
  closeModal,
  title,
  contentText,
  type,
  children,
  form,
  onSubmit,
  errorMessage,
}: FormModalProps<T>) {
  const submitText = type == "add" ? "Criar" : "Salvar";

  async function submit(data: T) {
    onSubmit(data);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            closeModal(false);
          }
        }}
        sx={{ backdropFilter: "blur(3px)", backgroundColor: "rgba(14, 42, 71, 0.25)" }}
      >
        <ModalDialog
          sx={{
            maxWidth: { xs: '95vw', sm: '600px', md: '700px' },
            width: '100%',
            borderRadius: 16,
            p: { xs: 3, md: 4 },
            background: 'var(--modal-bg-gradient)',
            border: '1px solid var(--modal-border-color)',
            boxShadow: '0 12px 28px var(--modal-shadow-color)',
            color: 'var(--modal-text-color)',
          }}
        >
          {/* Cabeçalho do Modal */}
          <DialogTitle
            sx={{
              color: 'var(--modal-header-text-color)',
              backgroundColor: 'var(--modal-header-bg)',
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: 'center',
              mb: 1,
              pb: 0,
            }}
          >
            {title}
          </DialogTitle>
          
          <DialogContent
            sx={{
              color: 'var(--modal-text-color)',
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 500,
              textAlign: 'center',
              mb: 3,
              px: 0,
              pb: 0,
            }}
          >
            {contentText}
          </DialogContent>

          {/* Formulário */}
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <Stack 
                spacing={3}
                sx={{
                  '& .MuiFormControl-root': {
                    '& .MuiFormLabel-root': {
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--form-label-color)',
                      mb: 1,
                    },
                    '& .MuiInput-root': {
                      borderRadius: 12,
                      fontSize: '0.875rem',
                      fontFamily: 'Montserrat, sans-serif',
                      transition: 'all 0.2s ease-in-out',
                      backgroundColor: 'var(--form-input-bg)',
                      border: '1px solid var(--form-input-border)',
                    },
                  },
                }}
              >
                {children}
                
                {/* Mensagem de Erro */}
                {errorMessage && (
                  <AlertError error={errorMessage} />
                )}
                
                {/* Botões de Ação */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => closeModal(false)}
                    sx={{
                      minWidth: { xs: '100%', sm: '140px' },
                      height: 44,
                      borderRadius: 12,
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      border: '1.5px solid',
                      color: 'var(--color-button-exit-text)',
                      borderColor: 'var(--color-button-exit-border)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        backgroundColor: 'var(--color-button-exit-hover-bg)',
                        color: 'var(--color-button-exit-hover-text)',
                        borderColor: 'var(--color-button-exit-hover-border)',
                      },
                    }}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="solid"
                    sx={{
                      minWidth: { xs: '100%', sm: '140px' },
                      height: 44,
                      borderRadius: 12,
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      bgcolor: 'var(--color-button-primary)',
                      color: 'var(--color-button-text)',
                      border: 'none',
                      boxShadow: '0 6px 16px rgba(14, 42, 71, 0.25)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: 'var(--color-button-primary-hover)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(14, 42, 71, 0.30)',
                      },
                      '&:active': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(14, 42, 71, 0.25)',
                      },
                    }}
                  >
                    {submitText}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </FormProvider>
        </ModalDialog>
      </Modal>
    </>
  );
}
