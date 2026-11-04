/**
 * Express error-handling middleware.
 *
 * Logs the error and sends a JSON response. In production the message is
 * generic; otherwise the real message and stack are included.
 *
 * @param {Error} err Error passed by next(err).
 * @param {object} req Express request object.
 * @param {object} res Express response object.
 * @param {Function} next Express next function (required for Express to
 *                        recognize this as an error handler).
 * @returns {void}
 */
module.exports = (err, req, res, next) => {
        console.error(err.stack);                               // Log
        console.error(err.message);

        const statusCode = err.status || err.statusCode || 500; // Default to 500 if not specified
        const message = process.env.NODE_ENV === 'production'   // Send generic message in production
            ? 'Something went wrong!'
            : err.message;

        res.status(statusCode).json({
            error: {
                message: message,
                ...(process.env.NODE_ENV !== 'production' && {stack: err.stack})
            }
        });
};
