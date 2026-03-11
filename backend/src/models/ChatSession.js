const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student is required'],
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: [true, 'Subject is required'],
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        title: { type: String, default: 'New Chat' },
        messageCount: { type: Number, default: 0 },
        lastMessageAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// ── Indexes ──
chatSessionSchema.index({ student: 1, subject: 1 });

// ── Static method: generate session ID ──
chatSessionSchema.statics.generateSessionId = function (userId, subjectId) {
    return userId + '_' + subjectId + '_' + Date.now();
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
