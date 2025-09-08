import axios from "@/services/AxiosInstance";

type IncomingCity = {
  id: number;
  nome: string;
  nomeFormatado: string;
};

type City = {
  id: number;
  name: string;
  formattedName: string;
};

type Cities = {
  data?: City[];
  pageNumber: number;
  lastPageNumber: number;
};

type Params = {
  id?: number;
  name?: string;
  pageNumber?: number;
  search?: string;
};

export const getCities = async ({
  id,
  name,
  search,
  pageNumber,
}: Params): Promise<Cities> => {
  const { data } = await axios.get("/Cidade/searchOnProvider", {
    params: {
      Id: id,
      Nome: name,
      Search: search,
      NumeroDaPagina: pageNumber,
      QuantidadeRegistrosRetornar: 15,
    },
  });

  const cities = data.data.map((city: IncomingCity) => {
    return {
      id: city.id,
      name: city.nome,
      formattedName: city.nomeFormatado,
    };
  });
  return {
    data: cities,
    lastPageNumber: data.lastPageNumber,
    pageNumber: data.pageNumber,
  };
};
