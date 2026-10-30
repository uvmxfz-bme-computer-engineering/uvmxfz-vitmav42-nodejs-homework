/**
 * Creates middleware that handles updating one category.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-update middleware.
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