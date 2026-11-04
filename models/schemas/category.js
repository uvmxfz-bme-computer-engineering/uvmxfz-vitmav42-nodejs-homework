const Schema = require('mongoose').Schema;

/**
 * Category document schema.
 *
 * @typedef {Object} Category
 * @property {string}        name            Display name, unique.
 * @property {string}        slug            URL-safe identifier, unique.
 * @property {string}        description     Short description.
 * @property {string}        imageUrl        URL of the category's image.
 * @property {Category|null}  _parentCategory Reference to the parent category, or null if top-level.
 * @property {Date}          createdAt       Set by the timestamps option.
 * @property {Date}          updatedAt       Set by the timestamps option.
 */
const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    _parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    imageUrl: { type: String, default: '' },
    _products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = categorySchema;