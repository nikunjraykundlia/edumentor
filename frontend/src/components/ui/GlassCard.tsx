'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    hover?: boolean;
    className?: string;
}

export default function GlassCard({ children, hover = false, className = '', ...props }: GlassCardProps) {
    return (
        <motion.div
            className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
