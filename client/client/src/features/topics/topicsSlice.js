import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTopicsAPI,
  createTopicAPI,
  deleteTopicAPI,
} from "./topicsService";

const initialState = {
  list: [],
  isLoading: false,
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
    } catch {
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
    } catch {
      return thunkAPI.rejectWithValue("Delete failed");
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
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.list = payload;
        } else if (Array.isArray(payload?.data)) {
          state.list = payload.data;
        } else if (Array.isArray(payload?.data?.topics)) {
          state.list = payload.data.topics;
        } else {
          state.list = [];
        }
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
        state.list = state.list.filter((t) => t.id !== action.payload);
      });
  },
});

export default topicsSlice.reducer;
