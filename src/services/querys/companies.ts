import axios from "@/services/AxiosInstance";
import {
  Company,
  CompanyPayload,
  CompleteCompany,
  IncomingCompany,
} from "@/utils/types/companies";
import { transformedCompanies } from "../api/transformCompanies";

export const getCompanies = async (
  companyId?: string,
  loadFullPerson?: boolean
): Promise<Company[]> => {
  const response = await axios.get("/Empresa/search", {
    params: {
      Id: companyId,
      CarregarPessoaCompleta: loadFullPerson,
    },
  });

  const data = response.data.data;

  const companies = data.map((company: IncomingCompany) => {
    return {
      companyId: company.id,
      name: company.pessoaEmpresa.nome,
      code: company.codigo,
      mainEmail: company.pessoaEmpresa.emailPreferencial,
    };
  });
  return companies;
};

export const getCompany = async (
  companyId: string
): Promise<CompleteCompany> => {
  const response = await axios.get("/Empresa/search", {
    params: {
      Id: companyId,
      CarregarPessoaCompleta: true,
    },
  });

  const data = response.data.data;

  const company = transformedCompanies(data)[0];
  return company;
};

export const editCompany = async (company: CompanyPayload) => {
  const response = await axios.patch("/Empresa", company);
  return response.data.data;
};

export const addCompany = async (company: CompanyPayload) => {
  const response = await axios.post("/Empresa", company);
  return response.data.data;
};
