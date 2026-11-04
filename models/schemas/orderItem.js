const Schema = require('mongoose').Schema;

/**
 * Order line-item sub-schema. Embedded with `_id` disabled, so documents using
 * it have no own id.
 *
 * @typedef {Object} OrderItem
 * @property {import('mongoose').Types.ObjectId} _product Referenced Product document at time of ordering.
 * @property {number} quantity  Units ordered, >= 1.
 * @property {number} unitPrice Price per unit at time of ordering.
 * @property {number} netTotal  quantity * unitPrice.
 */
const orderItemSchema = new Schema({
    _product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    netTotal: { type: Number, required: true, min: 0 },
}, { _id: false });

module.exports = orderItemSchema;