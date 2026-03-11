'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Subject } from '@/lib/types';

interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    disabled?: boolean;
    subject?: Subject;
}

export default function ChatInput({ onSend, disabled, subject }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || disabled) return;

        const message = input.trim();
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        await onSend(message);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                padding: '24px',
                background: 'linear-gradient(to top, var(--bg-primary) 80%, transparent)',
            }}
        >
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {/* Context Pill */}
                {subject && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute',
                            top: '-32px',
                            left: '16px',
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: '20px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            color: 'var(--accent-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-secondary)' }} />
                        Searching in {subject.code} notes
                    </motion.div>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    animate={{
                        borderColor: isFocused ? 'var(--accent-primary)' : 'var(--glass-border)',
                        boxShadow: isFocused ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
                    }}
                    className="glass-card"
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '24px',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask a question about your notes..."
                        disabled={disabled}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '15px',
                            fontFamily: 'var(--font-body)',
                            resize: 'none',
                            padding: '8px 0',
                            maxHeight: '120px',
                            outline: 'none',
                            lineHeight: 1.5,
                        }}
                        rows={1}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || disabled}
                        style={{
                            background: input.trim() && !disabled
                                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                                : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: input.trim() && !disabled ? 'pointer' : 'not-allowed',
                            color: input.trim() && !disabled ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.3s ease',
                            flexShrink: 0,
                            marginBottom: '4px',
                        }}
                    >
                        {disabled ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} style={{ marginLeft: '2px' }} />}
                    </button>
                </motion.form>
            </div>
        </div>
    );
}
