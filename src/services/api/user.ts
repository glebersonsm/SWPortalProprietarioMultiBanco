import axios from "@/services/AxiosInstance";
import { IncomingGroupCompany } from "@/utils/types/companies";
import { AuthUser } from "@/utils/types/users";

export const getUser = async (userId: number): Promise<AuthUser> => {
  const responseUser = await axios.get("/Usuario/search", {
    params: {
      Id: userId,
      CarregarDadosPessoa: true,
      CarregarEmpresas: true,
    },
  });

  const [user] = responseUser.data.data;

  const companies = user.usuarioEmpresas.map(
    (company: IncomingGroupCompany) => {
      return {
        companyId: company.empresaId,
        id: company.id,
        groupCompanyId: company.grupoEmpresaId,
        groupCompanyName: company.grupoEmpresaNome,
        companyName: company.pessoaJuridicaNome,
      };
    }
  );

  return {
    isAdm: user.administrador == 1,
    id: user.id,
    login: user.login,
    name: user.nomePessoa,
    personId: user.pessoaId,
    isActive: !!user.status,
    gestorFinanceiro: user.gestorFinanceiro,
    gestorReservasAgendamentos: user.gestorFinanceiro,
    email: user.pessoa.emailPreferencial,
    personType: user.pessoa.tipoPessoa,
    companies: companies,
    integratedWithTimeSharing: user.integradoComTimeSharing === 1,
    integratedWithMultiOwnership: user.integradoComMultiPropriedade === 1
  };
};
