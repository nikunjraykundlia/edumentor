/**
 * Role-based access control middleware.
 * Usage: roleGuard('teacher') or roleGuard('student')
 */
const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('[RoleGuard] No user found in request. authMiddleware might have failed or been skipped.');
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
                code: 'AUTH_REQUIRED',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.error(`[RoleGuard] Access denied for user ${req.user.email}. Role: ${req.user.role}. Required: ${allowedRoles.join(' or ')}`);
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
                code: 'FORBIDDEN',
            });
        }

        console.log(`[RoleGuard] Access granted for user ${req.user.email} (Role: ${req.user.role}) to endpoint ${req.method} ${req.originalUrl}`);

        next();
    };
};

module.exports = roleGuard;
