import api from "../../services/api";

export const getQuizAPI = async (topicId) => {
  const res = await api.post("/quiz/generate-and-save", {
    topicId,
  });
  return res.data;
};

export const submitQuizAPI = async (payload) => {
  const res = await api.post("/quiz/submit", payload);
  return res.data;
};

export const explainAnswerAPI = async (payload) => {
  const res = await api.post("/quiz/explain", payload);
  return res.data.data.explanation;
};

export const getQuizHistoryAPI = async (topicId) => {
  const res = await api.get(`/quiz/history/${topicId}`);
  return res.data.data.history;
};
