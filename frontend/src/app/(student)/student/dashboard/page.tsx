'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Sparkles, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function StudentDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ enrolledCount: 0, chatCount: 0 });
    const [recentSessions, setRecentSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [profileRes, sessionsRes] = await Promise.all([
                    api.get('/users/me'),
                    api.get('/chat/sessions'),
                ]);
                setStats({
                    enrolledCount: profileRes.data.user?.enrolledSubjects?.length || 0,
                    chatCount: sessionsRes.data.sessions?.length || 0,
                });
                setRecentSessions((sessionsRes.data.sessions || []).slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const statCards = [
        { label: 'Enrolled Subjects', value: stats.enrolledCount, icon: BookOpen, color: 'var(--accent-primary)', cls: 'stat-indigo' },
        { label: 'Chat Sessions', value: stats.chatCount, icon: MessageSquare, color: 'var(--accent-secondary)', cls: 'stat-cyan' },
        { label: 'AI Answers', value: '∞', icon: Sparkles, color: 'var(--success)', cls: 'stat-emerald' },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Here&apos;s your study overview
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {statCards.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <GlassCard key={i} style={{ padding: '24px' }} className={s.cls}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={22} color={s.color} />
                                </div>
                            </div>
                            <p style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                                {loading ? <span className="skeleton-shimmer" style={{ display: 'inline-block', width: '40px', height: '30px' }} /> : s.value}
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Recent Chats */}
            <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Recent Chats</h2>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '60px', borderRadius: '12px' }} />)}
                </div>
            ) : recentSessions.length === 0 ? (
                <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                    <MessageSquare size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No chats yet</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Enroll in a subject and start chatting with your notes!</p>
                </GlassCard>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentSessions.map((session: any) => (
                        <GlassCard key={session._id} hover style={{ padding: '16px', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>{session.title || 'New Chat'}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={12} />
                                        {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleDateString() : 'No messages'}
                                    </p>
                                </div>
                                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)', background: 'rgba(34,211,238,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                                    {typeof session.subject === 'object' ? session.subject?.code : 'Subject'}
                                </span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    );
}
