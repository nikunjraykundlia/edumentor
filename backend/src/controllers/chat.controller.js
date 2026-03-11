const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Subject = require('../models/Subject');
const { generateSessionId } = require('../utils/sessionIdGenerator');
const { triggerChatWebhook } = require('../services/n8n.service');
const axios = require('axios');

// ── Create or Get Chat Session ──
exports.createOrGetSession = async (req, res, next) => {
    try {
        const { subjectId } = req.body;

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: 'subjectId is required.',
                code: 'MISSING_FIELDS',
            });
        }

        // Create a new session
        const sessionId = generateSessionId(req.user.userId, subjectId);

        const session = await ChatSession.create({
            student: req.user.userId,
            subject: subjectId,
            sessionId,
        });

        await session.populate('subject', 'name code');

        res.status(201).json({ success: true, session });
    } catch (error) {
        next(error);
    }
};

// ── List All Chat Sessions for Student ──
exports.listSessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.find({ student: req.user.userId })
            .populate('subject', 'name code coverColor')
            .sort({ lastMessageAt: -1, createdAt: -1 });

        res.json({ success: true, sessions });
    } catch (error) {
        next(error);
    }
};

// ── Get Chat Messages for a Session ──
exports.getSessionMessages = async (req, res, next) => {
    try {
        const session = await ChatSession.findOne({
            sessionId: req.params.sessionId,
            student: req.user.userId,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Chat session not found.',
                code: 'NOT_FOUND',
            });
        }

        const messages = await ChatMessage.find({ session: session._id })
            .sort({ createdAt: 1 });

        res.json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

// ── Send Message (Student) ──
exports.sendMessage = async (req, res, next) => {
    try {
        const { sessionId, question } = req.body;

        if (!sessionId || !question) {
            return res.status(400).json({
                success: false,
                message: 'sessionId and question are required.',
                code: 'MISSING_FIELDS',
            });
        }

        const session = await ChatSession.findOne({
            sessionId,
            student: req.user.userId,
        }).populate('subject', 'name code');

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Chat session not found.',
                code: 'NOT_FOUND',
            });
        }

        // Save user message
        const userMessage = await ChatMessage.create({
            session: session._id,
            role: 'user',
            content: question,
        });

        // Update session title on first message
        if (session.messageCount === 0) {
            session.title = question.substring(0, 80);
        }

        // Call n8n chat webhook
        let assistantContent = '';
        let structuredResponse = null;

        try {
            const n8nResponse = await triggerChatWebhook({
                chatInput: question,
                subject: session.subject.name,
                sessionId: session.sessionId,
            });

            console.log('n8n raw response:', JSON.stringify(n8nResponse));

            // n8n returns structured JSON, often wrapped in an array by axios
            let actualResponse = n8nResponse;
            if (Array.isArray(n8nResponse) && n8nResponse.length > 0) {
                actualResponse = n8nResponse[0].json || n8nResponse[0].output || n8nResponse[0].data || n8nResponse[0];
            } else if (n8nResponse && typeof n8nResponse === 'object') {
                actualResponse = n8nResponse.json || n8nResponse.output || n8nResponse.data || n8nResponse;
            }

            // Standardize structured response
            if (actualResponse && Array.isArray(actualResponse.answer)) {
                // n8n format: { answer: [ { answerfromnotes: "...", ... } ] }
                structuredResponse = {
                    answer: actualResponse.answer,
                    metadata: actualResponse.metadata || {},
                };
                assistantContent = actualResponse.answer
                    .map((a) => a.answerfromnotes || a.content || a.text || '')
                    .filter(Boolean)
                    .join('\n');
            } else if (actualResponse && typeof actualResponse === 'object' && actualResponse.output) {
                // Possible format: { output: "..." }
                assistantContent = actualResponse.output;
                structuredResponse = actualResponse;
            } else if (actualResponse && typeof actualResponse === 'object' && actualResponse.content) {
                // Possible format: { content: "..." }
                assistantContent = actualResponse.content;
                structuredResponse = actualResponse;
            } else if (typeof actualResponse === 'string') {
                assistantContent = actualResponse;
            } else {
                // Fallback: If it's an object but we don't recognize the fields, use the whole thing
                assistantContent = typeof actualResponse === 'object' ? JSON.stringify(actualResponse) : String(actualResponse);
                structuredResponse = actualResponse;
            }
        } catch (err) {
            console.error('n8n chat webhook error:', err.message);
            assistantContent = 'Sorry, I could not process your question right now. Please try again.';
        }

        // Save assistant message
        const assistantMessage = await ChatMessage.create({
            session: session._id,
            role: 'assistant',
            content: assistantContent,
            structuredResponse,
        });

        // Update session
        session.messageCount += 2;
        session.lastMessageAt = new Date();
        await session.save();

        res.json({
            success: true,
            userMessage,
            assistantMessage,
        });
    } catch (error) {
        next(error);
    }
};

// ── Proxy Chat (Directly to n8n) ──
exports.proxyChat = async (req, res, next) => {
    try {
        const { chatInput, subject, sessionId } = req.body;

        if (!chatInput) {
            return res.status(400).json({
                success: false,
                message: 'chatInput is required.',
            });
        }

        const n8nResponse = await triggerChatWebhook({
            chatInput,
            subject: subject || 'General',
            sessionId: sessionId || 'anonymous',
        });

        res.json({ success: true, data: n8nResponse });
    } catch (error) {
        console.error('Proxy chat error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to communicate with AI service.',
        });
    }
};

// ── Text to Speech (ElevenLabs Proxy) ──
exports.textToSpeech = async (req, res, next) => {
    try {
        const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body;
        console.log(`[TTS] Request received for text length: ${text?.length}, voiceId: ${voiceId}`);

        if (!text) {
            return res.status(400).json({ success: false, message: 'Text is required.' });
        }

        const response = await axios({
            method: 'post',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
            data: {
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.0,
                    use_speaker_boost: true,
                },
            },
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY,
                'Content-Type': 'application/json',
                accept: 'audio/mpeg',
            },
            responseType: 'stream',
        });

        res.set({
            'Content-Type': 'audio/mpeg',
            'Transfer-Encoding': 'chunked',
        });

        response.data.pipe(res);
    } catch (error) {
        // If the error response is a stream, we need to handle it differently
        if (error.response && error.response.data && typeof error.response.data.on === 'function') {
            let errorData = '';
            error.response.data.on('data', chunk => { errorData += chunk; });
            error.response.data.on('end', () => {
                console.error('TTS API error details:', errorData);
            });
        } else {
            console.error('TTS Error:', error.message);
        }

        res.status(500).json({
            success: false,
            message: 'Failed to generate speech. Please check API quota or model availability.',
            error: error.message,
        });
    }
};
