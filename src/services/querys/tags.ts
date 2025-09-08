import axiosInstance from "@/services/AxiosInstance";
import { transformedTags } from "../api/transformTags";
import { RequiredTags } from "@/utils/types/tags";
import axios from "axios";

export const getTags = async (): Promise<RequiredTags[]> => {
  try {
    const response = await axiosInstance.get("/Tags/search");
    const data = response.data.data;

    const tags = transformedTags(data);
    return tags;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.status === 404) return [];
    }
    throw error;
  }
};

export const addTag = async (tagName: string) => {
  const tag = { nome: tagName };
  const response = await axiosInstance.post("/Tags", tag);

  return response.data.data;
};
