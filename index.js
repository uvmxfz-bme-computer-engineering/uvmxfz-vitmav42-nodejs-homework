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
const port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded and application/json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
// translations
const i18next = require('i18next');
const i18nextMW = require('i18next-http-middleware');
const i18nextFSB = require('i18next-fs-backend');
const path = require('path');
i18next.use(i18nextFSB).use(i18nextMW.LanguageDetector).init({
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json'),
  },
  fallbackLng: 'en',
  preload: ['en', 'hu'],
})
.then(() => console.log('i18next initialized'))
.catch(err => console.error('i18next initialization failed', err));
app.use(i18nextMW.handle(i18next));
*/

// subscribe middlewares
const subscribeToRoutes = require('./routing/routing');
subscribeToRoutes(app);

// serve views files from the "views" directory
app.set('view engine', 'ejs');

// start the server
app.listen(port, function startServer() {
  console.log('Server running at http://localhost:' + port);
});