import { formatDate } from "@/utils/dates";
import {
  IncomingOutstandingBill,
  IncomingTokenizedCard,
  IncomingTransaction,
  TokenizedCard,
  Transaction,
} from "@/utils/types/finance";

export function transformedOutstandingBills(
  outstandingBills: IncomingOutstandingBill[]
) {
  return outstandingBills.map((finance) => {
    return {
      id: finance.id,
      companyId: finance.empresaId,
      companyName: finance.empresaNome,
      personProviderId: finance.pessoaProviderId,
      personId: finance.pessoaId,
      personName: finance.nomePessoa,
      accountTypeCode: finance.codigoTipoConta,
      accountTypeName: finance.nomeTipoConta,
      value: finance.valor,
      currentValue: finance.valorAtualizado,
      typeableBillLine: finance.linhaDigitavelBoleto,
      observation: finance.observacao,
      dueDate: formatDate(finance.vencimento),
      creationDate: formatDate(finance.dataHoraCriacao),
      paymentDate: formatDate(finance.dataHoraBaixa),
      contrato: finance.contrato,
      status: finance.statusParcela,
      paymentBlockedByCrcStatus: finance.statusCrcBloqueiaPagamento,
      processingDate: formatDate(finance.dataProcessamento)
    };
  });
}

export function transformedTokenizedCards(
  tokenizedCards: IncomingTokenizedCard[]
): TokenizedCard[] {
  return tokenizedCards.map((tokenizedCard) => {
    return {
      id: tokenizedCard.id,
      personProviderId: tokenizedCard.pessoaProviderId,
      personId: tokenizedCard.pessoaId,
      personName: tokenizedCard.pessoaNome,
      creationDate: formatDate(tokenizedCard.dataHoraCriacao),
      cardHolder: tokenizedCard.cardHolder,
      card: {
        ...tokenizedCard.card,
      },
      company: {
        ...tokenizedCard.company,
      },
      status: tokenizedCard.status,
      token: tokenizedCard.token,
      token2: tokenizedCard.token2,
    };
  });
}
export function transformedTransactions(
  transactions: IncomingTransaction[]
): Transaction[] {
  return transactions.map((transaction) => {
    const linkedAccounts = transaction.contasVinculadas.map((linkedAccount) => {
      return {
        dueDate: formatDate(linkedAccount.vencimento),
        id: linkedAccount.itemId,
        value: linkedAccount.valor,
        itemDescription: linkedAccount.descricaoDoItem,
        valueOnTransaction: linkedAccount.valorNaTransacao,
      };
    });

    return {
      paymentId: transaction.paymentId,
      personId: transaction.pessoaId,
      personName: transaction.pessoaNome,
      date: formatDate(transaction.dataTransacao),
      acquirer: transaction.adquirente,
      authorization: transaction.autorizacao,
      card: transaction.cartao,
      value: transaction.valorTransacao,
      pix: transaction.pix,
      status: transaction.status,
      nsu: transaction.nsu,
      transactionId: transaction.transactionId ?? transaction.hashCode,
      keyValue: transaction.chave,
      hashCodeId: transaction.hashCode,
      receivedData: transaction.retorno,
      sentData: transaction.dadosEnviados,
      qrCode: transaction.qrCode,
      url: transaction.url,
      linkedAccounts: linkedAccounts,
    };
  });
}
