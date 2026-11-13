/**
 * Creates middleware that loads all orders of a customer.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-loading middleware.
 */
module.exports = (objects) => {
  return async (req, res, next) => {
    try {
      const customerEmail = req.customerEmail;
      if (!customerEmail) {
        return res.redirect('/check-orders');
      }
      const orders = await objects.OrderModel.find({ customerEmail })
        .populate({ path: 'items._product', populate: { path: '_category' } })
        .lean()
        .exec();
      res.locals.orders = orders;
      res.locals.customerEmail = customerEmail;
      next();
    } catch (error) {
      next(error);
    }
  };
};