'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, FileText } from 'lucide-react';

export interface UploadItem {
    id: string;
    file: File;
    title: string;
    status: 'uploading' | 'processing' | 'indexed' | 'failed';
    progress: number;
}

interface UploadQueueProps {
    items: UploadItem[];
    onTitleChange: (id: string, title: string) => void;
}

export default function UploadQueue({ items, onTitleChange }: UploadQueueProps) {
    if (items.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                Upload Queue
            </h3>
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(99,102,241,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <FileText size={20} color="var(--accent-primary)" />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => onTitleChange(item.id, e.target.value)}
                                placeholder="Name this note..."
                                disabled={item.status !== 'uploading' && item.progress > 0}
                                className="input-glass"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--glass-border)',
                                    borderRadius: 0,
                                    padding: '4px 0',
                                    color: 'var(--text-primary)',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    marginBottom: '4px',
                                }}
                            />
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {item.file.name} · {Math.round(item.file.size / 1024)} KB
                            </p>
                        </div>

                        {/* Status Icon */}
                        <div style={{ flexShrink: 0 }}>
                            {item.status === 'uploading' && <Loader2 size={24} className="animate-spin text-indigo-400" />}
                            {item.status === 'processing' && (
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid var(--accent-secondary)',
                                        borderTopColor: 'transparent', animation: 'spin 1.5s linear infinite'
                                    }} />
                                    <Loader2 size={24} color="var(--accent-secondary)" />
                                </div>
                            )}
                            {item.status === 'indexed' && <CheckCircle size={24} color="var(--success)" />}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {(item.status === 'uploading' || item.progress > 0) && item.status !== 'indexed' && (
                        <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                style={{
                                    height: '100%',
                                    background: item.status === 'processing'
                                        ? 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                                        : 'var(--accent-primary)',
                                    borderRadius: '2px',
                                }}
                            />
                        </div>
                    )}

                    {/* Helper Text */}
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>
                            {item.status === 'uploading' && 'Uploading to secure storage...'}
                            {item.status === 'processing' && 'AI is reading and indexing your notes...'}
                            {item.status === 'indexed' && 'Ready for students to chat!'}
                        </span>
                        {item.status !== 'indexed' && `${Math.round(item.progress)}%`}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
