'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import StudentSidebar from '@/components/layout/StudentSidebar';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'student') {
                router.push(`/${user?.role}/dashboard`);
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading || !isAuthenticated || user?.role !== 'student') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="skeleton-shimmer" style={{ width: '200px', height: '24px' }} />
            </div>
        );
    }

    const isChatPage = pathname.includes('/student/chat/');

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            <StudentSidebar />
            <main style={{
                flex: 1,
                overflowY: isChatPage ? 'hidden' : 'auto',
                padding: isChatPage ? 0 : '32px',
                height: '100vh'
            }}>
                {children}
            </main>
        </div>
    );
}
