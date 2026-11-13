/**
 * Creates middleware that loads one product using the route parameter.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const productId = req.params.id;
            const product = await objects.ProductModel.findById(productId).populate('_category').lean();
            if (!product) {
                return res.redirect('/admin');
            }
            res.locals.product = product;
            next();
        } catch (error) {
            next(error);
        }
    };
};