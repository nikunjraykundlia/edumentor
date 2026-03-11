'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, BookOpen } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NoteCard from '@/components/ui/NoteCard';
import api from '@/lib/api';
import type { Subject, Note } from '@/lib/types';

export default function StudentSubjectDetail() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.id as string;

    const [subject, setSubject] = useState<Subject | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [subRes, notesRes] = await Promise.all([
                    api.get(`/subjects/${subjectId}`),
                    api.get(`/notes/subject/${subjectId}`),
                ]);
                setSubject(subRes.data.subject);
                setNotes(notesRes.data.notes || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [subjectId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="skeleton-shimmer" style={{ height: '40px', width: '300px', borderRadius: '8px' }} />
                <div className="skeleton-shimmer" style={{ height: '120px', borderRadius: '16px' }} />
                {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '70px', borderRadius: '12px' }} />)}
            </div>
        );
    }

    if (!subject) {
        return <p style={{ color: 'var(--text-muted)' }}>Subject not found.</p>;
    }

    return (
        <div>
            {/* Back */}
            <button
                onClick={() => router.back()}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}
            >
                <ArrowLeft size={16} /> Back to Subjects
            </button>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard style={{ padding: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: subject.coverColor }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: subject.coverColor, background: `${subject.coverColor}20`, marginBottom: '12px' }}>
                                {subject.code}
                            </span>
                            <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '8px' }}>{subject.name}</h1>
                            {subject.description && <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>{subject.description}</p>}
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
                                Prof. {subject.teacher?.name} · {subject.enrolledStudents?.length || 0} students · {notes.length} notes
                            </p>
                        </div>

                        <button
                            onClick={() => router.push(`/student/chat/${subject._id}`)}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '15px' }}
                        >
                            <MessageSquare size={18} /> Chat with Notes
                        </button>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Notes */}
            <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} /> Course Notes
            </h2>

            {notes.length === 0 ? (
                <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No notes uploaded yet.</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Check back when your teacher adds materials.</p>
                </GlassCard>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                </div>
            )}
        </div>
    );
}
