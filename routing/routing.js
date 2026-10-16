/**
 * Route registration for product, category, and order resources.
 *
 * @module routing
 */
const path = require('path');
const mwPath = path.join(__dirname, '..', 'middlewares');

///////////////////////////////////////////////////////////////////////////////
// Auth Middlewares
const auth_authorize = require(path.join(mwPath, 'auth'));
// Product Middlewares
const product_createOne = require(path.join(mwPath, 'product', 'createOne'));
const product_deleteOne = require(path.join(mwPath, 'product', 'deleteOne'));
const product_editOne   = require(path.join(mwPath, 'product', 'editOne'));
const product_readAll   = require(path.join(mwPath, 'product', 'readAll'));
const product_readOne   = require(path.join(mwPath, 'product', 'readOne'));
// Category Middlewares
const category_createOne = require(path.join(mwPath, 'category', 'createOne'));
const category_deleteOne = require(path.join(mwPath, 'category', 'deleteOne'));
const category_editOne   = require(path.join(mwPath, 'category', 'editOne'));
const category_readAll   = require(path.join(mwPath, 'category', 'readAll'));
const category_readOne   = require(path.join(mwPath, 'category', 'readOne'));
// Order Middlewares
const order_createOne = require(path.join(mwPath, 'order', 'createOne'));
const order_deleteOne = require(path.join(mwPath, 'order', 'deleteOne'));
const order_editOne   = require(path.join(mwPath, 'order', 'editOne'));
const order_readAll   = require(path.join(mwPath, 'order', 'readAll'));
const order_readOne   = require(path.join(mwPath, 'order', 'readOne'));
///////////////////////////////////////////////////////////////////////////////

/**
 * Registers all application routes on the Express application.
 *
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeToRoutes = (app) => {
    const objects = {};

    subscribeProductMiddlewares(objects, app);
    subscribeCategoryMiddlewares(objects, app);
    subscribeOrderMiddlewares(objects, app);
}

/**
 * Registers product CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeProductMiddlewares = (objects, app) => {
    app.get('/product/create', auth_authorize(objects), product_createOne(objects));
    app.get('/product/delete/:id', auth_authorize(objects), product_deleteOne(objects));
    app.get('/product/edit/:id', auth_authorize(objects), product_editOne(objects));
    app.get('/product/read/all', product_readAll(objects));
    app.get('/product/read/:id', product_readOne(objects));
}

/**
 * Registers category CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeCategoryMiddlewares = (objects, app) => {
    app.get('/category/create', auth_authorize(objects), category_createOne(objects));
    app.get('/category/delete/:id', auth_authorize(objects), category_deleteOne(objects));
    app.get('/category/edit/:id', auth_authorize(objects), category_editOne(objects));
    app.get('/category/read/all', category_readAll(objects));
    app.get('/category/read/:id', category_readOne(objects));
}

/**
 * Registers order CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeOrderMiddlewares = (objects, app) => {
    app.get('/order/create', order_createOne(objects));
    app.get('/order/delete/:id', order_deleteOne(objects));
    app.get('/order/edit/:id', order_editOne(objects));
    app.get('/order/read/all', order_readAll(objects));
    app.get('/order/read/:id', order_readOne(objects));
}

module.exports = subscribeToRoutes;