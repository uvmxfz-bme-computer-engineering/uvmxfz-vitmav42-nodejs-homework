/**
 * Creates middleware that loads all products for a request.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Product-loading middleware.
 */
module.exports = (objects) => {
    return async (req, res, next) => {
        try {
            // Simulate a database query
            //const products = [ { id: 1, category: 'CPU', name: 'Intel Core i9-13900K', description: 'High-performance CPU', price: 589.99, stock: 10 }, { id: 2, category: 'GPU', name: 'NVIDIA GeForce RTX 4090', description: 'Top-tier gaming GPU', price: 1599.99, stock: 5 }, { id: 3, category: 'Motherboard', name: 'ASUS ROG Maximus Z790 Hero', description: 'Premium motherboard for Intel CPUs', price: 599.99, stock: 7 }, { id: 4, category: 'RAM', name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4-3600', description: 'High-speed RAM with RGB lighting', price: 189.99, stock: 15 }, { id: 5, category: 'Storage', name: 'Samsung 980 Pro 1TB NVMe SSD', description: 'Fast NVMe SSD for storage and gaming', price: 149.99, stock: 20 }, ]
            let products = await objects.ProductModel.find().populate("_category").lean();
            res.locals.products = products;
            next();
        } catch (error) {
            next(error);
        }
    };
};