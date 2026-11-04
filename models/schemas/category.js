const Schema = require('mongoose').Schema;

/**
 * Category document schema.
 *
 * @typedef {Object} Category
 * @property {import('mongoose').Types.ObjectId}      _id              Document id assigned by MongoDB.
 * @property {string}        name            Display name, unique.
 * @property {string}        slug            URL-safe identifier, unique.
 * @property {string}        description     Short description.
 * @property {import('mongoose').Types.ObjectId|null} _parentCategory Parent Category document; null for top-level categories.
 * @property {Date}          createdAt       Set by the timestamps option.
 * @property {Date}          updatedAt       Set by the timestamps option.
 */
const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    _parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = categorySchema;