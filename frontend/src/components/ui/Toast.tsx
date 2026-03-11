'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface ToastContextType {
    addToast: (type: Toast['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be inside ToastProvider');
    return ctx;
}

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
};

const COLORS = {
    success: '#10B981',
    error: '#EF4444',
    info: '#6366F1',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: Toast['type'], message: string) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const Icon = ICONS[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                                className="glass-card"
                                style={{
                                    padding: '14px 18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    minWidth: '300px',
                                    borderLeft: `3px solid ${COLORS[toast.type]}`,
                                }}
                            >
                                <Icon size={18} color={COLORS[toast.type]} />
                                <span style={{ flex: 1, fontSize: '14px', color: 'var(--text-primary)' }}>
                                    {toast.message}
                                </span>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        padding: '2px',
                                        display: 'flex',
                                    }}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
