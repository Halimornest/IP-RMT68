import api from "../../services/api";

export const getTopicsAPI = async () => {
  const res = await api.get("/learning/topics");
  return res.data;
};

export const createTopicAPI = async (payload) => {
  const res = await api.post("/ai/generate-topic-and-save", payload);
  return res.data;
};

export const deleteTopicAPI = async () => {
  throw new Error("Delete not implemented");
};
