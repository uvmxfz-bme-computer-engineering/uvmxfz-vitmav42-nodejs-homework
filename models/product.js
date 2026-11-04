const db = require('../configs/db');
const productSchema = require('./schemas/product');

/**
 * Mongoose model for product documents.
 *
 * @module models/product
 */
module.exports = db.model('Product', productSchema);
