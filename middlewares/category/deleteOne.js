/**
 * Creates middleware that handles deleting one category.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-deletion middleware.
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