import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getQuizAPI, submitQuizAPI } from "./quizService";

const initialState = {
  questions: [],
  answers: {},
  score: null,
  isLoading: false,
  error: null,
};

export const fetchQuiz = createAsyncThunk(
  "quiz/fetch",
  async (topicId, thunkAPI) => {
    try {
      return await getQuizAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch quiz");
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async (payload, thunkAPI) => {
    try {
      return await submitQuizAPI(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to submit quiz");
    }
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer(state, action) {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    resetQuiz(state) {
      state.questions = [];
      state.answers = {};
      state.score = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.score = action.payload.score;
      });
  },
});

export const { selectAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
