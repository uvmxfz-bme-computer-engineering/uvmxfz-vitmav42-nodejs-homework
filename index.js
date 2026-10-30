/**
 * Application entry point for the PC Components Shop API.
 *
 * Creates the Express application, registers application routes, serves
 * ejs templates, and starts the HTTP server on port 3000.
 *
 * @module index
 */
const express = require('express');
const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded and application/json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// subscribe middlewares
const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);

// serve views files from the "views" directory
app.set('view engine', 'ejs');

// start the server
const server = app.listen(port, function startServer() {
  console.log('Server running at http://localhost:' + port);
});