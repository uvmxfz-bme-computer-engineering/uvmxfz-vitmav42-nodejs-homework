/**
 * Creates middleware that loads one order using the route parameter.
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