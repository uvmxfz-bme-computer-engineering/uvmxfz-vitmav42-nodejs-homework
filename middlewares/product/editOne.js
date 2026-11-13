/**
 * Creates middleware that handles updating one product.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-update middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            if (req.method !== 'POST') {
                return next();
            }

            const update = {
                name: req.body.name,
                ean: req.body.ean || undefined,
                description: req.body.description || '',
                price: Number(req.body.price),
                stock: Number(req.body.stock) || 0,
                status: req.body.status || undefined,
                _category: req.body._category || null,
            };

            if (req.file) {
                update.imageUrl = `/uploads/${req.file.filename}`;
            }

            const product = await objects.ProductModel.findByIdAndUpdate(
                req.params.id,
                update,
                { new: true, runValidators: true }
            );

            if (!product) {
                const error = new Error('Product not found');
                error.status = 404;
                throw error;
            }

            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};