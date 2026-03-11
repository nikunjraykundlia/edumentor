/**
 * Role-based access control middleware.
 * Usage: roleGuard('teacher') or roleGuard('student')
 */
const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
                code: 'AUTH_REQUIRED',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
                code: 'FORBIDDEN',
            });
        }

        next();
    };
};

module.exports = roleGuard;
