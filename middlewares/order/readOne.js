/**
 * Creates middleware that loads one order using the route parameter.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const orderId = req.params.id;
            const order = await objects.OrderModel
                .findById(orderId)
                .populate({ path: 'items._product', populate: { path: '_category' } })
                .lean()
                .exec();
            if (!order) {
                return res.redirect('/admin');
            }
            res.locals.order = order;
            next();
        } catch (error) {
            next(error);
        }
    };
};