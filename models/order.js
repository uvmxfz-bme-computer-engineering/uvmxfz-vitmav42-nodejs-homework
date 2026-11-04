const db = require('../configs/db');
const orderSchema = require('./schemas/order');

/**
 * Mongoose model for order documents.
 *
 * @module models/order
 */
module.exports = db.model('Order', orderSchema);
