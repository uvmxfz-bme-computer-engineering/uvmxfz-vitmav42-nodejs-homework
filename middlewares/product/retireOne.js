/**
 * Creates middleware that handles retiring one product.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-deletion middleware.
 */
module.exports = (objects) => {
  return async (req, res, next) => {
    try {
      const productId = req.params.id;
      await objects.ProductModel.findByIdAndUpdate(productId, { status: "retired" });
      res.redirect("/admin");
      next();
    } catch (error) {
      next(error);
    }
  };
};
