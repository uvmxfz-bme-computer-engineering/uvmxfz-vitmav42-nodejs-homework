const Schema = require('mongoose').Schema;
const orderItemSchema = require('./orderItem');
/**
 * @typedef {Object} Order
 * @property {number|null}      id              Unique identifier; null until persisted.
 * @property {string}           customerEmail   Contact and account e-mail.
 * @property {OrderItem[]}      items           Ordered line items.
 * @property {number}           itemCount       Derived: sum of item quantities (virtual, not persisted).
 * @property {number}           total           Derived: sum of item netTotals (virtual, not persisted).
 * @property {string}           currency        ISO 4217 currency code.
 * @property {string}           status          One of ORDER_STATUSES.
 * @property {string}           shippingAddress Formatted shipping address.
 * @property {string}           notes           Optional internal customer note.
 * @property {string}           createdAt       ISO 8601 creation timestamp.
 * @property {string}           modifiedAt      ISO 8601 last-modification timestamp.
 */

const ORDER_STATUSES = Object.values(require('../statuses').ORDER);

const emailValidator = require("email-validator");

const orderSchema = new Schema(
  {
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: emailValidator.validate,
        message: props => `${props.value} is not a valid email address!`,
      },
    },
    items: [orderItemSchema],
    status: {
      type: String,
      default: "pending",
      enum: ORDER_STATUSES,
    },
    shippingAddress: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

module.exports = orderSchema;
