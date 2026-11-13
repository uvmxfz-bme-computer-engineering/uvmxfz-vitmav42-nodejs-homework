/**
 * Domain status values shared by the models, middlewares and views.
 *
 * Each group is a frozen map of NAMED members; iterate with `Object.values(...)`
 * and reference a specific member by name (e.g. `statuses.PRODUCT.DRAFT`).
 *
 * @module models/statuses
 */
module.exports = Object.freeze({
    PRODUCT: Object.freeze({
        DRAFT: 'draft',
        ACTIVE: 'active',
        RETIRED: 'retired',
    }),
    CATEGORY: Object.freeze({
        DRAFT: 'draft',
        ACTIVE: 'active',
        RETIRED: 'retired',
    }),
    ORDER: Object.freeze({
        PENDING: 'pending',
        PAID: 'paid',
        SHIPPED: 'shipped',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled',
    }),
});
