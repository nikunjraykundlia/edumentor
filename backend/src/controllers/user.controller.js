const User = require('../models/User');

// ── Get Profile ──
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-passwordHash -refreshToken')
            .populate('enrolledSubjects', 'name code coverColor')
            .populate('createdSubjects', 'name code coverColor');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
                code: 'NOT_FOUND',
            });
        }

        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

// ── Update Profile ──
exports.updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        const updates = {};
        if (name) updates.name = name;

        const user = await User.findByIdAndUpdate(req.user.userId, updates, {
            new: true,
        }).select('-passwordHash -refreshToken');

        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};
