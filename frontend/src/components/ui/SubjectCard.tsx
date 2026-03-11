'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users } from 'lucide-react';
import type { Subject } from '@/lib/types';

interface SubjectCardProps {
    subject: Subject;
    onClick?: () => void;
    showEnroll?: boolean;
    onEnroll?: () => void;
}

export default function SubjectCard({ subject, onClick, showEnroll, onEnroll }: SubjectCardProps) {
    return (
        <motion.div
            className="glass-card glass-card-hover"
            style={{
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={onClick}
            whileHover={{ scale: 1.015, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Color accent bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: subject.coverColor,
                }}
            />

            {/* Subject code badge */}
            <span
                style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: subject.coverColor,
                    background: `${subject.coverColor}20`,
                    marginBottom: '12px',
                }}
            >
                {subject.code}
            </span>

            <h3
                style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                }}
            >
                {subject.name}
            </h3>

            {subject.description && (
                <p
                    style={{
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        marginBottom: '16px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {subject.description}
                </p>
            )}

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '16px',
                }}
            >
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <BookOpen size={14} />
                        {subject.notesCount} notes
                    </span>
                    <span
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                        }}
                    >
                        <Users size={14} />
                        {subject.enrolledStudents?.length || 0} students
                    </span>
                </div>

                {showEnroll && (
                    <button
                        className="btn-primary"
                        style={{ padding: '6px 16px', fontSize: '13px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEnroll?.();
                        }}
                    >
                        Enroll
                    </button>
                )}
            </div>

            {/* Teacher name */}
            {subject.teacher?.name && (
                <p
                    style={{
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--glass-border)',
                    }}
                >
                    Prof. {subject.teacher.name}
                </p>
            )}
        </motion.div>
    );
}
