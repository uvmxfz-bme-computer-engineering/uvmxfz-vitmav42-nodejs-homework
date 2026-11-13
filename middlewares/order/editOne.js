/**
 * Creates middleware that handles updating one order.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-update middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const orderId = req.params.id;
            const status = req.body.status;

            if (!Object.values(objects.statuses.ORDER).includes(status)) {
                const error = new Error('Invalid order status');
                error.status = 400;
                throw error;
            }

            await objects.OrderModel.findByIdAndUpdate(orderId, { status });
            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};