'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Users, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NoteCard from '@/components/ui/NoteCard';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Subject, Note } from '@/lib/types';

export default function TeacherSubjectDetail() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const subjectId = params.id as string;

    const [subject, setSubject] = useState<Subject | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
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
    };

    useEffect(() => { load(); }, [subjectId]);

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm('Delete this note? This cannot be undone.')) return;
        try {
            await api.delete(`/notes/${noteId}`);
            addToast('success', 'Note deleted');
            await load();
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Failed to delete');
        }
    };

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
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
                <ArrowLeft size={16} /> Back to My Subjects
            </button>

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
                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Users size={14} /> {subject.enrolledStudents?.length || 0} students enrolled
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/teacher/subjects/${subject._id}/upload`)}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', fontSize: '15px' }}
                        >
                            <Upload size={18} /> Upload Notes
                        </button>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Notes */}
            <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
                Uploaded Notes ({notes.length})
            </h2>

            {notes.length === 0 ? (
                <GlassCard style={{ padding: '40px', textAlign: 'center' }}>
                    <Upload size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>No notes uploaded yet</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Upload your first course material to get started.</p>
                </GlassCard>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            showDelete
                            onDelete={() => handleDeleteNote(note._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
