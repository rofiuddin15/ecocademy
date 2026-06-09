import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async Thunks
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            
            // Fetch current user details with the token
            const meResponse = await api.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(meResponse.data));
            
            return { token: access_token, user: meResponse.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || error.response?.data?.message || 'Login gagal'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { access_token } = response.data;
            localStorage.setItem('token', access_token);

            // Fetch current user details with the token
            const meResponse = await api.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(meResponse.data));

            return { token: access_token, user: meResponse.data };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.errors || error.response?.data?.message || 'Registrasi gagal'
            );
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            const response = await api.get('/auth/me');
            localStorage.setItem('user', JSON.stringify(response.data));
            return { token, user: response.data };
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return rejectWithValue('Sesi berakhir');
        }
    }
);

const storedToken = localStorage.getItem('token');
let storedUser = null;
try {
    storedUser = JSON.parse(localStorage.getItem('user'));
} catch (e) {
    // Clear corrupt storage
    localStorage.removeItem('user');
}

const initialState = {
    token: storedToken || null,
    user: storedUser || null,
    isAuthenticated: !!storedToken,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Check Auth
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.token = action.payload.token;
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                } else {
                    state.token = null;
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isLoading = false;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
