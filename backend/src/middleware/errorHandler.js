/**
 * Global error handler middleware.
 */
const errorHandler = (err, req, res, _next) => {
    console.error('❌ Error:', err.message);
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        code: err.code || 'SERVER_ERROR',
    });
};

module.exports = errorHandler;
