/**
 * Creates middleware that handles product creation.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-creation middleware.
 */
const nullIfEmpty = require('../../utils/nullIfEmpty');

module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const product = {
              name:         nullIfEmpty(req.body.name),
              ean:          nullIfEmpty(req.body.ean),
              description:  nullIfEmpty(req.body.description),
              status:       nullIfEmpty(req.body.status),
            	_category:    nullIfEmpty(req.body._category),
              price: Number(req.body.price) || 0,
              stock: Number(req.body.stock) || 0,
            };

            if (req.file) {
                product.imageUrl = `/uploads/${req.file.filename}`;
            }

            await objects.ProductModel.create(product);
            res.redirect('/admin');
        } catch (error) {
            next(error);
        }
    };
};