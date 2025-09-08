import axios from "@/services/AxiosInstance";
import { PhoneTypes, IncomingPhoneTypes } from "@/utils/types/users";

export const getPhoneTypes = async ({
  personType,
}: {
  personType: number;
}): Promise<PhoneTypes[]> => {
  const response = await axios.get("/TipoTelefone/search", {
    params: { tipoPessoa: personType },
  });
  const data = response.data.data;

  const phonesTypes = data.map((item: IncomingPhoneTypes) => {
    return {
      id: item.id,
      name: item.nome,
    };
  });
  return phonesTypes;
};
