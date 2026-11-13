const nullIfEmpty = require('../../utils/nullIfEmpty');

/**
 * Creates middleware that handles updating one category.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-update middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const categoryId = req.params.id;
            const updatedCategory = {
                name:        nullIfEmpty(req.body.name),
                slug:        nullIfEmpty(req.body.slug),
                description: nullIfEmpty(req.body.description),
            };
            await objects.CategoryModel.updateOne({ _id: categoryId }, updatedCategory);
            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};