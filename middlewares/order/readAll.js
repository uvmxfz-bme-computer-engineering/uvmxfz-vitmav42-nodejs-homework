/**
 * Creates middleware that loads all orders for a request.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const orders = await objects.OrderModel
                .find()
                .populate({ path: 'items._product', populate: { path: '_category' } })
                .lean()
                .exec();
            res.locals.orders = orders;
            next();
        } catch (error) {
            next(error);
        }
    };
};