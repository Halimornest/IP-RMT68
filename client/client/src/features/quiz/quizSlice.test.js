import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import quizReducer, {
  fetchQuiz,
  submitQuiz,
  explainAnswer,
  resetQuiz,
} from "./quizSlice";

vi.mock("./quizService", () => ({
  getQuizAPI: vi.fn(),
  submitQuizAPI: vi.fn(),
  explainAnswerAPI: vi.fn(),
  getQuizHistoryAPI: vi.fn(),
}));

import {
  getQuizAPI,
  submitQuizAPI,
  explainAnswerAPI,
} from "./quizService";

function createStore(preloadedState) {
  return configureStore({
    reducer: { quiz: quizReducer },
    preloadedState,
  });
}

describe("quizSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle initial state", () => {
    const store = createStore();
    const state = store.getState().quiz;

    expect(state.quizId).toBe(null);
    expect(state.questions).toEqual([]);
    expect(state.answers).toEqual({});
    expect(state.score).toBe(null);
  });

  it("should fetch quiz successfully", async () => {
    getQuizAPI.mockResolvedValue({
      data: {
        quizId: "quiz-1",
        quiz: [{ question: "Apa itu React?" }],
      },
    });

    const store = createStore();

    await store.dispatch(fetchQuiz("topic-1"));

    const state = store.getState().quiz;

    expect(getQuizAPI).toHaveBeenCalledWith("topic-1");
    expect(state.quizId).toBe("quiz-1");
    expect(state.questions.length).toBe(1);
    expect(state.isLoading).toBe(false);
  });

  it("should submit quiz and store score", async () => {
    submitQuizAPI.mockResolvedValue({
      data: {
        score: 100,
        details: [],
      },
    });

    const store = createStore({
      quiz: {
        quizId: "quiz-1",
        questions: [{}, {}],
        answers: { 0: "A", 1: "B" },
        isLoading: false,
        score: null,
        details: [],
        explanations: {},
        explainingIndex: null,
        history: [],
        error: null,
      },
    });

    await store.dispatch(submitQuiz());

    const state = store.getState().quiz;

    expect(submitQuizAPI).toHaveBeenCalled();
    expect(state.score).toBe(100);
  });

  it("should explain wrong answer", async () => {
    explainAnswerAPI.mockResolvedValue("Ini penjelasan AI");

    const store = createStore();

    await store.dispatch(
      explainAnswer({
        index: 0,
        detail: {
          question: "Apa itu React?",
          options: ["Library", "Framework"],
          correctOption: "Library",
          selectedOption: "Framework",
        },
      })
    );

    const state = store.getState().quiz;

    expect(explainAnswerAPI).toHaveBeenCalled();
    expect(state.explanations[0]).toBe("Ini penjelasan AI");
    expect(state.explainingIndex).toBe(null);
  });

  it("should reset quiz state", () => {
    const store = createStore({
      quiz: {
        quizId: "quiz-1",
        questions: [{ question: "Test" }],
        answers: { 0: "A" },
        score: 80,
        details: [{}],
        explanations: {},
        explainingIndex: null,
        history: [],
        isLoading: false,
        error: null,
      },
    });

    store.dispatch(resetQuiz());

    const state = store.getState().quiz;

    expect(state.quizId).toBe(null);
    expect(state.questions).toEqual([]);
    expect(state.answers).toEqual({});
    expect(state.score).toBe(null);
  });
});
