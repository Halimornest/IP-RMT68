import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAPI, meAPI, registerAPI } from "./authService";

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token || null,
  isAuth: !!token,
  isLoading: false,
  error: null,
};

/* ======================
   ASYNC THUNKS
====================== */

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      return await loginAPI(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, thunkAPI) => {
    try {
      return await registerAPI(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, thunkAPI) => {
    try {
      return await meAPI();
    } catch {
      return thunkAPI.rejectWithValue("Unauthorized");
    }
  }
);

/* ======================
   SLICE
====================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuth = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    loginSuccess(state, action) {
      state.token = action.payload;
      state.isAuth = true;
      localStorage.setItem("token", action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== LOGIN ===== */
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;

        state.isLoading = false;
        state.token = token;
        state.user = user;
        state.isAuth = true;
        state.error = null;

        localStorage.setItem("token", token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== REGISTER ===== */
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // fleksibel: backend bisa return { data: { token, user } } atau langsung
        const data = action.payload.data || action.payload;
        const { token, user } = data;

        state.isLoading = false;
        state.token = token;
        state.user = user;
        state.isAuth = true;
        state.error = null;

        localStorage.setItem("token", token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      /* ===== FETCH ME ===== */
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuth = false;
        state.error = null;

        localStorage.removeItem("token");
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
