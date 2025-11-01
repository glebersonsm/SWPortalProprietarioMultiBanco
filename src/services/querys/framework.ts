import { Framework, IncomingFramework } from "@/utils/types/framework";
import axios from "@/services/AxiosInstance";
import { transformedFrameworks } from "../api/transformFrameworks";

export const getFrameworkParams = async (): Promise<Framework> => {
  const response = await axios.get("/Framework/getParameters", {
    timeout: 1000000,
  });
  const frameworkParams = response.data.data;

  return transformedFrameworks(frameworkParams);
};

function appendIfValid(form: FormData, key: string, value: any) {
  if (value !== undefined && value !== null && value !== "") {
    form.append(key, String(value));
  }
}

export const editFrameworkParams = async (
  settingsParams: IncomingFramework
) => {
  const form = new FormData();

  appendIfValid(form, "siteParaReserva", settingsParams.siteParaReserva);
  appendIfValid(
    form,
    "agruparCertidaoPorCliente",
    settingsParams.agruparCertidaoPorCliente
  );
  appendIfValid(
    form,
    "emitirCertidaoPorUnidCliente",
    settingsParams.emitirCertidaoPorUnidCliente
  );
  appendIfValid(
    form,
    "habilitarBaixarBoleto",
    settingsParams.habilitarBaixarBoleto
  );
  appendIfValid(
    form,
    "habilitarPagamentosOnLine",
    settingsParams.habilitarPagamentosOnLine
  );
  appendIfValid(form, "habilitarPagamentoEmPix", settingsParams.habilitarPagamentoEmPix);
  appendIfValid(
    form,
    "habilitarPagamentoEmCartao",
    settingsParams.habilitarPagamentoEmCartao
  );
  appendIfValid(form, "exibirContasVencidas", settingsParams.exibirContasVencidas);
  appendIfValid(
    form,
    "qtdeMaximaDiasContasAVencer",
    settingsParams.qtdeMaximaDiasContasAVencer
  );
  appendIfValid(form, "permitirUsuarioAlterarSeuDoc", settingsParams.permitirUsuarioAlterarSeuDoc);
  appendIfValid(
    form,
    "integradoComMultiPropriedade",
    settingsParams.integradoComMultiPropriedade
  );
  appendIfValid(form, "integradoComTimeSharing", settingsParams.integradoComTimeSharing);
  appendIfValid(form, "nomeCondominio", settingsParams.nomeCondominio);
  appendIfValid(form, "cnpjCondominio", settingsParams.cnpjCondominio);
  appendIfValid(form, "enderecoCondominio", settingsParams.enderecoCondominio);
  appendIfValid(
    form,
    "nomeAdministradoraCondominio",
    settingsParams.nomeAdministradoraCondominio
  );
  appendIfValid(
    form,
    "cnpjAdministradoraCondominio",
    settingsParams.cnpjAdministradoraCondominio
  );
  appendIfValid(
    form,
    "enderecoAdministradoraCondominio",
    settingsParams.enderecoAdministradoraCondominio
  );
  appendIfValid(
    form,
    "permitirUsuarioAlterarSeuEmail",
    settingsParams.permitirUsuarioAlterarSeuEmail
  );
  // Sidebar: visibility toggles for non-admin users (always append 0/1)
  form.append(
    "sidebarShowDocuments",
    String(settingsParams.sidebarShowDocuments ?? 0)
  );
  form.append(
    "sidebarShowFinance",
    String(settingsParams.sidebarShowFinance ?? 0)
  );
  form.append(
    "sidebarShowImages",
    String(settingsParams.sidebarShowImages ?? 0)
  );
  form.append(
    "sidebarShowFaqs",
    String(settingsParams.sidebarShowFaqs ?? 0)
  );
  appendIfValid(
    form,
    "exibirFinanceirosDasEmpresaIds",
    settingsParams.exibirFinanceirosDasEmpresaIds
  );
  appendIfValid(
    form,
    "exibirFinanceiroPortalEmpresaIds",
    settingsParams.exibirFinanceiroPortalEmpresaIds
  );

  for (let i = 1; i <= 20; i++) {
    const key = `imagemHomeUrl${i}` as keyof IncomingFramework;
    const imageValue = settingsParams[key] as File | string | undefined;

    if (imageValue instanceof File || typeof imageValue === "string") {
      form.append(`imagem${i}`, imageValue);
    }
  }

  // Debug: verify payload keys and values during development
  // for (const [key, val] of form.entries()) {
  //   console.log(`FormData -> ${key}:`, val);
  // }

  const response = await axios.post("/Framework/saveParameters", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 1000000,
  });

  return response.data.data;
};

export const getEmpresasVinculadas = async (): Promise<{id:number, nome: string}[]> => {
  const response = await axios.get("/Framework/getEmpresasVinculadas", {
    timeout: 1000000,
  });
  return response.data.data;
};
