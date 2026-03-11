'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Mail, Shield, Calendar, BookOpen } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function TeacherProfile() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/auth/logout');
        } catch {
            // Continue with logout even if API call fails
        }
        logout();
        router.push('/login');
    };

    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : '—';

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '?';

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        marginBottom: '4px',
                    }}
                >
                    My Profile
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Manage your account settings
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ maxWidth: '600px' }}
            >
                <GlassCard style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                    {/* Accent bar */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                        }}
                    />

                    {/* Avatar + Name */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            marginBottom: '32px',
                        }}
                    >
                        <div
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-display)',
                                color: 'white',
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </div>
                        <div>
                            <h2
                                style={{
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    fontFamily: 'var(--font-display)',
                                    marginBottom: '4px',
                                }}
                            >
                                {user?.name || 'Unknown'}
                            </h2>
                            <span
                                style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    background: 'rgba(99, 102, 241, 0.15)',
                                    color: 'var(--accent-primary)',
                                }}
                            >
                                {user?.role || 'teacher'}
                            </span>
                        </div>
                    </div>

                    {/* Info rows */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            marginBottom: '32px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <Mail size={18} color="var(--accent-secondary)" />
                            <div>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '2px',
                                    }}
                                >
                                    Email
                                </p>
                                <p style={{ fontSize: '15px' }}>{user?.email || '—'}</p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <Shield size={18} color="var(--success)" />
                            <div>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '2px',
                                    }}
                                >
                                    Role
                                </p>
                                <p style={{ fontSize: '15px', textTransform: 'capitalize' }}>
                                    {user?.role || 'Teacher'}
                                </p>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <Calendar size={18} color="var(--warning)" />
                            <div>
                                <p
                                    style={{
                                        fontSize: '11px',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '2px',
                                    }}
                                >
                                    Joined
                                </p>
                                <p style={{ fontSize: '15px' }}>{joinedDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            background: 'rgba(239, 68, 68, 0.08)',
                            color: 'var(--error)',
                            fontSize: '15px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-body)',
                            cursor: loggingOut ? 'not-allowed' : 'pointer',
                            opacity: loggingOut ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (!loggingOut) {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                        }}
                    >
                        <LogOut size={18} />
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </GlassCard>
            </motion.div>
        </div>
    );
}
