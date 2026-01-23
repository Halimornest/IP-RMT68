import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import {
  getTopicsAPI,
  createTopicAPI,
  deleteTopicAPI,
} from "./topicsService";

const initialState = {
  list: [],
  isLoading: false,
  isFetched: false,
  error: null,
};

export const fetchTopics = createAsyncThunk(
  "topics/fetch",
  async (_, thunkAPI) => {
    try {
      return await getTopicsAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch topics");
    }
  }
);

export const createTopic = createAsyncThunk(
  "topics/create",
  async (payload, thunkAPI) => {
    try {
      return await createTopicAPI(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to create topic");
    }
  }
);

export const deleteTopic = createAsyncThunk(
  "topics/delete",
  async (id, thunkAPI) => {
    try {
      await deleteTopicAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue("Delete failed");
    }
  }
);

export const generateTopics = createAsyncThunk(
  "topics/generate",
  async ({ subject, level }, thunkAPI) => {
    try {
      const res = await api.post("/ai/generate-and-save-topics", {
        subject,
        level,
      });
      return res.data.data.topics; 
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to generate topics");
    }
  }
);

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchTopics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFetched = true;

        const payload = action.payload;

        state.list = Array.isArray(payload?.data?.topics)
          ? payload.data.topics
          : Array.isArray(payload)
          ? payload
          : [];
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createTopic.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
      })

      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (t) => t.id !== action.payload
        );
      })

      .addCase(generateTopics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(generateTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default topicsSlice.reducer;
