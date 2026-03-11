'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Sparkles, ChevronLeft } from 'lucide-react';
import SessionSidebar from '@/components/chat/SessionSidebar';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import api from '@/lib/api';
import type { Subject, ChatSession } from '@/lib/types';

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const subjectId = params.subjectId as string;

    const { sessions, messages, loading, sending, fetchSessions, createSession, fetchMessages, sendMessage } = useChat();
    const [subject, setSubject] = useState<Subject | null>(null);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load subject info & sessions
    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get(`/subjects/${subjectId}`);
                setSubject(data.subject);
            } catch (err) {
                console.error(err);
                router.push('/student/chat');
            }
            await fetchSessions();
        }
        load();
    }, [subjectId, fetchSessions, router]);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, sending]);

    const handleSelectSession = async (session: ChatSession) => {
        setActiveSession(session);
        await fetchMessages(session.sessionId);
    };

    const handleNewSession = async () => {
        const session = await createSession(subjectId);
        if (session) {
            setActiveSession(session);
            await fetchMessages(session.sessionId);
        }
    };

    const handleSend = async (question: string) => {
        if (!activeSession) {
            const session = await createSession(subjectId);
            if (session) {
                setActiveSession(session);
                await sendMessage(session.sessionId, question);
                await fetchSessions();
            }
        } else {
            await sendMessage(activeSession.sessionId, question);
            await fetchSessions();
        }
    };

    const subjectSessions = sessions.filter((s) => {
        const sid = typeof s.subject === 'object' ? s.subject._id : s.subject;
        return sid === subjectId;
    });

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
            {/* Session Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--glass-border)', background: 'rgba(5, 11, 24, 0.4)' }}>
                <SessionSidebar
                    sessions={subjectSessions}
                    activeSessionId={activeSession?.sessionId}
                    onSelect={handleSelectSession}
                />
                <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
                    <button
                        onClick={handleNewSession}
                        className="btn-primary"
                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '14px', borderRadius: '14px' }}
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>
            </div>

            {/* Chat area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
                {/* Header */}
                <div
                    className="glass-navbar"
                    style={{
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 10,
                        background: 'rgba(5, 11, 24, 0.7)',
                        backdropFilter: 'blur(12px)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => router.push('/student/chat')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: subject?.coverColor || 'var(--accent-primary)' }} />
                                {subject?.name || 'Chat'}
                            </h2>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{subject?.code}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--accent-secondary)',
                            background: 'rgba(34,211,238,0.08)',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid rgba(34,211,238,0.2)'
                        }}>
                            <Sparkles size={12} strokeWidth={2.5} /> AI Assistant
                        </span>
                    </div>
                </div>

                {/* Messages Container */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '40px 24px' }}>
                        {!activeSession && messages.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '32px', paddingTop: '80px' }}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="animate-float"
                                    style={{
                                        width: '88px', height: '88px', borderRadius: '28px',
                                        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.2))',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 30px rgba(99,102,241,0.1)'
                                    }}
                                >
                                    <Bot size={44} color="var(--accent-primary)" strokeWidth={1.5} />
                                </motion.div>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '12px', color: 'var(--text-primary)' }}>
                                        How can I help with {subject?.name || 'your notes'}?
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
                                        Ask questions about your lectures, summaries, or specific concepts. I'll search through your course materials to provide accurate answers.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg) => (
                                    <MessageBubble key={msg._id} message={msg} />
                                ))}
                                {sending && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}
                                    >
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Bot size={18} color="var(--accent-primary)" />
                                        </div>
                                        <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '18px', borderTopLeftRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                {[0, 1, 2].map((i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div style={{
                    background: 'var(--bg-primary)',
                    borderTop: '1px solid var(--glass-border)',
                    padding: '24px 0',
                    zIndex: 20
                }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                        <ChatInput onSend={handleSend} disabled={sending} subject={subject || undefined} />
                        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px' }}>
                            AI can make mistakes. Verify important information with your course materials.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
