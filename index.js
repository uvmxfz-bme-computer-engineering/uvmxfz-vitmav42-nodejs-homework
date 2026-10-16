/**
 * Application entry point for the PC Components Shop API.
 *
 * Creates the Express application, registers application routes, serves
 * static files, and starts the HTTP server on port 3000.
 *
 * @module index
 */
const express = require('express');
const app = express();
const port = 3000;

// subscribe middlewares
const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);

// serve static files from the "static" directory
app.use(express.static('static'));

// start the server
const server = app.listen(port, function startServer() {
  console.log('Server running at http://localhost:' + port);
});