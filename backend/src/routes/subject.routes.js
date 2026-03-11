const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subject.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleGuard = require('../middleware/roleGuard');

router.post('/', authMiddleware, roleGuard('teacher'), subjectController.createSubject);
router.get('/', authMiddleware, subjectController.listSubjects);
router.get('/:id', authMiddleware, subjectController.getSubject);
router.patch('/:id', authMiddleware, roleGuard('teacher'), subjectController.updateSubject);
router.delete('/:id', authMiddleware, roleGuard('teacher'), subjectController.deleteSubject);
router.post('/:id/enroll', authMiddleware, roleGuard('student'), subjectController.enrollInSubject);

module.exports = router;
