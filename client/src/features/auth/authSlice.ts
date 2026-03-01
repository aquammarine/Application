import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/api';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('access_token'),
    isLoading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await api.post('/auth/logout');
        return null;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.user = action.payload.user || { email: 'user@example.com' }; // Fallback for testing
                state.accessToken = action.payload.access_token;
                localStorage.setItem('access_token', action.payload.access_token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
                localStorage.setItem('user', JSON.stringify(state.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.access_token;
                localStorage.setItem('access_token', action.payload.access_token);
                localStorage.setItem('refresh_token', action.payload.refresh_token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
