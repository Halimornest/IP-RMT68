import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getQuizAPI,
  submitQuizAPI,
  explainAnswerAPI,
  getQuizHistoryAPI,
} from "./quizService";

const initialState = {
  quizId: null,
  questions: [],
  answers: {},
  isLoading: false,
  score: null,
  details: [],
  explanations: {},
  explainingIndex: null,
  history: [],

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

    const answers = quiz.questions.map((q, index) => ({
      selectedOption: quiz.answers[index],
    }));

    return await submitQuizAPI({
      quizId: quiz.quizId,
      answers,
    });
  }
);

export const explainAnswer = createAsyncThunk(
  "quiz/explain",
  async ({ detail, index }) => {
    const payload = {
      question: detail.question,
      options: detail.options,
      correctOptionIndex: detail.options.findIndex(
        (o) => o === detail.correctOption
      ),
      selectedOptionIndex: detail.options.findIndex(
        (o) => o === detail.selectedOption
      ),
      level: "beginner",
    };

    const explanation = await explainAnswerAPI(payload);
    return { index, explanation };
  }
);

export const fetchQuizHistory = createAsyncThunk(
  "quiz/history",
  async (topicId) => {
    return await getQuizHistoryAPI(topicId);
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    selectAnswer(state, action) {
      state.answers[action.payload.index] = action.payload.option;
    },
    resetQuiz() {
      return {
        quizId: null,
        questions: [],
        answers: {},
        isLoading: false,
        score: null,
        details: [],
        explanations: {},
        explainingIndex: null,
        history: [],
        error: null,
      };
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
        state.quizId = action.payload.data.quizId;
        state.questions = action.payload.data.quiz;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.score = action.payload.data.score;
        state.details = action.payload.data.details;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(explainAnswer.pending, (state, action) => {
        state.explainingIndex = action.meta.arg.index;
      })
      .addCase(explainAnswer.fulfilled, (state, action) => {
        state.explainingIndex = null;
        state.explanations[action.payload.index] =
          action.payload.explanation;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { selectAnswer, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
