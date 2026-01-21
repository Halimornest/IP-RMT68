import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import topicsReducer from "../features/topics/topicsSlice";
import quizReducer from "../features/quiz/quizSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicsReducer,
    quiz: quizReducer, 
  },
});
