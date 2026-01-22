import api from "../../services/api";

export const loginAPI = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data.data;
};

export const registerAPI = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const meAPI = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
