import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/auth-client";

import type {
    User,
    LoginCredentials,
    RegisterPayload,
} from "../types/auth.types";

type AuthState = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    hasHydrated: boolean;

    setHasHydrated: (state: boolean) => void;

    login: (credentials: LoginCredentials) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,
            hasHydrated: false,

            setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

            clearError: () => set({ error: null }),

            login: async (credentials) => {
                try {
                    set({ isLoading: true, error: null })

                    await api.post('/auth/login', credentials);
                    await useAuthStore.getState().fetchUser();

                    set({ isLoading: false, })
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error:
                            error.response?.data?.message || 'Login failed',
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                try {
                    set({ isLoading: true, error: null })

                    await api.post('/auth/register', userData);
                    await useAuthStore.getState().fetchUser();

                    set({ isLoading: false, })
                } catch (error: any) {
                    set({
                        isLoading: false,
                        error:
                            error.response?.data?.message || 'Registration failed',
                    })
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await api.post('/auth/logout')
                } catch (error) {
                }

                set({
                    user: null,
                    error: null,
                })
            },

            fetchUser: async () => {
                try {
                    set({ isLoading: true, error: null })

                    const response = await api.get('/auth/user')
                    const data = response.data

                    set({
                        user: data.user,
                        isLoading: false,
                    })
                } catch (error: any) {
                    set({
                        isLoading: false,
                        user: null,
                        error:
                            error.response?.status === 401
                                ? null
                                : (error.response?.data?.message || 'Failed to fetch user'),
                    })
                }
            },
        }),
        {
            name: "auth-storage",

            partialize: (state) => ({
                user: state.user,
            }),
            onRehydrateStorage: () => {
                return () => {
                    useAuthStore.setState({ hasHydrated: true });
                };
            },
        },
    ),
)