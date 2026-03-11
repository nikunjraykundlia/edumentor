<<<<<<< HEAD
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
=======
"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BrainCircuit, FileText, CheckCircle, GraduationCap, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { GradientButton } from "@/components/shared/GradientButton";
import { AnimatedMeshBackground } from "@/components/shared/AnimatedMeshBackground";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { GridScan } from '@/components/GridScan';
import SplitText from '@/components/SplitText';
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Subject-Scoped Context",
    description:
      "Upload your PDFs and TXT files. The AI only answers based on the material in that specific subject, avoiding hallucinations."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Evidence-Backed Answers",
    description:
      "Every answer comes with confidence scores and exact citations pointing you to the page and snippet in your notes."
  },
  {
    icon: <BrainCircuit className="h-6 w-6" />,
    title: "Interactive Study Mode",
    description:
      "Auto-generate Multiple Choice and Short Answer questions from your study materials to test your knowledge."
  }
];

export default function LandingPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedMeshBackground />

      {/* GridScan — dark mode only */}
      {isDark && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, pointerEvents: 'none' }}
          className="[mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]
                      [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
        >
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#75c7bf"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.3}
            chromaticAberration={0.001}
            noiseIntensity={0.01}
          />
        </div>
      )}

      {!isDark && (
        <div
          style={{ height: '100vh', zIndex: 0, pointerEvents: 'none' }}
          className={cn(
            "absolute inset-0",
            "[background-size:80px_80px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_3px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_3px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
            "[mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]",
            "[-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
          )}
        />
      )

      }

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-8 pt-12 md:px-16 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading font-bold text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500">
            AskMyNotes
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-flex text-sm font-medium hover:text-indigo-500 transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <GradientButton className="h-10 px-4 rounded-xl text-sm md:text-base">
              Get Started
            </GradientButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mt-24 md:mt-32"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6 leading-tight"
          >
            Your Ultimate{" "}
            <SplitText
              text="Study Copilot"
              className="inline bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
              delay={40}
              duration={1}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
            />
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Upload your notes, ask questions, and test your knowledge. The AI limits its context strictly to your uploads.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <GradientButton className="h-14 px-8 text-lg rounded-2xl w-full sm:w-auto" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Try AskMyNotes Now
              </GradientButton>
            </Link>
          </motion.div>

          {/* Social Proof Placeholder */}
          <motion.div variants={itemVariants} className="mt-16 flex items-center justify-center gap-6 text-sm text-muted-foreground opacity-80">
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Evidence-Based</div>
            <div className="hidden sm:flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Subject-Scoped</div>
            <div className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-500" /> Interactive Study</div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 mt-32">
          <h2 className="text-3xl font-bold text-center">Key Features</h2>
          <HoverEffect items={features} />
        </div>
      </main>
    </div>
  );
}
>>>>>>> 40c3b1e1262813eee8f664573faff647d1422ef3
