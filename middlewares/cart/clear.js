const cart = require('../../utils/cart');

/**
 * Creates middleware that empties the session cart.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @returns {Function} Cart-clear middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            cart.clear(req.session);
            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    };
};
