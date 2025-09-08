import ModalToShowDetails from "@/components/ModalToShowDetails";
import { Contract } from "@/utils/types/timeSharing/contracts";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { formatMoney } from "@/utils/money";
import { formatNumeric } from "@/utils/numeric";
import React from "react";

type ShowDetailsModalProps = {
  contract: Contract;
  shouldOpen: boolean;
};

export default function ShowDetailsModal({
  contract,
  shouldOpen,
}: ShowDetailsModalProps) {
  return (
    <ModalToShowDetails title="Detalhes do contrato" shouldOpen={shouldOpen}>
      <FormControl>
        <FormLabel>Id de venda</FormLabel>
        <Textarea defaultValue={contract.tsSaleId} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>Nome do cliente</FormLabel>
        <Textarea defaultValue={contract.clientName} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Id do cliente</FormLabel>
        <Textarea defaultValue={contract.clientId} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Documento do cliente</FormLabel>
        <Textarea defaultValue={contract.clientDocument} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Email do cliente</FormLabel>
        <Textarea defaultValue={contract.clientEmail} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Projeto-contrato</FormLabel>
        <Textarea defaultValue={contract.projectXContract} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Tipo de contrato</FormLabel>
        <Textarea defaultValue={contract.contractType} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Cidade - Estado</FormLabel>
        <Textarea defaultValue={contract.cityState} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Data de venda</FormLabel>
        <Textarea defaultValue={contract.saleDate} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Status</FormLabel>
        <Textarea defaultValue={contract.status} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Número do contrato</FormLabel>
        <Textarea defaultValue={contract.contractNumber} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Cancelado</FormLabel>
        <Textarea defaultValue={contract.cancellation} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Data do cancelamento</FormLabel>
        <Textarea defaultValue={contract.cancellationDate} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Revertido</FormLabel>
        <Textarea defaultValue={contract.reversed} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Data da reversão</FormLabel>
        <Textarea defaultValue={contract.reversalDate} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Sala de vendas</FormLabel>
        <Textarea defaultValue={contract.saleRoom} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Saldo de pontos</FormLabel>
        <Textarea defaultValue={formatNumeric(contract.pointsBalance)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Valor de entrada</FormLabel>
        <Textarea defaultValue={formatMoney(contract.downPayment ?? 0)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Quantidade de parcelas de entrada</FormLabel>
        <Textarea defaultValue={contract.numberOfDownPayments} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Valor financiado</FormLabel>
        <Textarea defaultValue={formatMoney(contract.amountFinanced)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Quantidade de parcelas financiadas</FormLabel>
        <Textarea
          defaultValue={contract.numberOfFinancedInstallments}
          readOnly
        />
      </FormControl>
      <FormControl>
        <FormLabel>Quantidade de parcelas geral</FormLabel>
        <Textarea defaultValue={contract.numberOfInstallmentsPaid} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Valor total da venda</FormLabel>
        <Textarea defaultValue={formatMoney(contract.totalSalesValue)} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Percentual de integralização</FormLabel>
        <Textarea defaultValue={contract.percentagePaid} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Data de validade</FormLabel>
        <Textarea defaultValue={contract.expirationDate} readOnly />
      </FormControl>
    </ModalToShowDetails>
  );
}
