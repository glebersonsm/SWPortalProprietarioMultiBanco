import { Framework, IncomingFramework } from "@/utils/types/framework";

export function transformedFrameworks(framework: IncomingFramework): Framework {
  return {
    id: framework?.id,
    companyId: framework.empresaId,
    groupCertificateByClient: !!framework.agruparCertidaoPorCliente,
    issueCertificatePerClient: !!framework.emitirCertidaoPorUnidCliente,
    integratedWithMultiOwnership: !!framework.integradoComMultiPropriedade,
    integratedWithTimeSharing: !!framework.integradoComTimeSharing,
    enableBillDownload: !!framework.habilitarBaixarBoleto,
    enableOnlinePayment: !!framework.habilitarPagamentosOnLine,
    enablePixPayment: !!framework.habilitarPagamentoEmPix,
    enableCardPayment: !!framework.habilitarPagamentoEmCartao,
    displayOverdueInvoices: !!framework.exibirContasVencidas,
    maxNumberOfDaysDueInvoices: framework.qtdeMaximaDiasContasAVencer,
    allowUserChangeYourEmail: !!framework.permitirUsuarioAlterarSeuEmail,
    allowUserChangeYourDoc: !!framework.permitirUsuarioAlterarSeuDoc,
    companyIds: framework.exibirFinanceirosDasEmpresaIds,
    ExibirFinanceiroPortalEmpresaIds: framework.exibirFinanceiroPortalEmpresaIds,
    homeImageUrl1: framework?.imagemHomeUrl1,
    homeImageUrl2: framework?.imagemHomeUrl2,
    homeImageUrl3: framework?.imagemHomeUrl3,
    homeImageUrl4: framework?.imagemHomeUrl4,
    homeImageUrl5: framework?.imagemHomeUrl5,
    homeImageUrl6: framework?.imagemHomeUrl6,
    homeImageUrl7: framework?.imagemHomeUrl7,
    homeImageUrl8: framework?.imagemHomeUrl8,
    homeImageUrl9: framework?.imagemHomeUrl9,
    homeImageUrl10: framework?.imagemHomeUrl10,
    homeImageUrl11: framework?.imagemHomeUrl11,
    homeImageUrl12: framework?.imagemHomeUrl12,
    homeImageUrl13: framework?.imagemHomeUrl13,
    homeImageUrl14: framework?.imagemHomeUrl14,
    homeImageUrl15: framework?.imagemHomeUrl15,
    homeImageUrl16: framework?.imagemHomeUrl16,
    homeImageUrl17: framework?.imagemHomeUrl17,
    homeImageUrl18: framework?.imagemHomeUrl18,
    homeImageUrl19: framework?.imagemHomeUrl19,
    homeImageUrl20: framework?.imagemHomeUrl20,
    serverAddress: framework?.serverAddress,
    websiteToBook: framework?.siteParaReserva,
    condominiumName: framework?.nomeCondominio,
    condominiumDocument: framework?.cnpjCondominio,
    condominiumAddress: framework?.enderecoCondominio,
    condominiumAdministratorName: framework?.nomeAdministradoraCondominio,
    condominiumAdministratorDocument: framework?.cnpjAdministradoraCondominio,
    condominiumAdministratorAddress:
      framework?.enderecoAdministradoraCondominio,
    // Sidebar visibility toggles (non-admin)
    sidebarShowDocuments:
      framework?.sidebarShowDocuments === 1
        ? true
        : framework?.sidebarShowDocuments === 0
        ? false
        : undefined,
    sidebarShowFinance:
      framework?.sidebarShowFinance === 1
        ? true
        : framework?.sidebarShowFinance === 0
        ? false
        : undefined,
    sidebarShowImages:
      framework?.sidebarShowImages === 1
        ? true
        : framework?.sidebarShowImages === 0
        ? false
        : undefined,
    sidebarShowFaqs:
      framework?.sidebarShowFaqs === 1
        ? true
        : framework?.sidebarShowFaqs === 0
        ? false
        : undefined,
  };
}

