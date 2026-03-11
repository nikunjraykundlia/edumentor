'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, GraduationCap, Lock, Mail, User, Building } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { University } from '@/lib/types';

export default function RegisterPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const { addToast } = useToast();

    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityId, setUniversityId] = useState('');

    const [universities, setUniversities] = useState<University[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch mock universities for registration form (since it's a hackathon demo)
    // Usually there'd be an endpoint `GET /api/universities`, but let's hardcode a few for now or assume one exists.
    useEffect(() => {
        // We create a mock university directly in DB during first user registration if none exists
        // But for a realistic complete UI we let the user type a name or select from a dropdown.
        // Let's use a dummy ID for now that the backend will create or accept.
        setUniversities([
            { _id: '665544332211aabbccddeeff', name: 'MIT (Mock Hackathon Uni)', domain: 'mit.edu' },
            { _id: '112233445566aabbccddeeff', name: 'Stanford', domain: 'stanford.edu' },
        ]);
        setUniversityId('665544332211aabbccddeeff');
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !universityId) return;

        try {
            setLoading(true);

            // Fallback: If the user selects a mocked uni ID and it throws a 400 because it doesn't exist in MongoDB,
            // a real implementation would have a script that populates universities.
            // Assuming the API allows registering with an existing university ID.

            const { data } = await api.post('/auth/register', {
                name, email, password, role, universityId
            });

            setAuth(data.user, data.accessToken);
            addToast('success', 'Account created successfully!');
            router.push(`/${role}/dashboard`);
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Failed to register. (Ensure the mock University ID exists in your DB, or seed the DB first).');
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', marginTop: '40px', marginBottom: '40px' }}>

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
                    <h1 style={{ fontSize: '28px', fontWeight: 700 }}>Join Edumentor</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Create your account to get started</p>
                </div>

                <GlassCard style={{ padding: '32px' }}>
                    {/* Role Tabs */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
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

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-glass"
                                    style={{ paddingLeft: '44px' }}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>University</label>
                            <div style={{ position: 'relative' }}>
                                <Building size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <select
                                    value={universityId}
                                    onChange={(e) => setUniversityId(e.target.value)}
                                    className="input-glass"
                                    style={{ paddingLeft: '44px', appearance: 'none' }}
                                    required
                                >
                                    <option value="" disabled>Select your university</option>
                                    {universities.map(u => (
                                        <option key={u._id} value={u._id} style={{ background: 'var(--bg-primary)' }}>{u.name}</option>
                                    ))}
                                    {/* For hackathon ease, adding a fallback hardcoded valid object ID format */}
                                    <option value="60d0fe4f5311236168a109ca" style={{ background: 'var(--bg-primary)' }}>Hackathon University (Auto-seed DB required)</option>
                                </select>
                            </div>
                        </div>

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
                                    minLength={6}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password || !name || !universityId}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '8px', display: 'flex', justifyContent: 'center' }}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <button onClick={() => router.push('/login')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>
                            Sign in
                        </button>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
