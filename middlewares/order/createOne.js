/**
 * Creates middleware that handles order creation.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-creation middleware.
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