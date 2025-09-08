import { formatDate } from "@/utils/dates";
import {
  IncomingUserContract,
  UserContract,
} from "@/utils/types/user-time-sharing-contracts";

export function transformedUserContracts(
  contracts: IncomingUserContract[]
): UserContract[] {
  return contracts.map((contract) => {
    return {
      tsSaleId: contract.idVendaTs,
      clientId: contract.idCliente,
      clientName: contract.nomeCliente,
      clientDocument: contract.documentoCliente,
      clientEmail: contract.emailCliente,
      projectXContract: contract.projetoXContrato,
      contractType: contract.tipoContrato,
      cityState: contract.cidade_Estado,
      saleDate: formatDate(contract.dataVenda),
      status: contract.status,
      contractNumber: contract.numeroContrato,
      cancellation: contract.cancelado,
      cancellationDate: formatDate(contract?.dataCancelamento),
      reversed: contract.revertido,
      reversalDate: formatDate(contract?.dataReversao),
      saleRoom: contract.salaVendas,
      pointsBalance: contract.saldoPontos,
      personProviderId: contract.pessoaProviderId,
      downPayment: contract.valorEntrada,
      numberOfDownPayments: contract.qtdeParcelasEntrada,
      amountFinanced: contract.valorFinanciado,
      numberOfFinancedInstallments: contract.qtdeParcelasFinanciamento,
      numberOfInstallmentsPaid: contract.qtdeParcelasPagas,
      totalSalesValue: contract.valorTotalVenda,
      percentagePaid: contract.percentualIntegralizacao,
      expirationDate: formatDate(contract.dataValidade),
    };
  });
}
