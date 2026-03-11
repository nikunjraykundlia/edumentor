'use client';

import { MessageSquare, Clock } from 'lucide-react';
import type { ChatSession } from '@/lib/types';

interface SessionSidebarProps {
    sessions: ChatSession[];
    activeSessionId?: string;
    onSelect: (session: ChatSession) => void;
}

export default function SessionSidebar({ sessions, activeSessionId, onSelect }: SessionSidebarProps) {
    return (
        <div
            className="glass-sidebar"
            style={{
                width: '300px',
                height: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
            }}
        >
            <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--glass-border)' }}>
                <h3
                    style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-display)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <MessageSquare size={18} color="var(--accent-primary)" />
                    Chat History
                </h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sessions.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                        No chat history yet.
                    </p>
                ) : (
                    sessions.map((session) => {
                        const isActive = session.sessionId === activeSessionId;
                        const subject = typeof session.subject === 'object' ? session.subject : null;

                        return (
                            <button
                                key={session._id}
                                onClick={() => onSelect(session)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid',
                                    borderColor: isActive ? 'var(--accent-primary)' : 'transparent',
                                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            color: subject?.coverColor || 'var(--accent-secondary)',
                                            fontFamily: 'var(--font-mono)',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {subject ? subject.code : 'Subject'}
                                    </span>
                                    {session.lastMessageAt && (
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={10} />
                                            {new Date(session.lastMessageAt).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h4
                                    style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {session.title}
                                </h4>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
