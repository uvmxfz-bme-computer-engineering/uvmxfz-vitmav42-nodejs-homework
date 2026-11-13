const nullIfEmpty = require('../../utils/nullIfEmpty');

/**
 * Builds a URL-safe slug from a category name.
 *
 * @param {string} name Category name.
 * @returns {string} Lowercase, hyphen-separated slug.
 */
const slugify = (name) => name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Creates middleware that handles category creation.
 *
 * @param {object} objects Shared category model or repository.
 * @returns {Function} Category-creation middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const name = nullIfEmpty(req.body.name);
            const category = {
                name,
                slug: nullIfEmpty(req.body.slug) || slugify(name || ''),
                description: nullIfEmpty(req.body.description) || '',
            };

            await objects.CategoryModel.create(category);
            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};