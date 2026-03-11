'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import type { ChatSession, ChatMessage } from '@/lib/types';

export function useChat() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/chat/sessions');
            setSessions(data.sessions || []);
        } catch (err) {
            console.error('Failed to fetch chat sessions', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createSession = useCallback(async (subjectId: string): Promise<ChatSession | null> => {
        try {
            const { data } = await api.post('/chat/session', { subjectId });
            await fetchSessions();
            return data.session;
        } catch (err) {
            console.error('Failed to create session', err);
            return null;
        }
    }, [fetchSessions]);

    const fetchMessages = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/chat/session/${sessionId}/messages`);
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const sendMessage = useCallback(async (sessionId: string, question: string) => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticUserMessage: ChatMessage = {
            _id: tempId,
            session: sessionId,
            role: 'user',
            content: question,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticUserMessage]);

        try {
            setSending(true);
            const { data } = await api.post('/chat/message', { sessionId, question });

            // Replace optimistic message with real message and add assistant response
            setMessages((prev) => {
                const filtered = prev.filter(m => m._id !== tempId);
                return [...filtered, data.userMessage, data.assistantMessage];
            });
            return data;
        } catch (err) {
            console.error('Failed to send message', err);
            // Remove optimistic message on error
            setMessages((prev) => prev.filter(m => m._id !== tempId));
            return null;
        } finally {
            setSending(false);
        }
    }, []);

    return {
        sessions,
        messages,
        loading,
        sending,
        fetchSessions,
        createSession,
        fetchMessages,
        sendMessage,
    };
}
