const Schema = require('mongoose').Schema;
const statuses = require('../statuses');

const PRODUCT_STATUSES = Object.values(statuses.PRODUCT);

/**
 * Product document schema.
 *
 * @typedef {Object} Product
 * @property {import('mongoose').Types.ObjectId}      _id         Document id assigned by MongoDB.
 * @property {string}      ean         EAN-13 barcode number.
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
const productSchema = new Schema(
  {
    ean: { type: String, match: /^\d{8}$|^\d{12,14}$/, unique: true, required: true, sparse: true, },
    name: { type: String, required: true },
    description: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: null },
    status: { type: String, default: "draft", enum: PRODUCT_STATUSES },
    _category: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true },
);

module.exports = productSchema;
