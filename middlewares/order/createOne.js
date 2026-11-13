const cart = require('../../utils/cart');

/**
 * Creates middleware that turns the session cart into an order.
 *
 * Products are re-read from the database so prices come from the store, not
 * the session. On success the customer e-mail is kept in the session, the cart
 * is emptied and the customer is sent to the success page.
 *
 * @param {object} objects Shared order model or repository.
 * @returns {Function} Order-creation middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            const items = cart.getItems(req.session);
            if (items.length === 0) {
                return res.redirect('/cart');
            }

            const products = await objects.ProductModel
                .find({ _id: { $in: items.map((item) => item.productId) } })
                .lean();

            if (products.length !== items.length) {
                throw new Error('Some products were not found');
            }

            const productsById = new Map(products.map((product) => [String(product._id), product]));

            await objects.OrderModel.create({
                customerEmail: req.body.customerEmail,
                items: items.map((item) => {
                    const product = productsById.get(item.productId);
                    return {
                        _product: product._id,
                        quantity: item.quantity,
                        unitPrice: product.price,
                    };
                }),
                status: objects.statuses.ORDER.PENDING,
                notes: req.body.notes || '-',
            });

            await objects.ProductModel.updateMany(
                { _id: { $in: items.map((item) => item.productId) } },
                { $inc: { stock: -items.reduce((acc, item) => acc + item.quantity, 0) } }
            );

            req.session.customerEmail = req.body.customerEmail;
            cart.clear(req.session);

            res.redirect('/success');
        } catch (error) {
            next(error);
        }
    };
};