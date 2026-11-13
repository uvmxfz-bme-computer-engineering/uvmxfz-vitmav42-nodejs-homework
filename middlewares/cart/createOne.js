const cart = require('../../utils/cart');

/**
 * Creates middleware that adds one product to the session cart.
 *
 * Quantities are clamped to the current stock, and products that are missing
 * or out of stock are ignored.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Cart-add middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const product = await objects.ProductModel.findById(req.params.id).lean();
            if (!product) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }

            if (Number(product.stock) > 0) {
                cart.addItem(req.session, product._id, req.body.quantity ?? 1, Number(product.stock));
            }

            res.redirect('/');
        } catch (error) {
            next(error);
        }
    };
};
