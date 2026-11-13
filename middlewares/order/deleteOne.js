/**
 * Creates middleware that handles deleting one order.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-deletion middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const orderId = req.params.id;
            await objects.OrderModel.findByIdAndDelete(orderId);
            res.redirect("/admin");
        } catch (error) {
            next(error);
        }
    };
};