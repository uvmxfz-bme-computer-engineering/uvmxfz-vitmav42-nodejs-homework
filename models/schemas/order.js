const Schema = require('mongoose').Schema;
const orderItemSchema = require('./orderItem');
/**
 * @typedef {Object} Order
 * @property {number|null}      id              Unique identifier; null until persisted.
 * @property {string}           customerEmail   Contact and account e-mail.
 * @property {OrderItem[]}      items           Ordered line items.
 * @property {number}           itemCount       Sum of item quantities.
 * @property {number}           total           Order total, derived from items.
 * @property {string}           currency        ISO 4217 currency code.
 * @property {string}           status          One of ORDER_STATUSES.
 * @property {string}           paymentMethod   One of PAYMENT_METHODS.
 * @property {string}           shippingAddress Formatted shipping address.
 * @property {string}           notes           Optional internal customer note.
 * @property {string|null}      createdBy       User who created the record.
 * @property {string}           createdAt       ISO 8601 creation timestamp.
 * @property {string}           modifiedBy      User who last modified the record.
 * @property {string}           modifiedAt      ISO 8601 last-modification timestamp.
 */

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];

const orderSchema = new Schema({
    customerEmail: { type: String, required: true, trim: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid e-mail address'], },
    items: [orderItemSchema],
    itemCount: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'pending', enum: ORDER_STATUSES },
    shippingAddress: { type: String, default: '' },
    comments: { type: String, default: '' },
}, { timestamps: true });

module.exports = orderSchema;
