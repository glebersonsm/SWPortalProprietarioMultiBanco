import {
  CompleteUser,
  CompleteUserSent,
  UserSent,
  UserWelcome,
} from "@/utils/types/users";
import { untransformedTags } from "./transformTags";
import { IncomingGroupCompany } from "@/utils/types/companies";

export function transformedUsers(users: UserWelcome[]): CompleteUser[]  {
  return users.map((user) => {
    const { pessoa, tagsRequeridas } = user;
    const { enderecos, telefones, documentos } = pessoa;

    const addresses = enderecos?.map((endereco) => {
      return {
        neighborhood: endereco?.bairro,
        cep: endereco?.cep,
        cityId: endereco?.cidadeId,
        cityName: endereco?.cidadeNome,
        id: endereco?.id,
        street: endereco?.logradouro,
        number: endereco?.numero,
        isPreferential: endereco?.preferencial === 1,
        addressTypeId: endereco?.tipoEnderecoId,
        addressTypeName: endereco?.tipoEnderecoNome,
      };
    });

    const documents = documentos?.map((documento) => {
      return {
        id: documento?.id,
        number: documento?.numero,
        formattedNumber: documento?.numeroFormatado,
        documentTypeId: documento?.tipoDocumentoId,
        documentTypeName: documento?.tipoDocumentoNome,
        issuingBody: documento?.orgaoEmissor,
        dateOfIssue: documento?.dataEmissao?.split("T")[0],
        expiryDate: documento?.dataValidade,
      };
    }) ?? [];

    const phones = telefones?.map((telefone) => {
      return {
        id: telefone?.id,
        number: telefone?.numero,
        phoneTypeId: telefone?.tipoTelefoneId,
        phoneTypeName: telefone?.tipoTelefoneNome,
        isPreferential: telefone?.preferencial === 1,
      };
    }) ?? [];

    const requiredTags = tagsRequeridas?.map((tag) => {
      return {
        id: tag?.tags?.id,
        name: tag?.tags?.nome,
      };
    }) ?? [];

    const companies = user?.usuarioEmpresas?.map(
      (company: IncomingGroupCompany) => {
        return {
          companyId: company?.empresaId,
          name: company?.pessoaJuridicaNome,
        };
      }
    ) ?? [];

    return {
      isAdm: user.administrador == 1,
      id: user.id,
      login: user.login,
      name: user.nomePessoa,
      gestorFinanceiro: user.gestorReservasAgendamentos,
      gestorReservasAgendamentos: user.gestorReservasAgendamentos,
      personId: user.pessoaId,
      personType: pessoa.tipoPessoa,
      isActive: user.status === 1,
      email: pessoa.emailPreferencial,
      addresses: addresses ?? [],
      documents: documents ?? [],
      phones: phones ?? [],
      requiredTags: requiredTags ?? [],
      companies: companies ?? [],
    };
  }) ?? [];
}

export function untransformedUsers(user: CompleteUserSent): UserSent {
  const documents = user.documents?.map((document) => {
    return {
      id: document.id,
      numero: document.number,
      tipoDocumentoId: document.documentTypeId,
      tipoDocumentoNome: document.documentTypeName,
      orgaoEmissor: document?.issuingBody,
      dataValidade: document?.expiryDate,
      dataEmissao: document?.dateOfIssue,
    };
  }) ?? [];

  const phones = user.phones?.map((phone) => {
    return {
      id: phone.id,
      numero: phone.number,
      preferencial: phone.isPreferential ? 1 : 0,
      tipoTelefoneId: phone.phoneTypeId,
      tipoTelefoneNome: phone.phoneTypeName,
    };
  }) ?? [];

  const addresses = user.addresses?.map((address) => {
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
  }) ?? [];

  const companies = user.companies?.map((company) => {
    return company.companyId;
  }) ?? [];

  return {
    id: user.id,
    administrador: user.isAdm ? 1 : 0,
    gestorFinanceiro: user.gestorFinanceiro ? 1 : 0,
    gestorReservasAgendamentos: user.gestorFinanceiro ? 1 : 0,
    login: user.login,
    nomePessoa: user.name,
    pessoaId: user.personId,
    status: user.isActive ? 1 : 0,
    pessoa: {
      id: user.personId,
      tipoPessoa: user.personType,
      nome: user.name,
      emailPreferencial: user.email,
      documentos: documents ?? [],
      telefones: phones ?? [],
      enderecos: addresses ?? [],
    },
    usuarioEmpresas: companies,
    tagsRequeridas: !!user.requiredTags
      ? untransformedTags(user.requiredTags)
      : [],
    removerTagsNaoEnviadas: true,
    removerEmpresasNaoEnviadas: true,
  };
}
