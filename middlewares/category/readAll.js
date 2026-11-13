/**
 * Creates middleware that loads all categories for a request.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const categories = await objects.CategoryModel.find().lean();
            res.locals.categories = categories;
            next();
        } catch (error) {
            next(error);
        }
    };
};