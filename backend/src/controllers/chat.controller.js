const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const Subject = require('../models/Subject');
const { generateSessionId } = require('../utils/sessionIdGenerator');
const { triggerChatWebhook } = require('../services/n8n.service');

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

            console.log('n8n raw response:', JSON.stringify(n8nResponse, null, 2));

            // n8n returns structured JSON, often wrapped in an array by axios if n8n returns [ { ... } ]
            let actualResponse = n8nResponse;
            if (Array.isArray(n8nResponse) && n8nResponse.length > 0) {
                // Take the first element. If it has 'output', use that.
                // Otherwise use the whole first element.
                actualResponse = n8nResponse[0].output !== undefined ? n8nResponse[0].output : n8nResponse[0];
            }

            // structuredResponse will be sent to frontend for special rendering
            structuredResponse = typeof actualResponse === 'object' ? actualResponse : null;

            // check if actualResponse has the expected structure
            if (actualResponse && actualResponse.answer && Array.isArray(actualResponse.answer)) {
                structuredResponse = {
                    answer: actualResponse.answer,
                    metadata: actualResponse.metadata || {},
                };
                assistantContent = actualResponse.answer
                    .map((a) => a.answerfromnotes)
                    .join('\n');
            } else if (actualResponse && actualResponse.mcqs) {
                structuredResponse = {
                    mcqs: actualResponse.mcqs,
                    metadata: actualResponse.metadata || {},
                };
                assistantContent = 'I have generated the MCQs based on your notes. You can see them below.';
            } else if (actualResponse && actualResponse.document) {
                structuredResponse = {
                    document: actualResponse.document,
                    metadata: actualResponse.metadata || {},
                };
                assistantContent = 'I have generated the document for you. You can find it below.';
            } else if (typeof actualResponse === 'string' && actualResponse.trim() !== '') {
                assistantContent = actualResponse;
            } else if (actualResponse && typeof actualResponse === 'object') {
                // Try to find a message/text field in the object
                assistantContent = actualResponse.text ||
                    actualResponse.message ||
                    actualResponse.response ||
                    actualResponse.output ||
                    (Object.keys(actualResponse).length > 0 ? JSON.stringify(actualResponse) : '');
            } else {
                assistantContent = '';
            }

            // Ensure assistantContent is not empty
            if (!assistantContent || assistantContent.trim() === '') {
                assistantContent = 'I processed your request but received an empty response. Please try rephrasing your question.';
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
