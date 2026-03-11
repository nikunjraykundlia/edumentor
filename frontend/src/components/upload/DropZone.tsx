'use client';

import { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSizeMB?: number;
}

export default function DropZone({
    onFileSelect,
    accept = 'application/pdf, text/plain, .doc, .docx',
    maxSizeMB = 50,
}: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                if (file.size > maxSizeMB * 1024 * 1024) {
                    alert(`File too large. Maximum size is ${maxSizeMB}MB.`);
                    return;
                }
                onFileSelect(file);
            }
        },
        [onFileSelect, maxSizeMB]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > maxSizeMB * 1024 * 1024) {
                alert(`File too large. Maximum size is ${maxSizeMB}MB.`);
                return;
            }
            onFileSelect(file);
        }
    };

    return (
        <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
                width: '100%',
                minHeight: '200px',
                border: `2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                borderRadius: '24px',
                background: isDragging ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                padding: '40px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
            }}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input
                id="file-upload"
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
            <div
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(34,211,238,0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <UploadCloud size={32} color={isDragging ? 'var(--accent-primary)' : 'var(--accent-secondary)'} />
            </div>
            <div style={{ textAlign: 'center' }}>
                <h3
                    style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        marginBottom: '8px',
                        color: isDragging ? 'var(--accent-primary)' : 'var(--text-primary)',
                    }}
                >
                    {isDragging ? 'Drop file here' : 'Drag & drop your notes'}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Supports PDF, Word, and Text files up to {maxSizeMB}MB
                </p>
            </div>
        </div>
    );
}
