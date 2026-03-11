const express = require('express');
const router = express.Router();
const multer = require('multer');
const noteController = require('../controllers/note.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleGuard = require('../middleware/roleGuard');

// Multer in-memory storage for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/webp',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not supported'), false);
        }
    },
});

router.post(
    '/upload',
    authMiddleware,
    roleGuard('teacher'),
    upload.single('file'),
    noteController.uploadNote
);
router.get('/subject/:subjectId', authMiddleware, noteController.listNotesBySubject);
router.get('/:id', authMiddleware, noteController.getNote);
router.delete('/:id', authMiddleware, roleGuard('teacher'), noteController.deleteNote);

module.exports = router;
