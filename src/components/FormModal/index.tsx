import { Button, IconButton } from "@mui/joy";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
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
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            closeModal(false);
          }
        }}
        BackdropProps={{ 
          sx: { 
            backdropFilter: "blur(3px)", 
            backgroundColor: "rgba(14, 42, 71, 0.25)" 
          } 
        }}
        PaperProps={{
          sx: {
            maxWidth: { xs: '95vw', sm: '600px', md: '700px' },
            width: '100%',
            borderRadius: 0,
            p: { xs: 3, md: 4 },
            background: 'var(--modal-bg-gradient, linear-gradient(135deg, #ffffff 0%, #f8fafc 100%))',
            border: '1px solid var(--modal-border-color, rgba(44, 162, 204, 0.1))',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            color: 'var(--modal-text-color, #0f2f33)'
          }
        }}
      >
        <Stack>
          {/* Cabeçalho do Modal */}
          <DialogTitle
            sx={{
              color: '#ffffff',
              fontFamily: "var(--font-puffin, Montserrat), sans-serif",
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              textAlign: 'center',
              mb: 1,
              pb: 2,
              background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              borderBottom: '2px solid',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              mx: { xs: -3, md: -4 },
              mt: { xs: -3, md: -4 },
              px: { xs: 3, md: 4 },
              pt: { xs: 3, md: 4 },
            }}
          >
            {title}
          </DialogTitle>
          
          <DialogContent
            sx={{
              fontSize: { xs: '0.875rem', md: '0.95rem' },
              color: 'var(--modal-text-color, text.secondary)',
              fontFamily: "var(--font-puffin, Montserrat), sans-serif",
              fontWeight: 500,
              textAlign: 'center',
              mb: 3,
              pt: 2,
              px: 0,
              pb: 0,
              opacity: 0.85,
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
                      fontFamily: 'var(--font-puffin, Montserrat), sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: 'var(--form-label-color, #035781)',
                      mb: 1,
                    },
                    '& .MuiInput-root': {
                      borderRadius: 0,
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-puffin, Montserrat), sans-serif',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'var(--form-input-bg, #ffffff)',
                      border: '1px solid var(--form-input-border, rgba(44, 162, 204, 0.2))',
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(44, 162, 204, 0.15)",
                        borderColor: 'rgba(44, 162, 204, 0.4)',
                      },
                      "&.Mui-focused": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 16px rgba(44, 162, 204, 0.25)",
                        borderColor: '#2ca2cc',
                      },
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
                  sx={{ 
                    mt: 4, 
                    pt: 3, 
                    borderTop: '2px solid',
                    borderColor: 'divider' 
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => closeModal(false)}
                    sx={{
                      minWidth: { xs: '100%', sm: '140px' },
                      height: 44,
                      borderRadius: 0,
                      fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      border: '1.5px solid',
                      color: 'var(--color-button-exit-text, #dc3545)',
                      borderColor: 'var(--color-button-exit-border, #dc3545)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(220, 53, 69, 0.3)',
                        backgroundColor: 'rgba(220, 53, 69, 0.05)',
                        borderColor: '#c82333',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
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
                      borderRadius: 0,
                      fontFamily: "var(--font-puffin, Montserrat), sans-serif",
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      background: "linear-gradient(135deg, #2ca2cc 0%, #035781 100%)",
                      color: '#ffffff',
                      border: 'none',
                      boxShadow: '0 6px 16px rgba(44, 162, 204, 0.25)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: "linear-gradient(135deg, #035781 0%, #024a6b 100%)",
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(44, 162, 204, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                        boxShadow: '0 4px 12px rgba(44, 162, 204, 0.3)',
                      },
                    }}
                  >
                    {submitText}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Dialog>
    </>
  );
}
