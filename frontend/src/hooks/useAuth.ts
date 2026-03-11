'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function useAuth(requiredRole?: 'student' | 'teacher') {
    const { user, isAuthenticated, isLoading, loadFromStorage, logout } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (requiredRole && user?.role !== requiredRole) {
                router.push(`/${user?.role}/dashboard`);
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router]);

    const handleLogout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch { /* silent */ }
        logout();
        router.push('/login');
    }, [logout, router]);

    return { user, isAuthenticated, isLoading, logout: handleLogout };
}
