import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getQuizAPI, submitQuizAPI } from "./quizService";

const initialState = {
  quizId: null,
  questions: [],
  answers: {},
  isLoading: false,
  score: null,
  error: null,
};

export const fetchQuiz = createAsyncThunk(
  "quiz/fetch",
  async (topicId, thunkAPI) => {
    try {
      return await getQuizAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load quiz"
      );
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "quiz/submit",
  async (_, thunkAPI) => {
    const { quiz } = thunkAPI.getState();

    if (!quiz.quizId) {
      return thunkAPI.rejectWithValue("Quiz ID missing");
    }

    const answers = quiz.questions.map((q, index) => {
      const questionKey = q.id || q._id || `${index}-${q.question}`;

      return {
        question: q.question,
        selectedOption: quiz.answers[questionKey],
        correctOption: q.answer,
      };
    });

    return await submitQuizAPI({
      quizId: quiz.quizId,
      answers,
    });
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer(state, action) {
      const { questionId, option } = action.payload;
      state.answers[questionId] = option;
    },
    resetQuiz() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuiz.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.questions = [];
        state.quizId = null;
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.isLoading = false;

        state.quizId = action.payload?.data?.quizId || null;
        state.questions = Array.isArray(action.payload?.data?.quiz)
          ? action.payload.data.quiz
          : [];
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.questions = [];
        state.quizId = null;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.score = action.payload?.data?.score ?? null;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
