'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import DropZone from '@/components/upload/DropZone';
import UploadQueue, { type UploadItem } from '@/components/upload/UploadQueue';
import GlassCard from '@/components/ui/GlassCard';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import type { Subject } from '@/lib/types';

export default function UploadNotesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const { addToast } = useToast();

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);

    useEffect(() => {
        async function loadSubjects() {
            try {
                const { data } = await api.get('/subjects');
                const mySubjects = (data.subjects || []).filter(
                    (s: Subject) =>
                        s.teacher?._id === user?._id || (s.teacher as any) === user?._id
                );
                setSubjects(mySubjects);
                if (mySubjects.length > 0) {
                    setSelectedSubjectId(mySubjects[0]._id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadSubjects();
    }, [user]);

    const selectedSubject = subjects.find((s) => s._id === selectedSubjectId);

    const handleFileSelect = async (file: File) => {
        if (!selectedSubjectId) {
            addToast('error', 'Please select a subject first');
            return;
        }

        const id = Date.now().toString();
        const item: UploadItem = {
            id,
            file,
            title: file.name.replace(/\.[^/.]+$/, ''),
            status: 'uploading',
            progress: 0,
        };
        setUploadItems((prev) => [...prev, item]);

        const progressInterval = setInterval(() => {
            setUploadItems((prev) =>
                prev.map((i) => {
                    if (i.id === id && i.status === 'uploading' && i.progress < 90) {
                        return { ...i, progress: i.progress + 10 };
                    }
                    return i;
                })
            );
        }, 500);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('subjectId', selectedSubjectId);
            formData.append('title', item.title);

            const { data } = await api.post('/notes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            clearInterval(progressInterval);

            setUploadItems((prev) =>
                prev.map((i) =>
                    i.id === id ? { ...i, status: 'processing', progress: 100 } : i
                )
            );

            const noteId = data.note._id;
            const pollInterval = setInterval(async () => {
                try {
                    const { data: noteData } = await api.get(`/notes/${noteId}`);
                    if (noteData.note.pineconeStatus === 'indexed') {
                        clearInterval(pollInterval);
                        setUploadItems((prev) =>
                            prev.map((i) =>
                                i.id === id
                                    ? { ...i, status: 'indexed', progress: 100 }
                                    : i
                            )
                        );
                        addToast(
                            'success',
                            `"${item.title}" is now indexed and ready for chat!`
                        );
                    } else if (noteData.note.pineconeStatus === 'failed') {
                        clearInterval(pollInterval);
                        setUploadItems((prev) =>
                            prev.map((i) =>
                                i.id === id
                                    ? { ...i, status: 'failed', progress: 100 }
                                    : i
                            )
                        );
                        addToast('error', `Failed to index "${item.title}"`);
                    }
                } catch { }
            }, 3000);

            setTimeout(() => {
                clearInterval(pollInterval);
                setUploadItems((prev) =>
                    prev.map((i) => {
                        if (i.id === id && i.status === 'processing') {
                            return { ...i, status: 'indexed', progress: 100 };
                        }
                        return i;
                    })
                );
            }, 120000);
        } catch (err: any) {
            clearInterval(progressInterval);
            setUploadItems((prev) =>
                prev.map((i) =>
                    i.id === id ? { ...i, status: 'failed', progress: 100 } : i
                )
            );
            addToast('error', err.response?.data?.message || 'Upload failed');
        }
    };

    const handleTitleChange = (id: string, title: string) => {
        setUploadItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, title } : i))
        );
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        marginBottom: '4px',
                    }}
                >
                    Upload Notes
                </h1>
                <p
                    style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '32px',
                    }}
                >
                    Upload course materials to your subjects
                </p>
            </motion.div>

            {/* Subject Selector */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '28px' }}
            >
                <label
                    style={{
                        display: 'block',
                        fontSize: '13px',
                        fontWeight: 500,
                        marginBottom: '8px',
                        color: 'var(--text-secondary)',
                    }}
                >
                    Select Subject
                </label>
                {loading ? (
                    <div
                        className="skeleton-shimmer"
                        style={{ height: '48px', borderRadius: '12px' }}
                    />
                ) : subjects.length === 0 ? (
                    <GlassCard style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            No subjects found.{' '}
                            <button
                                onClick={() => router.push('/teacher/subjects')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--accent-primary)',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                }}
                            >
                                Create one first
                            </button>
                        </p>
                    </GlassCard>
                ) : (
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => setSelectedSubjectId(e.target.value)}
                        className="input-glass"
                        style={{
                            appearance: 'none',
                            cursor: 'pointer',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center',
                            paddingRight: '44px',
                        }}
                    >
                        {subjects.map((s) => (
                            <option
                                key={s._id}
                                value={s._id}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                }}
                            >
                                {s.name} ({s.code})
                            </option>
                        ))}
                    </select>
                )}
            </motion.div>

            {/* Drop zone */}
            {selectedSubjectId && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <DropZone onFileSelect={handleFileSelect} />
                </motion.div>
            )}

            <UploadQueue items={uploadItems} onTitleChange={handleTitleChange} />
        </div>
    );
}
