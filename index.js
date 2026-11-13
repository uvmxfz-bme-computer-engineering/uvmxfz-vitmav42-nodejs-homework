const favicon    = require("serve-favicon");
const path       = require("node:path");
const fs         = require("node:fs");
const logger     = require("morgan");
const express    = require("express");
const session    = require("express-session");
const bodyParser = require("body-parser");

/**
 * Application entry point for the PC Components Shop API.
 *
 * Creates the Express application, registers application routes, serves
 * ejs templates, and starts the HTTP server on port 3000.
 *
 * @module index
 */
const isProd = process.env.NODE_ENV === "production";

const app = express();
const port = process.env.PORT || 3000;

// Serve uploaded files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));
//

// Favicon middleware
app.use(favicon(path.join(__dirname, "public", "icons", "favicon.ico")));
//

// Logging middleware
app.use(logger(isProd ? "combined" : "dev"));
//

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//

// set up session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supasecret",
    cookie: { secure: isProd, maxAge: 1000 * 60 * 60 * 24 }, // HTTPS-only in prod
    resave: false,
    saveUninitialized: false,
  }),
);
//

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
const subscribeToRoutes = require("./routing");
subscribeToRoutes(app);
//

// serve views files from the "views" directory
app.set("view engine", "ejs");
//

// start the server
app.listen(port, function startServer() {
  console.log("Server running at http://localhost:" + port);
});
//