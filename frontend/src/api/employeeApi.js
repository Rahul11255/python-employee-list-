import axios from "axios";

const API_URL = "https://python-employee-list.onrender.com/employees";

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