export function untransformedFrameworks(
  framework: Framework
): IncomingFramework {
  return {
    id: framework?.id,
    empresaId: framework?.companyId,
    agruparCertidaoPorCliente: framework?.groupCertificateByClient ? 1 : 0,
    emitirCertidaoPorUnidCliente: framework?.issueCertificatePerClient ? 1 : 0,
    integradoComMultiPropriedade: framework?.integratedWithMultiOwnership
      ? 1
      : 0,
    integradoComTimeSharing: framework?.integratedWithTimeSharing ? 1 : 0,
    habilitarBaixarBoleto: framework?.enableBillDownload ? 1 : 0,
    habilitarPagamentosOnLine: framework?.enableOnlinePayment ? 1 : 0,
    habilitarPagamentoEmPix: framework?.enablePixPayment ? 1 : 0,
    habilitarPagamentoEmCartao: framework?.enableCardPayment ? 1 : 0,
    exibirContasVencidas: framework?.displayOverdueInvoices ? 1 : 0,
    exibirFinanceirosDasEmpresaIds: framework?.companyIds,
    exibirFinanceiroPortalEmpresaIds:
      framework?.ExibirFinanceiroPortalEmpresaIds,
    qtdeMaximaDiasContasAVencer: framework?.maxNumberOfDaysDueInvoices,
    permitirUsuarioAlterarSeuEmail: framework?.allowUserChangeYourEmail ? 1 : 0,
    permitirUsuarioAlterarSeuDoc: framework?.allowUserChangeYourDoc ? 1 : 0,
    imagemHomeUrl1: framework?.homeImageUrl1,
    imagemHomeUrl2: framework?.homeImageUrl2,
    imagemHomeUrl3: framework?.homeImageUrl3,
    imagemHomeUrl4: framework?.homeImageUrl4,
    imagemHomeUrl5: framework?.homeImageUrl5,
    imagemHomeUrl6: framework?.homeImageUrl6,
    imagemHomeUrl7: framework?.homeImageUrl7,
    imagemHomeUrl8: framework?.homeImageUrl8,
    imagemHomeUrl9: framework?.homeImageUrl9,
    imagemHomeUrl10: framework?.homeImageUrl10,
    imagemHomeUrl11: framework?.homeImageUrl11,
    imagemHomeUrl12: framework?.homeImageUrl12,
    imagemHomeUrl13: framework?.homeImageUrl13,
    imagemHomeUrl14: framework?.homeImageUrl14,
    imagemHomeUrl15: framework?.homeImageUrl15,
    imagemHomeUrl16: framework?.homeImageUrl16,
    imagemHomeUrl17: framework?.homeImageUrl17,
    imagemHomeUrl18: framework?.homeImageUrl18,
    imagemHomeUrl19: framework?.homeImageUrl19,
    imagemHomeUrl20: framework?.homeImageUrl20,
    serverAddress: framework?.serverAddress,
    siteParaReserva: framework?.websiteToBook,
    nomeCondominio: framework?.condominiumName,
    cnpjCondominio: framework?.condominiumDocument,
    enderecoCondominio: framework?.condominiumAddress,
    nomeAdministradoraCondominio: framework?.condominiumAdministratorName,
    cnpjAdministradoraCondominio: framework?.condominiumAdministratorDocument,
    enderecoAdministradoraCondominio:
      framework?.condominiumAdministratorAddress,
    // Sidebar visibility toggles (non-admin)
    sidebarShowDocuments: framework?.sidebarShowDocuments ? 1 : 0,
    sidebarShowFinance: framework?.sidebarShowFinance ? 1 : 0,
    sidebarShowImages: framework?.sidebarShowImages ? 1 : 0,
    sidebarShowFaqs: framework?.sidebarShowFaqs ? 1 : 0,
  };
}
