import axios from "@/services/AxiosInstance";

type IncomingCitySearch = {
  id: number;
  dataHoraCriacao: string;
  usuarioCriacao: number;
  nomeUsuarioCriacao: string;
  dataHoraAlteracao: string;
  usuarioAlteracao: number;
  nomeUsuarioAlteracao: string;
  paisId: number;
  paisNome: string;
  paisCodigoIbge: string;
  estadoSigla: string;
  estadoCodigoIbge: string;
  estadoId: number;
  estadoNome: string;
  nome: string;
  codigoIbge: string;
  nomeFormatado: string;
};

type CitySearch = {
  id: number;
  name: string;
  formattedName: string;
  stateId: number;
  stateName: string;
  stateAbbreviation: string;
  countryId: number;
  countryName: string;
};

type CitySearchResponse = {
  status: number;
  success: boolean;
  data: CitySearch[];
  errors: string[];
  message: string;
  pageNumber: number;
  lastPageNumber: number;
};

type SearchCitiesParams = {
  nome?: string;
  pageNumber?: number;
};

export const searchCities = async ({
  nome,
  pageNumber = 1,
}: SearchCitiesParams): Promise<CitySearchResponse> => {
  const { data } = await axios.get("/cidade/search", {
    params: {
      Nome: nome,
      NumeroDaPagina: pageNumber,
      QuantidadeRegistrosRetornar: 15,
    },
  });

  const cities = data.data.map((city: IncomingCitySearch) => {
    return {
      id: city.id,
      name: city.nome,
      formattedName: city.nomeFormatado,
      stateId: city.estadoId,
      stateName: city.estadoNome,
      stateAbbreviation: city.estadoSigla,
      countryId: city.paisId,
      countryName: city.paisNome,
    };
  });

  return {
    status: data.status,
    success: data.success,
    data: cities,
    errors: data.errors || [],
    message: data.message || '',
    pageNumber: data.pageNumber,
    lastPageNumber: data.lastPageNumber,
  };
};