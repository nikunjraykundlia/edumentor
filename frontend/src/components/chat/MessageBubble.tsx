'use client';

import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ChatMessage, StructuredAnswer } from '@/lib/types';
import ConfidenceBadge from '../ui/ConfidenceBadge';
import CitationAccordion from './CitationAccordion';

interface MessageBubbleProps {
    message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
                display: 'flex',
                gap: '16px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                marginBottom: '24px',
                width: '100%',
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isUser
                        ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                        : 'rgba(99,102,241,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {isUser ? <User size={18} color="white" /> : <Bot size={18} color="var(--accent-primary)" />}
            </div>

            {/* Bubble Content */}
            <div
                style={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
            >
                {isUser ? (
                    <div
                        style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            padding: '14px 18px',
                            borderRadius: '16px',
                            borderTopRightRadius: '4px',
                            fontSize: '15px',
                            lineHeight: 1.5,
                            boxShadow: '0 4px 20px rgba(99,102,241,0.2)',
                        }}
                    >
                        {message.content}
                    </div>
                ) : (
                    <div
                        className="glass-card"
                        style={{
                            padding: '16px 20px',
                            borderRadius: '16px',
                            borderTopLeftRadius: '4px',
                            fontSize: '15px',
                            lineHeight: 1.6,
                            color: 'var(--text-primary)',
                            width: '100%',
                        }}
                    >
                        {message.structuredResponse?.answer && Array.isArray(message.structuredResponse.answer) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {message.structuredResponse.answer.map((ans: StructuredAnswer, idx: number) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ans.answerfromnotes}</p>
                                            <ConfidenceBadge level={ans.confidence} />
                                        </div>
                                        {ans.citation && <CitationAccordion citation={ans.citation} />}
                                    </div>
                                ))}
                            </div>
                        ) : message.structuredResponse?.mcqs && Array.isArray(message.structuredResponse.mcqs) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {message.structuredResponse.mcqs.map((mcq, idx) => (
                                    <div key={idx} className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '16px' }}>{idx + 1}. {mcq.question}</p>
                                        <div style={{ display: 'grid', gap: '10px' }}>
                                            {mcq.options.map((opt, oIdx) => (
                                                <div
                                                    key={oIdx}
                                                    style={{
                                                        padding: '12px 16px',
                                                        borderRadius: '10px',
                                                        background: 'rgba(255,255,255,0.03)',
                                                        border: '1px solid rgba(255,255,255,0.05)',
                                                        fontSize: '14px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                        {String.fromCharCode(65 + oIdx)}
                                                    </span>
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : message.structuredResponse?.document ? (
                            <div className="glass-card" style={{ padding: '24px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{message.structuredResponse.document.title}</h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>{message.structuredResponse.document.type}</p>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.6, maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    {message.structuredResponse.document.content}
                                </div>
                                {message.structuredResponse.document.url && (
                                    <a
                                        href={message.structuredResponse.document.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}
                                    >
                                        View Full Document
                                    </a>
                                )}
                            </div>
                        ) : message.content ? (
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                        ) : (
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                        style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <span
                    style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        marginTop: '6px',
                        padding: '0 4px',
                        opacity: message._id.toString().startsWith('temp-') ? 0.5 : 1
                    }}
                >
                    {message.createdAt && !message._id.toString().startsWith('temp-')
                        ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Sending...'}
                </span>
            </div>
        </motion.div>
    );
}
