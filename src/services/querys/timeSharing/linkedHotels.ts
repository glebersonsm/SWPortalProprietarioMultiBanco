import axios from "@/services/AxiosInstance";

export type LinkedHotel = {
  hotelId: number;
  hotelNome: string;
};

export type LinkedHotelsResponse = {
  status: number;
  success: boolean;
  data: LinkedHotel[];
  errors: string[];
};

export const getLinkedHotels = async (): Promise<LinkedHotelsResponse> => {
  const response = await axios.get("/TimeSharing/hoteisVinculados");
  return response.data;
};