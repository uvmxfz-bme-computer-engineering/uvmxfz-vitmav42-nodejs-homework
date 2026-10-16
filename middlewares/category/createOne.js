/**
 * Creates middleware that handles category creation.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-creation middleware.
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