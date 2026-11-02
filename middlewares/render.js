/**
 * Creates render middleware for rendering views.
 *
 * @param {object} objects Shared models or services used for rendering.
 * @param {object} view name of the view to render.
 * @returns {Function} Express render middleware.
 */
module.exports = (objects, view) => {
    return async (req, res, next) => {
        try {
            res.render(view, res.locals);
        } catch (error) {
            next(error);
        }
    };
};