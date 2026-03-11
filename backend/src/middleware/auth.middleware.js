const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT access token and attach user to request.
 */
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('[AuthMiddleware] No token provided in Authorization header');
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
                code: 'NO_TOKEN',
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');
        if (!user || !user.isActive) {
            console.error('[AuthMiddleware] User not found or inactive:', decoded.userId);
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive.',
                code: 'INVALID_USER',
            });
        }

        req.user = {
            userId: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('[AuthMiddleware] Token expired');
            return res.status(401).json({
                success: false,
                message: 'Token expired.',
                code: 'TOKEN_EXPIRED',
            });
        }
        console.error('[AuthMiddleware] Invalid token:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token.',
            code: 'INVALID_TOKEN',
        });
    }
};

module.exports = authMiddleware;
