import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTopicProgressAPI,
  getQuizHistoryAPI,
  getMyProgressAPI,
} from "./progressService";

const initialState = {
  list: [],
  loadingList: false,

  detail: null,
  loadingDetail: false,

  history: [],
  loadingHistory: false,

  error: null,
};

export const fetchMyProgress = createAsyncThunk(
  "progress/fetchMy",
  async (_, thunkAPI) => {
    try {
      return await getMyProgressAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load my progress"
      );
    }
  }
);

export const fetchTopicProgress = createAsyncThunk(
  "progress/fetchDetail",
  async (topicId, thunkAPI) => {
    try {
      return await getTopicProgressAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load topic progress"
      );
    }
  }
);

export const fetchQuizHistory = createAsyncThunk(
  "progress/fetchHistory",
  async (topicId, thunkAPI) => {
    try {
      return await getQuizHistoryAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load quiz history"
      );
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    resetProgress: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchMyProgress.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchMyProgress.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload;
      })

      .addCase(fetchTopicProgress.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchTopicProgress.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchTopicProgress.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      })
      
      .addCase(fetchQuizHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = action.payload;
      })
      .addCase(fetchQuizHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      });
  },
});

export const { resetProgress } = progressSlice.actions;
export default progressSlice.reducer;
