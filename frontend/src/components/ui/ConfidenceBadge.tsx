'use client';

import React from 'react';

interface ConfidenceBadgeProps {
    level: 'High' | 'Medium' | 'Low';
}

const BADGE_CONFIG = {
    High: {
        bg: 'rgba(16,185,129,0.15)',
        border: 'rgba(16,185,129,0.4)',
        text: '#10B981',
        glow: '0 0 12px rgba(16,185,129,0.3)',
    },
    Medium: {
        bg: 'rgba(245,158,11,0.15)',
        border: 'rgba(245,158,11,0.4)',
        text: '#F59E0B',
        glow: '0 0 12px rgba(245,158,11,0.3)',
    },
    Low: {
        bg: 'rgba(249,115,22,0.15)',
        border: 'rgba(249,115,22,0.4)',
        text: '#F97316',
        glow: '0 0 12px rgba(249,115,22,0.3)',
    },
};

export default function ConfidenceBadge({ level }: ConfidenceBadgeProps) {
    const config = BADGE_CONFIG[level] || BADGE_CONFIG.Medium;

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                background: config.bg,
                border: `1px solid ${config.border}`,
                color: config.text,
                boxShadow: config.glow,
            }}
        >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: config.text }} />
            {level}
        </span>
    );
}
