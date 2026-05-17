/**
 * Auth Redux slice — manages user authentication state.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { getToken, getStoredUser, setToken, setStoredUser, clearAuthStorage } from '../../utils/storage';

// ---- Async Thunks ----

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setStoredUser({ fullName: data.fullName, email: data.email, role: data.role });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      setToken(data.token);
      setStoredUser({ fullName: data.fullName, email: data.email, role: data.role });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ---- Initial State ----

const token = getToken();
const user = getStoredUser();

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!(token && user),
  loading: false,
  error: null,
};

// ---- Slice ----

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentialsFromStorage: (state) => {
      const storedToken = getToken();
      const storedUser = getStoredUser();
      if (storedToken && storedUser) {
        state.token = storedToken;
        state.user = storedUser;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          fullName: action.payload.fullName,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          fullName: action.payload.fullName,
          email: action.payload.email,
          role: action.payload.role,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, setCredentialsFromStorage } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
