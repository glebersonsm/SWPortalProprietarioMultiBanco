import axios from "@/services/AxiosInstance";
import { transformedUsers } from "@/services/api/transformUsers";
import {
  ChangeUserPassword,
  FiltersProps,
  Users,
  UserSent,
} from "@/utils/types/users";

export const getUsers = async ({
  filters,
  page,
  rowsPerPage
}: {
  filters: FiltersProps;
  page?: number;
  rowsPerPage?: number;
}): Promise<Users> => {
  const response = await axios.get("/Usuario/search", {
    params: {
      Id: filters.id,
      Email: filters.email,
      NomePessoa: filters.name,
      CpfCnpj: filters.cpf,
      CarregarDadosPessoa: true,
      CarregarEmpresas: true,
      Administrador: filters.userType,
      NumeroDaPagina: page ?? 1,
      QuantidadeRegistrosRetornar: rowsPerPage ?? 15,
    },
  });

  const data = response.data.data;
  const lastPageNumber = response.data.lastPageNumber;
  const pageNumber = response.data.pageNumber;
  const users = transformedUsers(data);

  return {
    users: users,
    lastPageNumber: lastPageNumber,
    pageNumber: pageNumber,
  };
};

export const editUser = async (user: UserSent) => {
  const response = await axios.patch("/Usuario", user);
  return response.data.data;
};

export const addUser = async (user: UserSent) => {
  const response = await axios.post("/Usuario", user);
  return response.data.data;
};

export const changeUserPassword = async (information: ChangeUserPassword) => {
  const response = await axios.patch("/Usuario/changepassword", information);
  return response.data.data;
};

export const resetPassword = async (login: string) => {
  const response = await axios.patch("/Usuario/resetpassword", { login });
  return response.data.data;
};
