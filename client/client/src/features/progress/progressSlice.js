import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTopicProgressAPI,
  getQuizHistoryAPI,
  getMyProgressAPI,
  getTopicVideosAPI,
} from "./progressService";

const initialState = {
  list: [],
  loadingList: false,

  detail: null,
  loadingDetail: false,

  history: [],
  loadingHistory: false,

  videos: [],
  loadingVideos: false,

  error: null,
};

export const fetchMyProgress = createAsyncThunk(
  "progress/fetchMy",
  async (_, thunkAPI) => {
    try {
      return await getMyProgressAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load my progress");
    }
  }
);

export const fetchTopicProgress = createAsyncThunk(
  "progress/fetchDetail",
  async (topicId, thunkAPI) => {
    try {
      return await getTopicProgressAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load topic progress");
    }
  }
);

export const fetchQuizHistory = createAsyncThunk(
  "progress/fetchHistory",
  async (topicId, thunkAPI) => {
    try {
      return await getQuizHistoryAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load quiz history");
    }
  }
);

export const fetchTopicVideos = createAsyncThunk(
  "progress/fetchVideos",
  async (topicId, thunkAPI) => {
    try {
      return await getTopicVideosAPI(topicId);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load videos");
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchMyProgress.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchMyProgress.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload || [];
      })
      .addCase(fetchMyProgress.rejected, (state) => {
        state.loadingList = false;
      })
      .addCase(fetchTopicProgress.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchTopicProgress.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchTopicProgress.rejected, (state) => {
        state.loadingDetail = false;
        state.detail = null;
      })

      .addCase(fetchQuizHistory.pending, (state) => {
        state.loadingHistory = true;
      })
      .addCase(fetchQuizHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        state.history = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchQuizHistory.rejected, (state) => {
        state.loadingHistory = false;
        state.history = [];
      })

      .addCase(fetchTopicVideos.pending, (state) => {
        state.loadingVideos = true;
      })
      .addCase(fetchTopicVideos.fulfilled, (state, action) => {
        state.loadingVideos = false;
        state.videos = Array.isArray(action.payload?.videos)
          ? action.payload.videos
          : [];
      })
      .addCase(fetchTopicVideos.rejected, (state) => {
        state.loadingVideos = false;
        state.videos = [];
      });
  },
});

export default progressSlice.reducer;
