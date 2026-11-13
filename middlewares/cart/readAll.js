const cart = require('../../utils/cart');

/**
 * Creates middleware that hydrates the session cart with product data.
 *
 * Populates `res.locals.cartItems`, `res.locals.cartSubtotal`, and
 * `res.locals.cartCount`; missing or out-of-stock products are dropped from
 * the session cart.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Cart-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const items = cart.getItems(req.session);
            const products = items.length
                ? await objects.ProductModel
                    .find({ _id: { $in: items.map((item) => item.productId) } })
                    .populate('_category')
                    .lean()
                : [];

            const cartItems = cart.hydrate(req.session, products);

            res.locals.cartItems = cartItems;
            res.locals.cartSubtotal = cart.getSubtotal(cartItems);
            res.locals.cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            next();
        } catch (error) {
            next(error);
        }
    };
};
