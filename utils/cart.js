/**
 * Session-backed shopping cart helpers.
 *
 * The cart lives in `req.session.cart` as `{ productId, quantity }` pairs;
 * prices, names, and stock are always resolved from the database, so the
 * session is never a source of truth for product data.
 *
 * @module utils/cart
 */

const DEFAULT_MAX_QUANTITY = 99;

/**
 * Clamps a quantity to a whole number within [1, maxQuantity].
 *
 * @param {*} quantity Requested quantity.
 * @param {number} [maxQuantity] Upper bound (usually the product stock).
 * @returns {number} Clamped quantity.
 */
const clampQuantity = (quantity, maxQuantity) => {
  const limit =
    Number.isInteger(maxQuantity) && maxQuantity > 0
      ? maxQuantity
      : DEFAULT_MAX_QUANTITY;
  const parsed = Math.floor(Number(quantity));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, limit) : 1;
};

/**
 * Normalizes one stored entry, dropping anything malformed.
 *
 * @param {*} entry Candidate entry from the session.
 * @returns {{productId: string, quantity: number}|null} Valid entry or null.
 */
const sanitizeEntry = ({ productId, quantity } = {}) => {
  const parsed = Number(quantity);
  return typeof productId === "string" &&
    productId.trim() !== ""            &&
    Number.isInteger(parsed)           &&
    parsed >= 1
    ? { productId, quantity: parsed }
    : null;
};

/**
 * Reads the cart from the session, merging duplicate product ids.
 *
 * @param {object} session Express session object.
 * @returns {Array<{productId: string, quantity: number}>} Stored items.
 */
const getItems = (session) => {
  const raw = Array.isArray(session?.cart) ? session.cart : [];
  const merged = raw.reduce((items, entry) => {
    const valid = sanitizeEntry(entry);
    if (valid) {
      items.set(
        valid.productId,
        (items.get(valid.productId) || 0) + valid.quantity,
      );
    }
    return items;
  }, new Map());

  return Array.from(merged, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

/**
 * Replaces the cart in the session, marking it as modified.
 *
 * @param {object} session Express session object.
 * @param {Array<{productId: string, quantity: number}>} items Cart items.
 * @returns {Array<{productId: string, quantity: number}>} Persisted items.
 */
const setItems = (session, items) => {
  session.cart = items;
  return session.cart;
};

/**
 * Total number of units in the cart.
 *
 * @param {object} session Express session object.
 * @returns {number} Sum of all quantities.
 */
const count = (session) => getItems(session).reduce((sum, item) => sum + item.quantity, 0);

/**
 * Adds a product to the cart, or increases its quantity.
 *
 * @param {object} session Express session object.
 * @param {*} productId Product id.
 * @param {number} [quantity=1] Units to add.
 * @param {number} [maxQuantity] Upper bound, typically the product stock.
 * @returns {Array<{productId: string, quantity: number}>} Updated items.
 */
const addItem = (session, productId, quantity = 1, maxQuantity) => {
  const id = String(productId);
  const items = getItems(session);
  const existing = items.find((entry) => entry.productId === id);
  const nextQuantity = clampQuantity(
    (existing?.quantity || 0) + Number(quantity),
    maxQuantity,
  );
  if (existing) {
    existing.quantity = nextQuantity;
    return setItems(session, items);
  }
  return setItems(session, [
    ...items,
    { productId: id, quantity: nextQuantity },
  ]);
};

/**
 * Sets the exact quantity for a product; less than 1 removes it.
 *
 * @param {object} session Express session object.
 * @param {*} productId Product id.
 * @param {number} quantity Desired quantity.
 * @param {number} [maxQuantity] Upper bound, typically the product stock.
 * @returns {Array<{productId: string, quantity: number}>} Updated items.
 */
const setQuantity = (session, productId, quantity, maxQuantity) => {
  if (Number(quantity) < 1) {
    return removeItem(session, productId);
  }
  const id = String(productId);
  const items = getItems(session);
  const existing = items.find((entry) => entry.productId === id);
  const nextQuantity = clampQuantity(quantity, maxQuantity);
  if (existing) {
    existing.quantity = nextQuantity;
    return setItems(session, items);
  }
  return setItems(session, [
    ...items,
    { productId: id, quantity: nextQuantity },
  ]);
};

/**
 * Removes a product from the cart.
 *
 * @param {object} session Express session object.
 * @param {*} productId Product id.
 * @returns {Array<{productId: string, quantity: number}>} Updated items.
 */
const removeItem = (session, productId) => setItems(
    session,
    getItems(session).filter((entry) => entry.productId !== String(productId)),
);

/**
 * Empties the cart.
 *
 * @param {object} session Express session object.
 * @returns {Array<{productId: string, quantity: number}>} Empty items array.
 */
const clear = (session) => setItems(session, []);

/**
 * Joins stored ids with database products for display and checkout.
 *
 * Unknown ids (deleted products) are dropped, and quantities are clamped to
 * the current stock; the cleaned cart is written back to the session so a
 * stale cart cannot exceed availability.
 *
 * @param {object} session Express session object.
 * @param {Array<{_id: string, price: number, stock: number}>} products Products from the database.
 * @returns {Array<Object>} Entries with `product`, `quantity`, and `lineTotal`.
 */
const hydrate = (session, products) => {
    const byId = new Map((products || []).map((product) => [String(product._id), product]));
    let changed = false;
    const kept = [];
    const hydrated = [];

    getItems(session).forEach((entry) => {
        const product = byId.get(entry.productId);
        if (!product || (Number(product.stock) <= 0)) {
            changed = true;
            return;
        }
        const quantity = clampQuantity(entry.quantity, Number(product.stock));
        if (quantity !== entry.quantity) {
            changed = true;
        }
        kept.push({ productId: entry.productId, quantity });
        hydrated.push({
            product,
            quantity,
            lineTotal: Number(product.price) * quantity,
        });
    });

    if (changed) {
        setItems(session, kept);
    }
    return hydrated;
};

/**
 * Sums the line totals of hydrated entries.
 *
 * @param {Array<{lineTotal: number}>} entries Result of {@link hydrate}.
 * @returns {number} Subtotal.
 */
const getSubtotal = (entries) => (entries || []).reduce((sum, entry) => sum + entry.lineTotal, 0);

module.exports = {
    DEFAULT_MAX_QUANTITY,
    clampQuantity,
    getItems,
    setItems,
    count,
    addItem,
    setQuantity,
    removeItem,
    clear,
    hydrate,
    getSubtotal,
};
