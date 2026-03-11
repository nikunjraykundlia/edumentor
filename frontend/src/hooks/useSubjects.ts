'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Subject } from '@/lib/types';

export function useSubjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubjects = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/subjects');
            setSubjects(data.subjects || []);
        } catch (err) {
            console.error('Failed to fetch subjects', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const enrollInSubject = async (subjectId: string) => {
        await api.post(`/subjects/${subjectId}/enroll`);
        await fetchSubjects();
    };

    return { subjects, loading, refetch: fetchSubjects, enrollInSubject };
}
