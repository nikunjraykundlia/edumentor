'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogOut, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface SidebarProps {
    items: SidebarItem[];
}

export default function Sidebar({ items }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const initials = user?.name
        ? user.name
            .split(' ')
            .map((w: string) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : '?';

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post('/auth/logout');
        } catch {
            // Proceed anyway
        }
        logout();
        router.push('/login');
    };

    return (
        <motion.aside
            className="glass-sidebar"
            animate={{ width: collapsed ? '72px' : '240px' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 8px',
                overflow: 'hidden',
                flexShrink: 0,
            }}
        >
            {/* Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    alignSelf: collapsed ? 'center' : 'flex-end',
                    marginBottom: '16px',
                    flexShrink: 0,
                }}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Nav items */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: collapsed ? '12px' : '12px 16px',
                                borderRadius: '12px',
                                border: 'none',
                                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                justifyContent: collapsed ? 'center' : 'flex-start',
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 400,
                                fontFamily: 'var(--font-body)',
                                whiteSpace: 'nowrap',
                                boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.1)' : 'none',
                                width: '100%',
                                textAlign: 'left',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Icon size={20} />
                            {!collapsed && <span>{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Profile Section */}
            <div
                style={{
                    marginTop: 'auto',
                    padding: '16px 8px',
                    borderTop: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
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
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'white',
                            flexShrink: 0,
                        }}
                    >
                        {initials}
                    </div>
                    {!collapsed && (
                        <div style={{ overflow: 'hidden' }}>
                            <p
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user?.name || 'Prof. User'}
                            </p>
                            <p
                                style={{
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {user?.email}
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: collapsed ? '12px' : '10px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.05)',
                        color: 'var(--error)',
                        cursor: loggingOut ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        fontSize: '13px',
                        fontWeight: 500,
                        width: '100%',
                        opacity: loggingOut ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                        if (!loggingOut) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        if (!loggingOut) e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                    }}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>}
                </button>
            </div>
        </motion.aside>
    );
}
