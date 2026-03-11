const { v4: uuidv4 } = require('uuid');
const Note = require('../models/Note');
const Subject = require('../models/Subject');
const { uploadToImageKit, deleteFromImageKit } = require('../services/imagekit.service');
const { triggerUploadWebhook } = require('../services/n8n.service');

// ── Upload Note (Teacher) ──
exports.uploadNote = async (req, res, next) => {
    try {
        const { subjectId, title } = req.body;
        const file = req.file;

        if (!file || !subjectId || !title) {
            return res.status(400).json({
                success: false,
                message: 'File, subjectId, and title are required.',
                code: 'MISSING_FIELDS',
            });
        }

        // Verify teacher owns the subject
        const subject = await Subject.findById(subjectId);
        if (!subject || subject.teacher.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload to this subject.',
                code: 'FORBIDDEN',
            });
        }

        // Upload to ImageKit
        const ikResponse = await uploadToImageKit(file.buffer, file.originalname);

        // Generate unique session ID for this note (Pinecone namespace)
        const n8nSessionId = uuidv4();

        // Create Note document
        const note = await Note.create({
            title,
            subject: subjectId,
            uploadedBy: req.user.userId,
            fileUrl: ikResponse.fileUrl,
            fileId: ikResponse.fileId,
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSizeKb: Math.round(file.size / 1024),
            thumbnailUrl: ikResponse.thumbnailUrl,
            pineconeStatus: 'pending',
            n8nSessionId,
        });

        // Update subject notes count
        subject.notesCount += 1;
        await subject.save();

        // Trigger n8n upload webhook (async — don't block response)
        triggerUploadWebhook({
            fileUrl: ikResponse.fileUrl,
            sessionId: n8nSessionId,
            subjectId,
        })
            .then(async () => {
                note.pineconeStatus = 'indexed';
                note.indexedAt = new Date();
                await note.save();
            })
            .catch(async (err) => {
                console.error('n8n upload webhook failed:', err.message);
                note.pineconeStatus = 'failed';
                await note.save();
            });

        res.status(201).json({ success: true, note });
    } catch (error) {
        next(error);
    }
};

// ── List Notes by Subject ──
exports.listNotesBySubject = async (req, res, next) => {
    try {
        const notes = await Note.find({ subject: req.params.subjectId })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, notes });
    } catch (error) {
        next(error);
    }
};

// ── Get Single Note ──
exports.getNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('uploadedBy', 'name email');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found.',
                code: 'NOT_FOUND',
            });
        }

        res.json({ success: true, note });
    } catch (error) {
        next(error);
    }
};

// ── Delete Note (Teacher Owner) ──
exports.deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found.',
                code: 'NOT_FOUND',
            });
        }

        if (note.uploadedBy.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this note.',
                code: 'FORBIDDEN',
            });
        }

        // Delete from ImageKit
        if (note.fileId) {
            try {
                await deleteFromImageKit(note.fileId);
            } catch (err) {
                console.error('ImageKit delete failed:', err.message);
            }
        }

        // Decrement subject notes count
        await Subject.findByIdAndUpdate(note.subject, {
            $inc: { notesCount: -1 },
        });

        await Note.findByIdAndDelete(note._id);
        res.json({ success: true, message: 'Note deleted.' });
    } catch (error) {
        next(error);
    }
};
