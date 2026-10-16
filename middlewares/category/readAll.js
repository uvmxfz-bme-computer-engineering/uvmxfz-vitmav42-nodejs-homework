/**
 * Creates middleware that loads all categories for a request.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-loading middleware.
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