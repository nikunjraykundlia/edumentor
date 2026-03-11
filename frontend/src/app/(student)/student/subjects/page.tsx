'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import SubjectCard from '@/components/ui/SubjectCard';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';

export default function StudentSubjects() {
    const { subjects, loading, enrollInSubject } = useSubjects();
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filtered = subjects.filter(
        (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleEnroll = async (subjectId: string) => {
        try {
            await enrollInSubject(subjectId);
            addToast('success', 'Enrolled successfully!');
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Failed to enroll');
        }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    Browse Subjects
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Explore all subjects available at your university
                </p>
            </motion.div>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '400px', marginBottom: '32px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-glass"
                    style={{ paddingLeft: '44px' }}
                    placeholder="Search by name or code..."
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '200px', borderRadius: '16px' }} />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No subjects found</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Check back when your teachers add subjects.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {filtered.map((subject) => {
                        const isEnrolled = subject.enrolledStudents?.includes(user?._id || '');
                        return (
                            <SubjectCard
                                key={subject._id}
                                subject={subject}
                                onClick={() => router.push(`/student/subjects/${subject._id}`)}
                                showEnroll={!isEnrolled}
                                onEnroll={() => handleEnroll(subject._id)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
