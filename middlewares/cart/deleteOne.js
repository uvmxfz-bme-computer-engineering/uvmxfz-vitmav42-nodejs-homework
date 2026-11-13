const cart = require('../../utils/cart');

/**
 * Creates middleware that removes one product from the session cart.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @returns {Function} Cart-delete middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            cart.removeItem(req.session, req.params.id);
            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    };
};
