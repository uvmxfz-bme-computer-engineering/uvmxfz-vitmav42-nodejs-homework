/**
 * Creates middleware that loads one category using the route parameter.
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