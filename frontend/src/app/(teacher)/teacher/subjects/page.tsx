'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import SubjectCard from '@/components/ui/SubjectCard';
import Modal from '@/components/ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import api from '@/lib/api';
import type { Subject } from '@/lib/types';

export default function TeacherSubjects() {
    const { user } = useAuthStore();
    const { addToast } = useToast();
    const router = useRouter();

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', code: '', description: '' });
    const [creating, setCreating] = useState(false);

    const fetchMySubjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/subjects');
            const mine = (data.subjects || []).filter(
                (s: Subject) => s.teacher?._id === user?._id || (s.teacher as any) === user?._id
            );
            setSubjects(mine);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMySubjects(); }, [user]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.code) return;
        try {
            setCreating(true);
            await api.post('/subjects', form);
            addToast('success', 'Subject created!');
            setModalOpen(false);
            setForm({ name: '', code: '', description: '' });
            await fetchMySubjects();
        } catch (err: any) {
            addToast('error', err.response?.data?.message || 'Failed to create');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>My Subjects</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your courses and upload materials</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> Create Subject
                </button>
            </motion.div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-shimmer" style={{ height: '200px', borderRadius: '16px' }} />)}
                </div>
            ) : subjects.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>No subjects yet</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Click "Create Subject" to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {subjects.map((subject) => (
                        <SubjectCard
                            key={subject._id}
                            subject={subject}
                            onClick={() => router.push(`/teacher/subjects/${subject._id}`)}
                        />
                    ))}
                </div>
            )}

            {/* Create Subject Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Subject">
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Subject Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-glass" placeholder="e.g. Data Structures" required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Subject Code</label>
                        <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-glass" placeholder="e.g. CS301" required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-secondary)' }}>Description (optional)</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-glass" placeholder="Brief course description..." rows={3} style={{ resize: 'vertical' }} />
                    </div>
                    <button type="submit" disabled={creating || !form.name || !form.code} className="btn-primary" style={{ width: '100%' }}>
                        {creating ? 'Creating...' : 'Create Subject'}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
