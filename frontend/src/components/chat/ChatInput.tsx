'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff } from 'lucide-react';
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
    const [isRecording, setIsRecording] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

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

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech Recognition is not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        recognitionRef.current = recognition;
        recognition.start();
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

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <button
                            type="button"
                            onClick={toggleRecording}
                            disabled={disabled}
                            style={{
                                background: isRecording ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: isRecording ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isRecording ? '#ef4444' : 'var(--text-muted)',
                                transition: 'all 0.3s ease',
                                flexShrink: 0,
                            }}
                            title={isRecording ? 'Stop recording' : 'Voice input'}
                        >
                            <div style={{ margin: '0 auto' }}>
                                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                            </div>
                        </button>

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
                            }}
                        >
                            {disabled ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} style={{ marginLeft: '2px' }} />}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
}
