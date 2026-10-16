/**
 * Creates middleware that handles product creation.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-creation middleware.
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