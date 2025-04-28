import axios from "axios";

export const createApi = (baseUrl: string) => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json"
    }
  });
};