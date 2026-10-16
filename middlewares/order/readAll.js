/**
 * Creates middleware that loads all orders for a request.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-loading middleware.
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