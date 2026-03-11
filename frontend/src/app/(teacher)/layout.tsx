'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import TeacherSidebar from '@/components/layout/TeacherSidebar';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, loadFromStorage } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'teacher') {
                router.push(`/${user?.role}/dashboard`);
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || user?.role !== 'teacher') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '200px', height: '24px' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            <TeacherSidebar />
            <main style={{ flex: 1, overflowY: 'auto', padding: '32px', minHeight: 'calc(100vh - 64px)' }}>
                {children}
            </main>
        </div>
    );
}
