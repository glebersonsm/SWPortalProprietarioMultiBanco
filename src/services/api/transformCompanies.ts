import {
  CompanyPayload,
  CompleteCompany,
  IncomingCompany,
} from "@/utils/types/companies";

export function transformedCompanies(
  companies: IncomingCompany[]
): CompleteCompany[] {
  return companies.map((company) => {
    const { pessoaEmpresa } = company;
    const { enderecos, telefones, documentos } = pessoaEmpresa;

    const addresses = enderecos.map((endereco) => {
      return {
        neighborhood: endereco.bairro,
        cep: endereco.cep,
        cityId: endereco.cidadeId,
        cityName: endereco.cidadeNome,
        id: endereco.id,
        street: endereco.logradouro,
        number: endereco.numero,
        isPreferential: !!endereco.preferencial,
        addressTypeId: endereco.tipoEnderecoId,
        addressTypeName: endereco.tipoEnderecoNome,
      };
    });

    const documents = documentos.map((documento) => {
      return {
        id: documento.id,
        number: documento.numero,
        formattedNumber: documento?.numeroFormatado,
        documentTypeId: documento.tipoDocumentoId,
        documentTypeName: documento.tipoDocumentoNome,
        issuingBody: documento?.orgaoEmissor,
        dateOfIssue: documento?.dataEmissao?.split("T")[0],
        expiryDate: documento?.dataValidade,
      };
    });

    const phones = telefones.map((telefone) => {
      return {
        id: telefone.id,
        number: telefone.numero,
        phoneTypeId: telefone.tipoTelefoneId,
        phoneTypeName: telefone.tipoTelefoneNome,
        isPreferential: !!telefone.preferencial,
      };
    });

    return {
      id: company.id,
      companyId: pessoaEmpresa.id,
      name: pessoaEmpresa.nome,
      fantasyName: pessoaEmpresa.nomeFantasia,
      taxRegime: pessoaEmpresa.regimeTributario,
      code: company.codigo,
      mainEmail: pessoaEmpresa.emailPreferencial,
      alternativeEmail: pessoaEmpresa?.emailAlternativa,
      personType: pessoaEmpresa.tipoPessoa,
      groupCompanyId: company.grupoEmpresaId,
      addresses: addresses,
      documents: documents,
      phones: phones,
    };
  });
}

export function untransformedCompany(company: CompleteCompany): CompanyPayload {
  const documents = company.documents.map((document) => {
    return {
      id: document.id,
      numero: document.number,
      tipoDocumentoId: document.documentTypeId,
      tipoDocumentoNome: document.documentTypeName,
      orgaoEmissor: document?.issuingBody,
      dataValidade: document?.expiryDate,
      dataEmissao: document?.dateOfIssue,
    };
  });

  const phones = company.phones.map((phone) => {
    return {
      id: phone.id,
      numero: phone.number,
      preferencial: phone.isPreferential ? 1 : 0,
      tipoTelefoneId: phone.phoneTypeId,
      tipoTelefoneNome: phone.phoneTypeName,
    };
  });

  const addresses = company.addresses.map((address) => {
    return {
      bairro: address.neighborhood,
      cep: address.cep,
      cidadeId: address.cityId,
      cidadeNome: address.cityName,
      id: address.id,
      logradouro: address.street,
      numero: address.number,
      preferencial: address.isPreferential ? 1 : 0,
      tipoEnderecoId: address.addressTypeId,
      tipoEnderecoNome: address.addressTypeName,
    };
  });

  return {
    id: company.id,
    grupoEmpresaId: company.groupCompanyId,
    pessoa: {
      id: company.companyId,
      razaoSocial: company.name,
      nomeFantasia: company.fantasyName,
      emailPreferencial: company?.mainEmail,
      emailAlternativo: company.alternativeEmail,
      tipoPessoa: company.personType,
      regimeTributario: company.taxRegime,
      documentos: documents,
      enderecos: addresses,
      telefones: phones,
    },
  };
}
