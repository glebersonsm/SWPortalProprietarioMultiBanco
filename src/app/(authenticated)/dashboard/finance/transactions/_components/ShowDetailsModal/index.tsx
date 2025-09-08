import ModalToShowDetails from "@/components/ModalToShowDetails";
import { formatMoney } from "@/utils/money";
import { Transaction } from "@/utils/types/finance";
import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Textarea,
} from "@mui/joy";
import React from "react";

type ShowDetailsModalProps = {
  transaction: Transaction;
  shouldOpen: boolean;
};

const labelSx = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  color: "primary.plainColor",
};

export default function ShowDetailsModal({
  transaction,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails title="Detalhes da transação" shouldOpen={shouldOpen}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>ID</FormLabel>
            <Textarea defaultValue={transaction.transactionId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>ID pessoa</FormLabel>
            <Textarea defaultValue={transaction.personId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nome pessoa</FormLabel>
            <Textarea defaultValue={transaction.personName} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Status</FormLabel>
            <Textarea defaultValue={transaction.status} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Valor</FormLabel>
            <Textarea defaultValue={formatMoney(transaction.value)} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Nsu</FormLabel>
            <Textarea defaultValue={transaction.nsu} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Tipo de pagamento</FormLabel>
            <Textarea
              defaultValue={transaction.card ? "Cartão" : "Pix"}
              readOnly
            />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>ID do pagamento</FormLabel>
            <Textarea defaultValue={transaction.paymentId} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Autorização</FormLabel>
            <Textarea defaultValue={transaction.authorization} readOnly />
          </FormControl>
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FormControl>
            <FormLabel sx={labelSx}>Data da transação</FormLabel>
            <Textarea defaultValue={transaction.date} readOnly />
          </FormControl>
        </Grid>
      </Grid>

      {transaction.linkedAccounts.length > 0 && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary>Contas pagas</AccordionSummary>
          <AccordionDetails>
            {transaction.linkedAccounts.map((linkedAccount) => (
              <AccordionGroup key={linkedAccount.id}>
                <Accordion>
                  <AccordionSummary>ID: {linkedAccount.id}</AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ marginBottom: "5px" }} />
                    <Grid container spacing={2}>
                      <Grid xs={12} sm={6} md={4}>
                        <FormControl>
                          <FormLabel sx={labelSx}>Valor original</FormLabel>
                          <Textarea
                            defaultValue={formatMoney(linkedAccount.value)}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={6} md={4}>
                        <FormControl>
                          <FormLabel sx={labelSx}>
                            Valor na data transação
                          </FormLabel>
                          <Textarea
                            defaultValue={formatMoney(
                              linkedAccount.valueOnTransaction
                            )}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12} sm={6} md={4}>
                        <FormControl>
                          <FormLabel sx={labelSx}>Data vencimento</FormLabel>
                          <Textarea
                            defaultValue={linkedAccount.dueDate}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                      <Grid xs={12}>
                        <FormControl>
                          <FormLabel sx={labelSx}>Descrição do item</FormLabel>
                          <Textarea
                            defaultValue={linkedAccount.itemDescription}
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            ))}
          </AccordionDetails>
        </Accordion>
      )}

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary>Dados enviados</AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ width: "100%", marginTop: "16px" }}>
            <Textarea
              value={(() => {
                try {
                  return JSON.stringify(
                    JSON.parse(transaction.sentData),
                    null,
                    2
                  );
                } catch {
                  return transaction.sentData;
                }
              })()}
              minRows={8}
              readOnly
              sx={{
                fontFamily: "Fira Mono, monospace",
                fontSize: "0.95rem",
                whiteSpace: "pre",
                width: "100%",
                maxWidth: "100%",
                //maxHeight: "350px",
                overflow: "auto",
                boxSizing: "border-box",
              }}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary>Dados recebidos</AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ width: "100%", marginTop: "16px" }}>
          <Textarea
              value={(() => {
                try {
                  return JSON.stringify(
                    JSON.parse(transaction.receivedData),
                    null,
                    2
                  );
                } catch {
                  return transaction.receivedData;
                }
              })()}
              minRows={8}
              readOnly
              sx={{
                fontFamily: "Fira Mono, monospace",
                fontSize: "0.95rem",
                whiteSpace: "pre",
                width: "100%",
                maxWidth: "100%",
                //maxHeight: "350px",
                overflow: "auto",
                boxSizing: "border-box",
              }}
            />
            </FormControl>
        </AccordionDetails>
      </Accordion>
    </ModalToShowDetails>
  );
}
