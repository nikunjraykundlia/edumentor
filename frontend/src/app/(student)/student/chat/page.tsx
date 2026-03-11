'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, BookOpen, Search, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import type { Subject } from '@/lib/types';

export default function StudentChatLanding() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get('/subjects');
                // Filter subjects the student is enrolled in
                const enrolled = (data.subjects || []).filter((s: Subject) =>
                    s.enrolledStudents?.includes(user?._id || '')
                );
                setSubjects(enrolled);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user]);

    const filtered = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                    Chat with your Notes 📚
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>
                    Select a subject to start a new AI-powered conversation based on your course materials.
                </p>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ position: 'relative', maxWidth: '500px', marginBottom: '32px' }}
            >
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-glass"
                    style={{ paddingLeft: '44px', paddingRight: '16px', height: '52px', fontSize: '16px' }}
                    placeholder="Search your subjects..."
                />
            </motion.div>

            {/* Subject Selection Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '140px', borderRadius: '20px' }} />)}
                </div>
            ) : subjects.length === 0 ? (
                <GlassCard style={{ padding: '60px', textAlign: 'center' }}>
                    <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No enrolled subjects found</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                        Enroll in subjects first to start chatting with their notes.
                    </p>
                    <button onClick={() => router.push('/student/subjects')} className="btn-primary">
                        Browse Subjects
                    </button>
                </GlassCard>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No matching subjects found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {filtered.map((subject, i) => (
                        <motion.div
                            key={subject._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + i * 0.05 }}
                        >
                            <GlassCard
                                hover
                                onClick={() => router.push(`/student/chat/${subject._id}`)}
                                style={{ padding: '24px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: subject.coverColor }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                            color: subject.coverColor,
                                            background: `${subject.coverColor}15`,
                                            marginBottom: '8px'
                                        }}>
                                            {subject.code}
                                        </span>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                            {subject.name}
                                        </h3>
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.04)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-muted)'
                                    }}>
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                    <MessageSquare size={14} />
                                    <span>{subject.notesCount || 0} notes indexed</span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
