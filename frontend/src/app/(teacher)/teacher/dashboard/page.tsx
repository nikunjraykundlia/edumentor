'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, CheckCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function TeacherDashboard() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState({ subjectCount: 0, notesCount: 0, indexedCount: 0, studentCount: 0 });
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get('/subjects');
                const mySubjects = (data.subjects || []).filter(
                    (s: any) => s.teacher?._id === user?._id || s.teacher === user?._id
                );
                setSubjects(mySubjects);

                let totalNotes = 0;
                let totalIndexed = 0;
                let totalStudents = 0;
                for (const s of mySubjects) {
                    totalNotes += s.notesCount || 0;
                    totalStudents += s.enrolledStudents?.length || 0;
                }

                // Fetch notes to count indexed
                for (const s of mySubjects) {
                    try {
                        const notesRes = await api.get(`/notes/subject/${s._id}`);
                        totalIndexed += (notesRes.data.notes || []).filter((n: any) => n.pineconeStatus === 'indexed').length;
                    } catch { }
                }

                setStats({ subjectCount: mySubjects.length, notesCount: totalNotes, indexedCount: totalIndexed, studentCount: totalStudents });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user]);

    const statCards = [
        { label: 'My Subjects', value: stats.subjectCount, icon: BookOpen, color: 'var(--accent-primary)', cls: 'stat-indigo' },
        { label: 'Notes Uploaded', value: stats.notesCount, icon: FileText, color: 'var(--accent-secondary)', cls: 'stat-cyan' },
        { label: 'Indexed Notes', value: stats.indexedCount, icon: CheckCircle, color: 'var(--success)', cls: 'stat-emerald' },
        { label: 'Total Students', value: stats.studentCount, icon: Users, color: 'var(--warning)', cls: 'stat-amber' },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    Welcome, Prof. {user?.name?.split(' ')[0]} 🎓
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    Your teaching overview
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
                            <p style={{ fontSize: '30px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                                {loading ? <span className="skeleton-shimmer" style={{ display: 'inline-block', width: '40px', height: '30px' }} /> : s.value}
                            </p>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</p>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Subject Overview Table */}
            <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Subject Overview</h2>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '60px', borderRadius: '12px' }} />)}
                </div>
            ) : subjects.length === 0 ? (
                <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                    <BookOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No subjects yet</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Create your first subject to start uploading notes.</p>
                </GlassCard>
            ) : (
                <GlassCard style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Subject</th>
                                <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Code</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Notes</th>
                                <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((s) => (
                                <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.coverColor }} />
                                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.code}</span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>{s.notesCount || 0}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>{s.enrolledStudents?.length || 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassCard>
            )}
        </div>
    );
}
