/**
 * Creates middleware that loads one category using the route parameter.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            const category = await objects.CategoryModel.findById(categoryId).lean();
            if (!category) {
                return res.redirect('/admin');
            }
            res.locals.category = category;
            next();
        } catch (error) {
            next(error);
        }
    };
};