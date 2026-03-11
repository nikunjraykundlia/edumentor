'use client';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Note } from '@/lib/types';

interface NoteCardProps {
    note: Note;
    onDelete?: () => void;
    showDelete?: boolean;
}

const STATUS_CONFIG = {
    pending: { icon: Clock, color: '#F59E0B', label: 'Processing' },
    indexed: { icon: CheckCircle, color: '#10B981', label: 'Indexed' },
    failed: { icon: AlertCircle, color: '#EF4444', label: 'Failed' },
};

export default function NoteCard({ note, onDelete, showDelete }: NoteCardProps) {
    const status = STATUS_CONFIG[note.pineconeStatus];
    const StatusIcon = status.icon;

    return (
        <div
            className="glass-card"
            style={{
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.2s ease',
            }}
        >
            {/* File icon */}
            <div
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(99,102,241,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <FileText size={22} color="var(--accent-primary)" />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                    style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {note.title}
                </h4>
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                    }}
                >
                    {note.fileName} · {note.fileSizeKb} KB · {new Date(note.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* Status badge */}
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: status.color,
                    background: `${status.color}15`,
                    border: `1px solid ${status.color}30`,
                    flexShrink: 0,
                }}
            >
                <StatusIcon size={12} />
                {status.label}
            </span>

            {/* Delete */}
            {showDelete && onDelete && (
                <button
                    onClick={onDelete}
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                    }}
                >
                    Delete
                </button>
            )}
        </div>
    );
}
