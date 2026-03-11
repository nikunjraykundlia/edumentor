'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, GraduationCap, Lock, Mail } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const { addToast } = useToast();

    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            setLoading(true);
            const { data } = await api.post('/auth/login', { email, password });

            if (data.user.role !== role) {
                addToast('error', `Account is registered as a ${data.user.role}. Please select the correct tab.`);
                setLoading(false);
                return;
            }

            setAuth(data.user, data.accessToken);
            addToast('success', `Welcome back, ${data.user.name}!`);
            router.push(`/${role}/dashboard`);
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Failed to login');
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%', maxWidth: '440px', zIndex: 10 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px', cursor: 'pointer' }} onClick={() => router.push('/')}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', marginBottom: '16px' }}>
                        <GraduationCap size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Sign in to continue to Edumentor</p>
                </div>

                <GlassCard style={{ padding: '32px' }}>
                    {/* Role Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '32px' }}>
                        <button
                            onClick={() => setRole('student')}
                            style={{
                                flex: 1, padding: '10px', border: 'none', background: role === 'student' ? 'rgba(99,102,241,0.2)' : 'transparent',
                                color: role === 'student' ? 'var(--text-primary)' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer',
                                fontWeight: role === 'student' ? 600 : 500, transition: 'all 0.2s',
                            }}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setRole('teacher')}
                            style={{
                                flex: 1, padding: '10px', border: 'none', background: role === 'teacher' ? 'rgba(34,211,238,0.2)' : 'transparent',
                                color: role === 'teacher' ? 'var(--text-primary)' : 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer',
                                fontWeight: role === 'teacher' ? 600 : 500, transition: 'all 0.2s',
                            }}
                        >
                            Teacher
                        </button>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-glass"
                                    style={{ paddingLeft: '44px' }}
                                    placeholder="name@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-glass"
                                    style={{ paddingLeft: '44px' }}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '8px', display: 'flex', justifyContent: 'center' }}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : `Sign in as ${role}`}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <button onClick={() => router.push('/register')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
                            Create one
                        </button>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
