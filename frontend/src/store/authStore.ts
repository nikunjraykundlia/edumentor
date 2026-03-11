'use client';

import { create } from 'zustand';
import type { User } from '@/lib/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;
    loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,

    setAuth: (user, token) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', token);
        set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    },

    loadFromStorage: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            if (userStr && token) {
                try {
                    const user = JSON.parse(userStr);
                    set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
                } catch {
                    set({ isLoading: false });
                }
            } else {
                set({ isLoading: false });
            }
        }
    },
}));
