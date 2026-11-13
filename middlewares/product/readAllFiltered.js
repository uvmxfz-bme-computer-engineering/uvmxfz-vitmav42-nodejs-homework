/**
 * Creates middleware that loads all products for a request, optionally filtering by category.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-loading middleware.
 */
module.exports = (objects) => {
  return async (req, res, next) => {
    try {
      let products = await objects.ProductModel.find({ stock: { $gt: 0 }, status: objects.statuses.PRODUCT.ACTIVE })
        .populate("_category")
        .lean();
      if (req.query.category) {
        products = products.filter(
          (product) =>
            product._category &&
            product._category.slug.toLowerCase() === req.query.category.toLowerCase()
        );
      }
      res.locals.products = products;
      next();
    } catch (error) {
      next(error);
    }
  };
};
