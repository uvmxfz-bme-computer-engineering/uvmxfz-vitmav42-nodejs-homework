/**
 * Route registration for product, category, and order resources.
 *
 * @module routing
 */
const path = require('node:path');
const mwPath = path.join(__dirname, 'middlewares');

///////////////////////////////////////////////////////////////////////////////
// Validation Middlewares
const validateObjectId = require(path.join(mwPath, 'validateObjectId'));
// View Middlewares
const render = require(path.join(mwPath, 'render'));
// Handler Middlewares
const handle_error = require(path.join(mwPath, 'handlers', 'error'));
const handle_notFound = require(path.join(mwPath, 'handlers', 'notFound'));
// Auth Middlewares
const auth_authorize = require(path.join(mwPath, 'auth'));
// Product Middlewares
const product_createOne       = require(path.join(mwPath, 'product', 'createOne'));
const product_deleteOne       = require(path.join(mwPath, 'product', 'deleteOne'));
const product_editOne         = require(path.join(mwPath, 'product', 'editOne'));
const product_readAll         = require(path.join(mwPath, 'product', 'readAll'));
const product_readOne         = require(path.join(mwPath, 'product', 'readOne'));
const product_upload          = require(path.join(mwPath, 'product', 'upload'));
const product_retireOne       = require(path.join(mwPath, 'product', 'retireOne'));
const product_readAllFiltered = require(path.join(mwPath, 'product', 'readAllFiltered'));
// Category Middlewares
const category_createOne = require(path.join(mwPath, 'category', 'createOne'));
const category_deleteOne = require(path.join(mwPath, 'category', 'deleteOne'));
const category_editOne   = require(path.join(mwPath, 'category', 'editOne'));
const category_readAll   = require(path.join(mwPath, 'category', 'readAll'));
const category_readOne   = require(path.join(mwPath, 'category', 'readOne'));
// Cart Middlewares
const cart_createOne   = require(path.join(mwPath, 'cart', 'createOne'));
const cart_deleteOne   = require(path.join(mwPath, "cart", "deleteOne"));
const cart_readAll     = require(path.join(mwPath, "cart", "readAll"));
const cart_readCount   = require(path.join(mwPath, "cart", "readCount"));
const cart_clear       = require(path.join(mwPath, 'cart', 'clear'));
const cart_setQuantity = require(path.join(mwPath, 'cart', 'setQuantity'));
// Order Middlewares
const order_createOne = require(path.join(mwPath, 'order', 'createOne'));
const order_deleteOne = require(path.join(mwPath, 'order', 'deleteOne'));
const order_editOne   = require(path.join(mwPath, 'order', 'editOne'));
const order_readAll   = require(path.join(mwPath, 'order', 'readAll'));
const order_readOne   = require(path.join(mwPath, 'order', 'readOne'));
const order_readForCustomer = require(path.join(mwPath, 'order', 'readForCustomer'));
///////////////////////////////////////////////////////////////////////////////

