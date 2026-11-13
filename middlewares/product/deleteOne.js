/**
 * Creates middleware that handles deleting one product.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-deletion middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const productId = req.params.id;
            await objects.ProductModel.findByIdAndDelete(productId);
            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};