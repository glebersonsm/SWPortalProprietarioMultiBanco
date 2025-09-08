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
  if (value && value !== "string") {
    form.append(key, value.toString());
  }
}

export const editFrameworkParams = async (
  settingsParams: IncomingFramework
) => {
  const form = new FormData();

  appendIfValid(
    form,
    "siteParaReserva",
    settingsParams.siteParaReserva!.toString()
  );
  appendIfValid(
    form,
    "agruparCertidaoPorCliente",
    settingsParams.agruparCertidaoPorCliente!.toString()
  );
  appendIfValid(
    form,
    "emitirCertidaoPorUnidCliente",
    settingsParams.emitirCertidaoPorUnidCliente!.toString()
  );
  appendIfValid(
    form,
    "habilitarBaixarBoleto",
    settingsParams.habilitarBaixarBoleto!.toString()
  );
  appendIfValid(
    form,
    "habilitarPagamentosOnLine",
    settingsParams.habilitarPagamentosOnLine!.toString()
  );
  appendIfValid(
    form,
    "habilitarPagamentoEmPix",
    settingsParams.habilitarPagamentoEmPix!.toString()
  );
  appendIfValid(
    form,
    "habilitarPagamentoEmCartao",
    settingsParams.habilitarPagamentoEmCartao!.toString()
  );
  appendIfValid(
    form,
    "exibirContasVencidas",
    settingsParams.exibirContasVencidas!.toString()
  );
  appendIfValid(
    form,
    "qtdeMaximaDiasContasAVencer",
    settingsParams.qtdeMaximaDiasContasAVencer!.toString()
  );
  appendIfValid(
    form,
    "permitirUsuarioAlterarSeuDoc",
    settingsParams.permitirUsuarioAlterarSeuDoc!.toString()
  );
  appendIfValid(
    form,
    "integradoComMultiPropriedade",
    settingsParams.integradoComMultiPropriedade!.toString()
  );
  appendIfValid(
    form,
    "integradoComTimeSharing",
    settingsParams.integradoComTimeSharing!.toString()
  );
  appendIfValid(
    form,
    "nomeCondominio",
    settingsParams.nomeCondominio!.toString()
  );
  appendIfValid(
    form,
    "cnpjCondominio",
    settingsParams.cnpjCondominio!.toString()
  );
  appendIfValid(
    form,
    "enderecoCondominio",
    settingsParams.enderecoCondominio!.toString()
  );
  appendIfValid(
    form,
    "nomeAdministradoraCondominio",
    settingsParams.nomeAdministradoraCondominio!.toString()
  );
  appendIfValid(
    form,
    "cnpjAdministradoraCondominio",
    settingsParams.cnpjAdministradoraCondominio!.toString()
  );
  appendIfValid(
    form,
    "enderecoAdministradoraCondominio",
    settingsParams.enderecoAdministradoraCondominio!.toString()
  );
  appendIfValid(
    form,
    "permitirUsuarioAlterarSeuEmail",
    settingsParams.permitirUsuarioAlterarSeuEmail!.toString()
  );
  appendIfValid(
    form,
    "exibirFinanceirosDasEmpresaIds",
    settingsParams.exibirFinanceirosDasEmpresaIds!.toString()
  );

  for (let i = 1; i <= 20; i++) {
    const key = `imagemHomeUrl${i}` as keyof IncomingFramework;
    const imageValue = settingsParams[key] as File | string | undefined;

    if (imageValue instanceof File || typeof imageValue === "string") {
      form.append(`imagem${i}`, imageValue);
    }
  }

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
