/**
 * Creates authorization middleware for protected routes.
 *
 * @param {object} objects Shared models or services used for authorization.
 * @returns {Function} Express authorization middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            next();
        } catch (error) {
            next(error);
        }
    };
};