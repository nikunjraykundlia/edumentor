'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, ChevronDown, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Avatar from '@/components/ui/Avatar';
import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch { /* ignore */ }
        logout();
        router.push('/login');
    };

    return (
        <nav
            className="glass-navbar"
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
            }}
        >
            {/* Logo */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                }}
                onClick={() => router.push('/')}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <GraduationCap size={20} color="white" />
                </div>
                <span
                    style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                    }}
                    className="gradient-text"
                >
                    Edumentor
                </span>
            </div>

            {/* User menu */}
            {user && (
                <div ref={menuRef} style={{ position: 'relative' }}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'none',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            color: 'var(--text-primary)',
                        }}
                    >
                        <Avatar name={user.name} src={user.avatar} size={30} />
                        <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name}</span>
                        <span
                            style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: user.role === 'teacher' ? 'rgba(99,102,241,0.2)' : 'rgba(34,211,238,0.2)',
                                color: user.role === 'teacher' ? '#818CF8' : '#22D3EE',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        >
                            {user.role}
                        </span>
                        <ChevronDown size={14} />
                    </button>

                    {menuOpen && (
                        <div
                            className="glass-card"
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                minWidth: '180px',
                                padding: '6px',
                                zIndex: 60,
                            }}
                        >
                            <button
                                onClick={() => { setMenuOpen(false); router.push(`/${user.role}/dashboard`); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    background: 'none',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                            >
                                <User size={16} /> Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    background: 'none',
                                    color: '#EF4444',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
