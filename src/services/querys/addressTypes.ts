import axios from "@/services/AxiosInstance";
import { IncomingAddressTypes, PhoneTypes } from "@/utils/types/users";

export const getAddressTypes = async ({
  personType,
}: {
  personType: number;
}): Promise<PhoneTypes[]> => {
  const response = await axios.get("/TipoEndereco/search", {
    params: { tipoPessoa: personType },
  });
  const data = response.data.data;

  const addressesTypes = data.map((item: IncomingAddressTypes) => {
    return {
      id: item.id,
      name: item.nome,
    };
  });
  return addressesTypes;
};
