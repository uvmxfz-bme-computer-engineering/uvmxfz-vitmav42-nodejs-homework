const cart = require('../../utils/cart');

/**
 * Creates middleware that updates the quantity of one cart item.
 *
 * Quantities below 1, missing products, and products without stock remove the
 * item from the cart.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Cart-update middleware.
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

            if (Number(req.body.quantity) < 1 || !(Number(product.stock) > 0)) {
                cart.removeItem(req.session, product._id);
            } else {
                cart.setQuantity(req.session, product._id, req.body.quantity, Number(product.stock));
            }

            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    };
};
