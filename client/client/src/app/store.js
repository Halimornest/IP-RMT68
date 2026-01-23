import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import topicsReducer from "../features/topics/topicsSlice";
import quizReducer from "../features/quiz/quizSlice";
import progressReducer from "../features/progress/progressSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    topics: topicsReducer,
    quiz: quizReducer,
    progress: progressReducer,
  },
});
