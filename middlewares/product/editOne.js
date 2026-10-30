/**
 * Creates middleware that handles updating one product.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-update middleware.
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