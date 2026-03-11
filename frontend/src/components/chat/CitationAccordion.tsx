'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Citation } from '@/lib/types';

interface CitationAccordionProps {
    citation: Citation;
}

export default function CitationAccordion({ citation }: CitationAccordionProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!citation || !citation.evidence) return null;

    return (
        <div
            style={{
                marginTop: '12px',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="var(--accent-primary)" />
                    <span>Source Evidence</span>
                </div>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div
                            style={{
                                padding: '12px',
                                fontSize: '13px',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                                fontFamily: 'var(--font-mono)',
                                whiteSpace: 'pre-wrap',
                                background: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            {citation.evidence}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
