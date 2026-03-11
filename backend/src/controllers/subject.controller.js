const Subject = require('../models/Subject');
const User = require('../models/User');

// ── Create Subject (Teacher) ──
exports.createSubject = async (req, res, next) => {
    try {
        const { name, code, description } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: 'Subject name and code are required.',
                code: 'MISSING_FIELDS',
            });
        }

        const subject = await Subject.create({
            name,
            code,
            description: description || '',
            teacher: req.user.userId,
        });

        // Add to teacher's createdSubjects
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { createdSubjects: subject._id },
        });

        res.status(201).json({ success: true, subject });
    } catch (error) {
        next(error);
    }
};

// ── List All Subjects ──
exports.listSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find({
            isActive: true,
        })
            .populate('teacher', 'name email avatar')
            .sort({ createdAt: -1 });

        res.json({ success: true, subjects });
    } catch (error) {
        next(error);
    }
};

// ── Get Subject Details ──
exports.getSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id)
            .populate('teacher', 'name email avatar')
            .populate('enrolledStudents', 'name email avatar');

        if (!subject || !subject.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found.',
                code: 'NOT_FOUND',
            });
        }

        res.json({ success: true, subject });
    } catch (error) {
        next(error);
    }
};

// ── Update Subject (Teacher Owner) ──
exports.updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject || !subject.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found.',
                code: 'NOT_FOUND',
            });
        }

        if (subject.teacher.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this subject.',
                code: 'FORBIDDEN',
            });
        }

        const { name, code, description } = req.body;
        if (name) subject.name = name;
        if (code) subject.code = code;
        if (description !== undefined) subject.description = description;

        await subject.save();
        res.json({ success: true, subject });
    } catch (error) {
        next(error);
    }
};

// ── Delete Subject (Soft) ──
exports.deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found.',
                code: 'NOT_FOUND',
            });
        }

        if (subject.teacher.toString() !== req.user.userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this subject.',
                code: 'FORBIDDEN',
            });
        }

        subject.isActive = false;
        await subject.save();
        res.json({ success: true, message: 'Subject deactivated.' });
    } catch (error) {
        next(error);
    }
};

// ── Enroll Student in Subject ──
exports.enrollInSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);

        if (!subject || !subject.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found.',
                code: 'NOT_FOUND',
            });
        }

        const alreadyEnrolled = subject.enrolledStudents.includes(req.user.userId);
        if (alreadyEnrolled) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this subject.',
                code: 'ALREADY_ENROLLED',
            });
        }

        subject.enrolledStudents.push(req.user.userId);
        await subject.save();

        await User.findByIdAndUpdate(req.user.userId, {
            $push: { enrolledSubjects: subject._id },
        });

        res.json({ success: true, message: 'Enrolled successfully.' });
    } catch (error) {
        next(error);
    }
};
