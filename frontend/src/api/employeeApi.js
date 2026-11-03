import axios from "axios";

const API_URL = "http://127.0.0.1:8000/employees";

export const getEmployees = async ({ queryKey, signal }) => {
  const [, search, page] = queryKey;

  const response = await axios.get(API_URL, {
    params: {
      search,
      page,
      page_size: 5,
    },
    signal,
  });

  return response.data;
};