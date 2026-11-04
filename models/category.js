const db = require('../configs/db');
const categorySchema = require('./schemas/category');

/**
 * Mongoose model for category documents.
 *
 * @module models/category
 */
module.exports = db.model('Category', categorySchema);