/**
 * Creates middleware that handles updating one order.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-update middleware.
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