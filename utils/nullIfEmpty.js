/**
 * Normalizes a submitted form value to `null` when it is absent or blank.
 *
 * Strings are trimmed, so whitespace-only input counts as empty. Non-string
 * values (numbers, arrays, ...) are returned unchanged.
 *
 * @param {*} value Raw request value.
 * @returns {*} Trimmed non-empty string, the original value, or null.
 */
module.exports = (value) => {
    if (value === undefined || value === null) {
        return null;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? null : trimmed;
    }

    return value;
};
