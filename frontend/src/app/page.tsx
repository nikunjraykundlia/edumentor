'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, Bot, Sparkles, ShieldCheck, GraduationCap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* ── Hero Section ── */}
      <section
        style={{
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          className="animate-float"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '100px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Sparkles size={16} color="var(--accent-secondary)" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>The Future of University Learning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Your University's AI <br />
          <span className="gradient-text">Study Assistant</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: '18px',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          Teachers upload course notes. Students chat with them instantly.
          Powered by edge AI and vector embeddings for high-accuracy answers with citations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={() => router.push('/register')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 32px', fontSize: '16px' }}
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button
            onClick={() => router.push('/login')}
            className="btn-secondary"
            style={{ padding: '14px 32px', fontSize: '16px' }}
          >
            Sign In
          </button>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
            Built for Modern Education
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            A complete suite of tools to bridge the gap between teaching and autonomous learning.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <GlassCard hover style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Bot size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>RAG Chat</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Chat exclusively with your enrolled course materials. High-confidence answers extracted directly from teacher-uploaded PDFs.</p>
          </GlassCard>

          <GlassCard hover style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34,211,238,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <BookOpen size={24} color="var(--accent-secondary)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Smart Uploads</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Teachers drop files and the system automatically segments, embeds, and indexes them via Pinecone vector databases.</p>
          </GlassCard>

          <GlassCard hover style={{ padding: '32px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <ShieldCheck size={24} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Cited Claims</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Every AI answer contains a confidence score and a citation pointing to the exact chunk of text in the source subject material.</p>
          </GlassCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--glass-border)',
          background: 'rgba(5,11,24,0.5)',
          padding: '48px 24px',
          marginTop: 'auto',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <GraduationCap size={24} color="var(--accent-primary)" />
          <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Edumentor</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Edumentor Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
