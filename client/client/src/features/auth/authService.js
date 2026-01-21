import api from "../../services/api";

export const loginAPI = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerAPI = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const meAPI = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};
