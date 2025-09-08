import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Email } from "@/utils/types/emails";
import { Checkbox, FormControl, FormLabel, Textarea, Grid } from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  email: Email;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 600,
  color: "text.primary",
};

const textareaSx = {
  borderRadius: 16,
  minHeight: '48px',
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 500,
  border: '1.5px solid',
  borderColor: 'neutral.300',
  backgroundColor: 'background.surface',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: 'primary.400',
    backgroundColor: 'background.level1',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  '&:focus-within': {
    borderColor: 'primary.500',
    backgroundColor: 'background.surface',
    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
    transform: 'translateY(-1px)',
  },
  '&.Joy-focused': {
    borderColor: 'primary.500',
    backgroundColor: 'background.surface',
    boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
  },
};

export default function ShowDetailsModal({
  email,
  shouldOpen,
}: ShowDetailsModalProps) {
  const convertHtmlToString = (htmlText: string) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = htmlText;

    return tempElement.textContent || tempElement.innerText;
  };

  return (
    <ModalToShowDetails title="Detalhes do email" shouldOpen={shouldOpen}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={12} md={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Id do e-mail</FormLabel>
            <Textarea defaultValue={email.id} readOnly sx={textareaSx} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Data de criação</FormLabel>
            <Textarea defaultValue={email.creationDate} readOnly sx={textareaSx} />
          </FormControl>
        </Grid>

        <Grid xs={12} sm={12} md={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Destinatário</FormLabel>
            <Textarea defaultValue={email.recipient} readOnly sx={textareaSx} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <FormControl>
            <FormLabel sx={labelSx}>Assunto</FormLabel>
            <Textarea defaultValue={email.subject} readOnly sx={textareaSx} />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={12} md={6}>
          <FormControl>
            <Checkbox defaultChecked={email.sent} readOnly label="Enviado" />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={12} md={12}>
          <FormControl>
            <FormLabel sx={labelSx}>Conteúdo</FormLabel>
            <Textarea
              defaultValue={convertHtmlToString(email.content)}
              readOnly
              minRows={8}
              maxRows={16}
              sx={{
                ...textareaSx,
                width: "100%",
                fontSize: "1rem",
                minHeight: 'auto',
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </ModalToShowDetails>
  );
}
