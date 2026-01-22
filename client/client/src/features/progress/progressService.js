import api from "../../services/api";

export const getMyProgressAPI = async () => {
  const res = await api.get("/progress/my");
  return res.data.data;
};

export const getTopicProgressAPI = async (topicId) => {
  const res = await api.get(`/progress/topic/${topicId}`);
  return res.data.data;
};

export const getQuizHistoryAPI = async (topicId) => {
  const res = await api.get(`/progress/history/${topicId}`);
  return res.data.data;
};
