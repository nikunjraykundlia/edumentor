const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleGuard = require('../middleware/roleGuard');

router.post('/session', authMiddleware, roleGuard('student'), chatController.createOrGetSession);
router.get('/sessions', authMiddleware, roleGuard('student'), chatController.listSessions);
router.get('/session/:sessionId/messages', authMiddleware, roleGuard('student'), chatController.getSessionMessages);
router.post('/message', authMiddleware, roleGuard('student'), chatController.sendMessage);

module.exports = router;
