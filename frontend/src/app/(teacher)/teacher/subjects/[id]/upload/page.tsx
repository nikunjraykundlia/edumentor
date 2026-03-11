'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import DropZone from '@/components/upload/DropZone';
import UploadQueue, { type UploadItem } from '@/components/upload/UploadQueue';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Subject } from '@/lib/types';

export default function UploadNotesPage() {
    const params = useParams();
    const router = useRouter();
    const { addToast } = useToast();
    const subjectId = params.id as string;

    const [subject, setSubject] = useState<Subject | null>(null);
    const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get(`/subjects/${subjectId}`);
                setSubject(data.subject);
            } catch { }
        }
        load();
    }, [subjectId]);

    const handleFileSelect = useCallback(async (file: File) => {
        const id = Date.now().toString();
        const item: UploadItem = {
            id,
            file,
            title: file.name.replace(/\.[^/.]+$/, ''),
            status: 'uploading',
            progress: 0,
        };
        setUploadItems((prev) => [...prev, item]);

        // Simulated progress while uploading
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
            formData.append('subjectId', subjectId);
            formData.append('title', item.title);

            const { data } = await api.post('/notes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            clearInterval(progressInterval);

            // Move to "processing" state
            setUploadItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, status: 'processing', progress: 100 } : i))
            );

            // Poll for indexing status
            const noteId = data.note._id;
            const pollInterval = setInterval(async () => {
                try {
                    const { data: noteData } = await api.get(`/notes/${noteId}`);
                    if (noteData.note.pineconeStatus === 'indexed') {
                        clearInterval(pollInterval);
                        setUploadItems((prev) =>
                            prev.map((i) => (i.id === id ? { ...i, status: 'indexed', progress: 100 } : i))
                        );
                        addToast('success', `"${item.title}" is now indexed and ready for chat!`);
                    } else if (noteData.note.pineconeStatus === 'failed') {
                        clearInterval(pollInterval);
                        setUploadItems((prev) =>
                            prev.map((i) => (i.id === id ? { ...i, status: 'failed', progress: 100 } : i))
                        );
                        addToast('error', `Failed to index "${item.title}"`);
                    }
                } catch { }
            }, 3000);

            // Timeout after 2 minutes
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
                prev.map((i) => (i.id === id ? { ...i, status: 'failed', progress: 100 } : i))
            );
            addToast('error', err.response?.data?.message || 'Upload failed');
        }
    }, [subjectId, addToast]);

    const handleTitleChange = (id: string, title: string) => {
        setUploadItems((prev) => prev.map((i) => (i.id === id ? { ...i, title } : i)));
    };

    return (
        <div>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
                <ArrowLeft size={16} /> Back to Subject
            </button>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
                    Upload Notes
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    {subject ? `Upload materials for ${subject.name} (${subject.code})` : 'Upload course materials'}
                </p>
            </motion.div>

            <DropZone onFileSelect={handleFileSelect} />

            <UploadQueue items={uploadItems} onTitleChange={handleTitleChange} />
        </div>
    );
}
