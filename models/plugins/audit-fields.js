/**
 * Audit-field schema plugin: adds `createdBy` / `modifiedBy` attribution fields.
 *
 * Only these two nullable strings are added; timestamps come from Mongoose's own
 * `timestamps: true` option. The plugin is not applied to any model schema yet.
 *
 * @module models/plugins/audit-fields
 */

/**
 * Adds audit fields to the given schema.
 *
 * @param {import('mongoose').Schema} schema Schema to extend.
 * @returns {void}
 */
module.exports = (schema) => {
    schema.add({
        createdBy: { type: String, default: null },
        modifiedBy: { type: String, default: null },
    });
};