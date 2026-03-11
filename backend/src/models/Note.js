const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Note title is required'],
            trim: true,
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: [true, 'Subject is required'],
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Uploader is required'],
        },
        fileUrl: {
            type: String,
            required: [true, 'File URL is required'],
        },
        fileId: {
            type: String,
            required: [true, 'ImageKit file ID is required'],
        },
        fileName: { type: String, default: '' },
        fileType: { type: String, default: 'application/pdf' },
        fileSizeKb: { type: Number, default: 0 },
        n8nSessionId: {
            type: String,
            unique: true,
            default: () => uuidv4(),
        },
        pineconeStatus: {
            type: String,
            enum: ['pending', 'indexing', 'indexed', 'failed'],
            default: 'pending',
        },
        indexedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

// ── Indexes ──
noteSchema.index({ subject: 1 });
noteSchema.index({ uploadedBy: 1 });
noteSchema.index({ pineconeStatus: 1 });

module.exports = mongoose.model('Note', noteSchema);
