import axios from "axios";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Token ${token}`;
} else {
  delete axios.defaults.headers.common["Authorization"];
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

class APIClient {
  async get<TResponse>(url: string) {
    const response = await axiosInstance.get<TResponse>(url);
    return response.data;
  }
}

export const apiClient = new APIClient();
