const mongoose = require('mongoose');

// ── Sub-schemas (no _id on subdocs) ──
const citationSchema = new mongoose.Schema(
    {
        evidence: { type: String, default: '' },
    },
    { _id: false }
);

const answerItemSchema = new mongoose.Schema(
    {
        answerfromnotes: { type: String, default: '' },
        confidence: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Low',
        },
        citation: { type: citationSchema, default: () => ({}) },
    },
    { _id: false }
);

const structuredResponseSchema = new mongoose.Schema(
    {
        answer: { type: [answerItemSchema], default: [] },
        metadata: {
            notesChunksUsed: { type: String, default: '' },
            generatedAt: { type: String, default: '' },
        },
    },
    { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChatSession',
            required: [true, 'Session is required'],
        },
        role: {
            type: String,
            enum: ['user', 'assistant'],
            required: [true, 'Role is required'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
        },
        structuredResponse: {
            type: structuredResponseSchema,
            default: null,
        },
    },
    { timestamps: true }
);

// ── Indexes ──
chatMessageSchema.index({ session: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