/**
 * Registers all application routes on the Express application.
 *
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeToRoutes = (app) => {
    const objects = {
        ProductModel:   require('./models/product'),
        CategoryModel:  require('./models/category'),
        OrderModel:     require('./models/order'),
        statuses:       require('./models/statuses'),
    };

    // Middleware to make statuses available in all views
    app.use((req, res, next) => {
        res.locals.statuses = objects.statuses;
        next();
    });
    //

    // Middleware to make cart count available in all views
    app.use(cart_readCount(objects));
    //

    // Register resource-specific routes
    subscribeProductMiddlewares(objects, app);
    subscribeCategoryMiddlewares(objects, app);
    subscribeCartMiddlewares(objects, app);
    subscribeOrderMiddlewares(objects, app);
    //

    // Route to render the check orders page where customers can input their email to view their orders
    app.get("/check-orders", render(objects, "checkOrders"));
    //

    // Admin route to display all products, categories, and orders for management
    app.get(
        "/admin",
        auth_authorize(objects),
        product_readAll(objects),
        category_readAll(objects),
        order_readAll(objects),
        render(objects, "admin"),
    );
    //

    // Success route to display order confirmation after successful order placement
    app.get("/success", (req, res) => {
        res.render("success", { title: "Order Placed" });
    });
    //
    
    // Root route to display all products with optional filtering by category
    app.get( "/", product_readAllFiltered(objects), category_readAll(objects), render(objects, "index"), );
    //

    // Order routes for customers to check their orders by email
    app.get( '/orders', order_readForCustomer(objects), render(objects, 'orders') );
    //

    // POST route to handle the submission of the customer email for checking orders.
    app.post(
        '/check-orders', 
        (req, res, next) => {
            const customerEmail = req.body.customerEmail;
            if (!customerEmail) {
                return res.redirect('/check-orders');
            }
            req.customerEmail = customerEmail;
            next();
        },
        order_readForCustomer(objects),
        render(objects, 'orders')
    );
    //

    // Error handling middlewares
    app.use(handle_notFound);
    app.use(handle_error);
    //
}

/**
 * Registers product CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeProductMiddlewares = (objects, app) => {
    app.get('/product/create', auth_authorize(objects), category_readAll(objects), render(objects, 'product_create'));
    app.post('/product/create', auth_authorize(objects), product_upload(objects), product_createOne(objects));
    
    app.get('/product/delete/:id', auth_authorize(objects), validateObjectId, product_deleteOne(objects));
    app.get('/product/retire/:id', auth_authorize(objects), validateObjectId, product_retireOne(objects));

    app.get('/product/edit/:id', auth_authorize(objects), validateObjectId, category_readAll(objects), product_readOne(objects), render(objects, 'product_edit'));
    app.post('/product/edit/:id', auth_authorize(objects), validateObjectId, product_upload(objects), product_editOne(objects));
    
    app.get('/product/read/all', product_readAll(objects));
    app.get('/product/read/:id', validateObjectId, product_readOne(objects));
}

/**
 * Registers category CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeCategoryMiddlewares = (objects, app) => {
    app.get('/category/create', auth_authorize(objects), render(objects, 'category_create'));
    app.post('/category/create', auth_authorize(objects), category_createOne(objects));
    
    app.get('/category/delete/:id', auth_authorize(objects), validateObjectId, category_deleteOne(objects));
    
    app.get('/category/edit/:id', auth_authorize(objects), validateObjectId, category_readOne(objects), render(objects, 'category_edit'));
    app.post('/category/edit/:id', auth_authorize(objects), validateObjectId, category_editOne(objects));
    
    app.get('/category/read/all', category_readAll(objects));
    app.get('/category/read/:id', validateObjectId, category_readOne(objects));
}

/**
 * Registers order CRUD routes on the Express application.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeOrderMiddlewares = (objects, app) => {
    app.post('/order/create', order_createOne(objects));

    app.get('/order/delete/:id', auth_authorize(objects), validateObjectId, order_deleteOne(objects));
    
    app.get('/order/edit/:id', auth_authorize(objects), validateObjectId, order_readOne(objects), render(objects, 'order_edit'));
    app.post('/order/edit/:id', auth_authorize(objects), validateObjectId, order_editOne(objects));

    app.get('/order/read/all', order_readAll(objects));
    app.get('/order/read/:id', validateObjectId, order_readOne(objects));
}

/**
 * Registers cart routes on the Express application.
 *
 * The cart is stored in the session as `{ productId, quantity }` pairs and is
 * hydrated from the database on every render.
 *
 * @param {object} objects Shared models or services used by middleware.
 * @param {Object} app Express application instance.
 * @returns {void}
 */
const subscribeCartMiddlewares = (objects, app) => {
    app.get('/cart', cart_readAll(objects), render(objects, 'cart'));
    app.post('/cart/create/:id', validateObjectId, cart_createOne(objects));
    app.post('/cart/update/:id', validateObjectId, cart_setQuantity(objects));
    app.post('/cart/delete/:id', validateObjectId, cart_deleteOne(objects));
    app.post('/cart/clear', cart_clear(objects));
}

module.exports = subscribeToRoutes;