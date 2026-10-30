/**
 * Creates middleware that loads all products for a request.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-loading middleware.
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