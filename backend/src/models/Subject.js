const mongoose = require('mongoose');

const COVER_COLORS = [
    '#6366F1',
    '#22D3EE',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#14B8A6',
];

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Subject code is required'],
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Teacher is required'],
        },
        enrolledStudents: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        ],
        notesCount: { type: Number, default: 0 },
        coverColor: {
            type: String,
            default: function () {
                return COVER_COLORS[
                    Math.floor(Math.random() * COVER_COLORS.length)
                ];
            },
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// ── Indexes ──
subjectSchema.index({ teacher: 1 });
subjectSchema.index({ code: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
