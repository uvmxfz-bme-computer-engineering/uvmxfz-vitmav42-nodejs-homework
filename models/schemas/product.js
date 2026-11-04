const Schema = require('mongoose').Schema;

const PRODUCT_STATUSES = Object.freeze(['draft', 'active', 'out_of_stock', 'discontinued']);

/**
 * Product document schema.
 *
 * @typedef {Object} Product
 * @property {import('mongoose').Types.ObjectId}      _id         Document id assigned by MongoDB.
 * @property {string}      sku         Stock keeping unit, unique per product.
 * @property {string}      name        Display name.
 * @property {string}      description Short marketing/technical description.
 * @property {string}      brand       Manufacturer or brand name.
 * @property {number}      price       Unit price.
 * @property {string}      currency    ISO 4217 currency code.
 * @property {number}      stock       Units available.
 * @property {string}      imageUrl    Path or URL of the product image.
 * @property {string}      status      One of PRODUCT_STATUSES.
 * @property {import('mongoose').Types.ObjectId|null} _category Referenced Category document; null when uncategorised.
 * @property {Date}        createdAt   Set by the timestamps option.
 * @property {Date}        updatedAt   Set by the timestamps option.
 */
const productSchema = new Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    brand: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: '' },
    status: { type: String, default: 'draft', enum: PRODUCT_STATUSES },
    _category: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = productSchema;
