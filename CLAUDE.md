# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

PC Components Shop — a homework project for the vitmav42 course. Express 5 + EJS web app in CommonJS, no database: data is hardcoded/in-memory. UI is Bootstrap 5.3 loaded from a CDN.

3.Adatmodell és Entitások
3.1. Termék
- A webshopban szereplő alkatrészek adatait tárolja.
- Főbb mezői:
  o name (String – az alkatrész neve)
  o category (String – kategória hivatkozás)
  o price (Number – egységár)
  o stock (Number – raktárkészlet)
  3.2. Kategória
- Az alkatrészek logikai csoportosítását segítő entitás (pl. Processzorok, Videokártyák, Memóriák), amely biztosítja a gyors szűrési
  lehetőségeket a katalógusban.
- Főbb mezői:
  o name (String – a kategória neve)
  3.3. Rendelés
- A vásárlók által leadott megrendeléseket reprezentálja.
- Főbb mezői:
  o customerEmail (String – a vásárló elérhetősége)
  o items (Array – a megrendelt termékek azonosítói és mennyiségei)
  o totalAmount (Number – a fizetendő végösszeg)
  o status (String – a rendelés aktuális állapota, pl. Függőben, Teljesítve)
  3.4. Kapcsolatok
  A rendelések laza vagy közvetlen hivatkozással (ObjectId) kapcsolódnak a termékekhez, biztosítva, hogy a kosárban szereplő elemek adatai
  lekérdezhetők legyenek a tranzakció során.

## Response style

Keep answers short and precise. Lead with the result. Skip restating the request, obvious steps, and background that doesn't change the answer.

Token-efficient output:
- No preamble, filler, or closing offers ("Sure", "Let me know if...").
- Prefer bullets or single lines over paragraphs.
- Never repeat code, file contents, or tool output the user can already see; point to `path:line` instead.
- One example or command is usually enough; don't enumerate every option.
- Report what changed and how it was verified; skip narration of the steps taken.
- Brevity must not cost correctness — stay unambiguous.

## Run

- Start the whole local stack with PM2: `npm run daemon:start` (runs `mongod` on port 27017 plus the app); `npm run daemon:stop` tears it down.
- Start only the local MongoDB server in the foreground: `npm run start:db` (data in `db/`, gitignored).
- Start the dev server: `npm run start:app` (`node --watch index.js`). Server listens on http://localhost:3000.
- The HTTP port defaults to 3000 and can be overridden with `PORT`; the app connects to `MONGODB_URI` (fallback `mongodb://localhost:<MONGO_PORT>/uvmxfz`).
- No build step and no linter. `npm test` runs `mocha --recursive`; there are no test files yet, so it exits 1 — validate changes by starting the server and requesting the affected routes.

## Architecture

- `index.js` — entry point. Creates the Express app, registers `body-parser` (urlencoded + json), sets EJS as the view engine, delegates route registration to `routing/routing.js`, starts the server.
- `routing/routing.js` — the single place where every route is registered. It creates one shared `objects = {}` bag and passes it to every middleware factory; then registers page routes (`/`, `/cart`, `/orders`, `/admin`) plus the product/category/order CRUD routes.
- `middlewares/<resource>/<action>.js` — one factory per action: `createOne`, `readAll`, `readOne`, `editOne`, `deleteOne`. Each file exports `(objects) => async (req, res, next) => { ... }`. Always export the factory — never the handler directly.
- `middlewares/render.js` — factory `(objects, view)` returning middleware that calls `res.render(view, res.locals)`.
- `middlewares/auth.js` — authorization factory for protected routes. The session/admin checks are commented out, so it currently just calls `next()`.
- `views/*.ejs` — pages (`index`, `cart`, `orders`, `admin`, `auth`) and shared partials (`header`, `footer`, `sidebar`). Middleware populates `res.locals` before `render` uses it.

## Conventions

- Keep the JSDoc header at the top of every module — every source file follows this style.
- Add resource behavior as a new middleware factory in `middlewares/<resource>/`, then wire it in `routing/routing.js` (import it, add the route inside the matching `subscribe*Middlewares` function).
- Pass shared state/data through the `objects` bag rather than module-level globals.
- Routes are GET-only. "Create/edit/delete" are GET paths (`/product/create`, `/product/edit/:id`, ...), not REST verbs.
- Use 4-space indentation in JS; match the surrounding file in views (some templates use tabs).
- Reuse EJS partials via `<%- include(...) %>` instead of duplicating markup.

## Current state (hw04)

- `product/readAll` returns a hardcoded fixture list and filters by `?category=` (case-insensitive, keeps only `stock > 0` and `price > 0`).
- `product/readOne`, all category/order middlewares, and every create/edit/delete middleware are no-op stubs that just call `next()`.
- `admin.ejs` and `orders.ejs` contain hardcoded demo rows; their client-side JS only updates the DOM (no backend calls).
- There is no persistence layer. Adding one means introducing a model/service and passing it through the `objects` bag.

## Git

- Work happens on per-homework branches (current: `04`).
- Commit messages follow the existing pattern, e.g. `hw04 - 1st submission`.
- `.github/git-commit-instructions.md` asks for concise, direct responses and a brief note on what changed plus validation performed.
