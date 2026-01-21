import api from "../../services/api";

export const getQuizAPI = async (topicId) => {
  const res = await api.get(`/quiz/${topicId}`);
  return res.data;
};

export const submitQuizAPI = async (payload) => {
  const res = await api.post("/quiz/submit", payload);
  return res.data;
};
