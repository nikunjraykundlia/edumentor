'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 100,
                        }}
                    />
                    {/* Modal centering wrapper */}
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 101,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="glass-modal"
                            style={{
                                width: '90%',
                                maxWidth: '520px',
                                maxHeight: '80vh',
                                overflow: 'auto',
                                padding: '32px',
                                pointerEvents: 'auto',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '24px',
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: '20px',
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-display)',
                                    }}
                                >
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '6px',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                        display: 'flex',
                                    }}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
