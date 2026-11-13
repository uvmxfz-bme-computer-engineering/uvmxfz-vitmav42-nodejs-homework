const cart = require('../../utils/cart');

/**
 * Creates middleware that exposes the cart item count and per-product
 * quantities to every view.
 *
 * Populates `res.locals.cartCount` (total units) and
 * `res.locals.cartQuantities` (`{ productId: quantity }`).
 *
 * @param {object} objects Shared models or services used by middleware.
 * @returns {Function} Locals-populating middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const items = cart.getItems(req.session);
            res.locals.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
            res.locals.cartQuantities = Object.fromEntries(
                items.map((item) => [item.productId, item.quantity]),
            );
            next();
        } catch (error) {
            next(error);
        }
    };
};
