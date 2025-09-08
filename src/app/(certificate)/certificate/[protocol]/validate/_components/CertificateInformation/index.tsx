import { Alert, Stack, Typography } from "@mui/joy";
import { Paper } from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import { Certificate } from "@/utils/types/finance-users";
import { match } from "ts-pattern";
import ReportIcon from "@mui/icons-material/Report";

type CertificateInformationProps = {
  data: Certificate | { error: true; message: string };
};

export default async function CertificateInformation({
  data,
}: CertificateInformationProps) {
  return (
    <Stack>
      {match(data)
        .with({ error: true }, ({ message }) => (
          <Alert
            sx={{ alignItems: "flex-start", padding: 3 }}
            startDecorator={<ReportIcon />}
            variant="soft"
            color="danger"
          >
            <Typography level="h4" color="danger">
              {message}
            </Typography>
          </Alert>
        ))
        .otherwise((data) => (
          <Paper elevation={2}>
            <Stack
              flexDirection={{ md: "row" }}
              alignItems="center"
              gap={3}
              padding={2}
            >
              <Stack gap={1} padding={5}>
                <Typography>
                  Competência:{" "}
                  <Typography fontWeight={700}>{data?.competence}</Typography>{" "}
                  (Nro. Protocolo:{" "}
                  <Typography fontWeight={700}>{data?.protocol}</Typography>)
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>Multiproprietário: </Typography>
                  {data?.propertyName}
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>CPF: </Typography>
                  {data?.documentNumber}
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>Apto. Nº: </Typography>
                  {data?.propertyNumber}
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>Torre/Bloco: 001 </Typography>
                  {data?.numberTowerOrBLock}
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>Cota: </Typography>
                  {data?.quota}
                </Typography>
                <Typography>
                  <Typography fontWeight={700}>
                    Certidão emitida em:{" "}
                  </Typography>
                  {data?.issueAt}
                </Typography>
              </Stack>
              <CheckIcon sx={{ fontSize: 50, color: "green" }} />
            </Stack>
          </Paper>
        ))}
    </Stack>
  );
}
