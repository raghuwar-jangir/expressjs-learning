# Express.js Playbook

### Everything I learnt building RequestLens — architecture, patterns, tricks, and reasons.

> Read this once before starting any new Express.js project.

---

## 📁 Recommended Folder Structure

```
project-root/
│
├── src/
│   ├── app.js                  # Express app setup — middlewares, routes wired here
│   ├── server.js               # ONLY job: call app.listen()
│   │
│   ├── routes/
│   │   └── logs.router.js      # Maps URL + method → controller function
│   │
│   ├── controllers/
│   │   └── logs.controller.js  # Handles HTTP — reads req, calls store, sends res
│   │
│   ├── middlewares/
│   │   ├── requestTimer.js     # Custom middleware — stamps response time
│   │   ├── validateLogBody.js  # Validates request body before hitting controller
│   │   └── errorHandler.js     # Global error catcher — always 4 params
│   │
│   ├── store/                  # Swappable data layer (in-memory → DB later)
│   │   └── logs.store.js
│   │
│   └── logs/
│       └── access.log          # Morgan writes here via fs write stream
│
├── public/
│   └── index.html              # Static landing page served by express.static
│
├── .env                        # Local dev only — never commit
├── .gitignore                  # Must include: node_modules, .env, logs/
└── package.json
```

**Why `server.js` is separate from `app.js`?**
In testing, you import `app` without actually starting the server.
`server.js` starts the server. `app.js` defines it. Clean boundary.

---

## ⚡ Correct Middleware Order in `app.js`

Order matters — Express runs middleware top to bottom for every request.

```js
// ✅ CORRECT ORDER
app.use(morgan("dev"));              // 1. Log everything first
app.use(morgan("tiny", { stream })); // 2. File stream logger
app.use(express.static(...));        // 3. Serve static files (after loggers, so they get logged)
app.use(express.json());             // 4. Parse body before routes need it
app.use(requestTimer);               // 5. Timer AFTER body parse — measure route logic only
app.get("/health", ...);             // 6. Routes
app.use("/logs", logsRouter);        // 7. Router mounts
app.use((req, res, next) => { ... }) // 8. 404 catcher — AFTER all routes
app.use(errorHandler);               // 9. Error handler — ALWAYS last
```

**Why this order?**

- Morgan before static → static file requests get logged too
- `express.json()` before routes → `req.body` is available in controllers
- `requestTimer` after `express.json()` → timer measures only your route logic, not body parsing
- 404 catcher after all routes → only fires if no route matched
- `errorHandler` last → catches all `next(err)` calls from anywhere above

---

## 🏗️ Separation of Concerns — The Core Architecture

```
Request → Router → Controller → Store
```

Each layer has ONE job and knows nothing about the others:

| Layer      | File                 | Job                    | Knows about          |
| ---------- | -------------------- | ---------------------- | -------------------- |
| Router     | `logs.router.js`     | Maps URL → controller  | URLs, HTTP methods   |
| Controller | `logs.controller.js` | Handles HTTP           | `req`, `res`, `next` |
| Store      | `logs.store.js`      | Manages data           | Arrays, objects      |
| Middleware | `middlewares/`       | Cross-cutting concerns | `req`, `res`, `next` |

**Why this matters:**
Tomorrow if you swap in-memory array for PostgreSQL — you only change `store.js`.
Controller stays untouched because it doesn't care where data lives.

```js
// ✅ controller — only knows HTTP
const createLog = (req, res) => {
  const log = addLog(req.body); // calls store, doesn't care HOW it stores
  res.status(201).json(log);
};

// ✅ store — only knows data, zero HTTP
const addLog = (data) => {
  const log = { id: ++nextId, ...data, createdAt: new Date().toISOString() };
  logs.push(log);
  return log;
};
```

---

## ❌ Anti-Patterns to Avoid

### 1. Middleware logic inside router file

```js
// ❌ anti-pattern — mixed responsibilities
// logs.router.js
const validate = (req, res, next) => { ... } // validation logic here
router.post("/", validate, controller.create);

// ✅ correct — extract to its own file
// middlewares/validateLogBody.js
const { validateLogBody } = require("../middlewares/validateLogBody");
router.post("/", validateLogBody, controller.create);
```

### 2. Using `body-parser` package

```js
// ❌ outdated — body-parser is a separate deprecated package
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// ✅ modern — express has it built in since Express 4.16+
app.use(express.json());
```

### 3. Using `errorhandler` npm package

```js
// ❌ exposes full stack traces to client — dangerous in production
app.use(require("errorhandler")());

// ✅ write your own — clean JSON, controlled output
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});
```

### 4. Hardcoded PORT

```js
// ❌ hardcoded
app.listen(3000);

// ✅ from environment
app.listen(process.env.PORT);
```

### 5. Data existence check in middleware

```js
// ❌ wasteful — hits store twice (middleware + controller)
app.use(checkLogExists); // middleware fetches log
controller.deleteLog; // controller fetches log again

// ✅ check in controller — one fetch, handle both cases
const remove = (req, res, next) => {
  const log = deleteLog(+req.params.id);
  if (!log) return next(new Error("Not found")); // 404
  res.status(200).json(log);
};
```

**Exception:** When multiple routes share the same existence check (e.g., `GET /users/:id/posts`, `POST /users/:id/posts` — both need "does user exist?") — middleware makes sense there.

---

## 🔧 `.env` — How It Actually Works

```
.env file values are NOT automatically loaded into process.env.
dotenv package reads .env and injects them into process.env.
```

```js
// server.js — must be FIRST line before anything else
require("dotenv").config();
```

**Where `.env` goes in production:**

- It **doesn't** — never upload `.env` to a server
- AWS → Environment Variables in EC2/ECS config
- Railway/Render → their dashboard "Environment Variables" section
- Docker → `--env-file` flag or `docker-compose.yml`

**Why `path.join(__dirname, '../public')` vs `'./public'`:**

- `process.cwd()` = where you ran the command from in terminal
- `__dirname` = always the actual file's location on disk
- `'./public'` breaks if you run from a different folder
- `__dirname` version is bulletproof — works from anywhere

**Always run via npm scripts:**

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

`npm run dev` always runs from project root (directory of package.json) → `process.cwd()` = root → `.env` always loads. ✅

---

## 🚨 Error Handling — The Right Pattern

### In controllers — pass errors to next()

```js
const findOne = (req, res, next) => {
  const log = getLogById(+req.params.id);
  if (!log) {
    const err = new Error("Log not found");
    err.status = 404;
    return next(err); // ✅ pass to global error handler
  }
  res.status(200).json(log);
};
```

### Global error handler — always 4 params

```js
// ❌ 3 params — Express won't treat as error middleware
app.use((err, req, res) => {});

// ✅ 4 params — mandatory, Express identifies error middleware by this
app.use((err, req, res, next) => {
  const code = err.status || 500;
  res.status(code).json({ error: err.message, status: code });
});
```

### 404 for unknown routes

```js
// Add AFTER all routes, BEFORE errorHandler
app.use((req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.path} not found`);
  err.status = 404;
  next(err);
});
```

Without this, unknown routes return ugly HTML from Express — never acceptable in an API.

---

## 🐛 `deleteLog` — The Silent `-1` Bug

```js
// ❌ dangerous — if id doesn't exist, index = -1
// splice(-1) silently deletes the LAST element in array
const deleteLog = (id) => {
  const index = logs.findIndex((log) => log.id === id);
  logs.splice(index, 1); // 💥 if index = -1, deletes last log
};

// ✅ always guard against -1
const deleteLog = (id) => {
  const index = logs.findIndex((log) => log.id === id);
  if (index === -1) return null; // signal to controller: not found
  const deleted = logs[index];
  logs.splice(index, 1);
  return deleted; // controller needs this to send back to client
};
```

---

## 🐒 Monkey Patching — Wrapping Functions

Used in `requestTimer` to set headers before `res.send()` fires:

```js
const requestTimer = (req, res, next) => {
  const start = Date.now();

  const originalSend = res.send.bind(res);
  res.send = (...args) => {
    res.setHeader("X-Response-Time", `${Date.now() - start}ms`); // ✅ before send
    return originalSend(...args); // then actually send
  };

  next();
};
```

**Why not `res.on('finish')`?**
`finish` fires after the response is handed to the OS — headers are locked by then.
`ERR_HTTP_HEADERS_SENT` is thrown if you try to set headers here.

**Where else monkey patching is used:**

- Logging libraries wrapping `console.log`
- APM tools like Datadog wrapping HTTP calls to measure latency
- Test mocks wrapping functions to spy on calls

---

## 🔗 Nested Routers + router.param

### mergeParams: true

When nesting routers, child router cannot access parent router's
route parameters by default — they are undefined.
`mergeParams: true` tells Express to merge parent params into child's
`req.params` so child router has access to all parameters in the full path.

​```js
// ❌ without mergeParams — req.params.logId is undefined in tagsRouter
const tagsRouter = express.Router();

// ✅ with mergeParams — req.params.logId available in tagsRouter
const tagsRouter = express.Router({ mergeParams: true });
​```

### router.param

A special middleware that intercepts ALL requests on that router
containing a specific parameter name. Fires before any route handler.

Main use case:

- Find resource existence once
- Attach found item to `req` (e.g. `req.log`)
- Pass forward via `next()` — or return early with 404 if not found
- Eliminates repeated existence checks across multiple route handlers

​`js
logsRouter.param("logId", (req, res, next, logId) => {
  const log = getLogById(+logId);
  if (!log) {
    const err = new Error("Log not found");
    err.status = 404;
    return next(err); // exit early — child controllers never run
  }
  req.log = log; // attach — child controllers just use req.log
  next();
});
​`

### Why param middleware on parent router, not child?

Parent router's direct routes (GET /logs/:id, DELETE /logs/:id)
handle their own existence checks inside their controllers —
they are self-contained.

Child router (tagsRouter) needs existence check on EVERY route —
`findAllTags`, `findOneTag`, `addTag` all need a valid log first.
Instead of repeating this in every tag controller, param middleware
on logsRouter does it once and passes `req.log` down.

This keeps routers loosely coupled:

- tagsRouter doesn't care HOW the log was fetched or validated
- It just trusts req.log is there — like a relay baton passed forward
- Tomorrow if store changes to PostgreSQL — tagsRouter doesn't change at all

### When to use param middleware vs controller existence check

| Scenario                                        | Where to check           |
| ----------------------------------------------- | ------------------------ |
| Only one route needs the resource               | Controller               |
| Multiple child router routes need same resource | `router.param` on parent |
| Resource belongs to parent router               | `router.param` on parent |

### The Relay Race Pattern

​`
Request → logsRouter.param (fetches + validates log, sets req.log)
                ↓
          tagsRouter (just uses req.log — no fetching, no validation)
                ↓
          tag controller (clean, no repeated logic)
​`

---

## 📛 Naming Conventions

| What                 | Convention                 | Example                                     |
| -------------------- | -------------------------- | ------------------------------------------- |
| Files                | `camelCase`                | `logs.store.js`, `requestTimer.js`          |
| Folders              | `camelCase`                | `middlewares/`, `controllers/`              |
| Variables            | `camelCase`                | `const logsRouter`, `const findAll`         |
| Middleware functions | descriptive verb+noun      | `validateLogBody`, `requestTimer`           |
| Controller functions | verb that describes action | `findAll`, `findOne`, `createLog`, `remove` |
| Router variable      | resource + Router          | `logsRouter`, `usersRouter`                 |

**Too generic = red flag in code reviews:**

```js
// ❌ too vague
const validate = ...
const handler = ...
const middleware = ...

// ✅ self-documenting
const validateLogBody = ...
const errorHandler = ...
const requestTimer = ...
```

---

## 🌐 HTTP Status Codes — Quick Reference

| Code  | When to use                                                |
| ----- | ---------------------------------------------------------- |
| `200` | Successful GET, successful DELETE (with body)              |
| `201` | Successful POST — resource created                         |
| `204` | Successful DELETE — no body (body is ignored by HTTP spec) |
| `400` | Bad request — missing/invalid body                         |
| `404` | Resource not found                                         |
| `500` | Unexpected server error — fallback                         |

**`204` gotcha:** Never send a body with `204` — HTTP spec ignores it. Either use `200` with the deleted resource, or `204` with no body.

---

## 🔁 Morgan — Dual Logging Pattern

```js
// Log to console — for dev visibility
app.use(morgan("dev"));

// Log to file — for persistent records
app.use(
  morgan("tiny", {
    stream: fs.createWriteStream(
      path.join(__dirname, "logs", "access.log"),
      { flags: "a" }, // "a" = append, not overwrite
    ),
  }),
);
```

**Why two separate `app.use()` calls?**
Morgan doesn't know there are two instances — Express runs both independently for every request. First prints to terminal, second writes to file.

**Why file logs matter:**
If your server crashes, terminal output is gone. File survives. This is how teams debug production incidents after the fact.

---

## 📦 Packages — Use vs Avoid

| Package        | Verdict                | Reason                                     |
| -------------- | ---------------------- | ------------------------------------------ |
| `express`      | ✅ use                 | Core framework                             |
| `morgan`       | ✅ use                 | Industry standard HTTP logger              |
| `dotenv`       | ✅ use                 | `.env` loading                             |
| `nodemon`      | ✅ use (devDependency) | Auto-restart in dev                        |
| `body-parser`  | ❌ avoid               | Deprecated — use `express.json()` built-in |
| `errorhandler` | ❌ avoid               | Exposes stack traces — write your own      |

---

## ✅ Pre-flight Checklist — Before Every New Express Project

- [ ] `server.js` separate from `app.js`
- [ ] `.env` in root, `dotenv` loaded as first line in `server.js`
- [ ] `.env` in `.gitignore`
- [ ] `npm run dev` script in `package.json`
- [ ] Morgan before `express.static`
- [ ] `express.json()` before routes
- [ ] Middlewares in `src/middlewares/` — not inside router files
- [ ] Controllers handle HTTP only — no data logic
- [ ] Store handles data only — no `req`/`res`
- [ ] All errors via `next(err)` — never inline `res.status(500)`
- [ ] Global error handler as last `app.use()`
- [ ] 404 catcher before error handler, after all routes
- [ ] No hardcoded ports
- [ ] Folder names: no typos (`middlewares` not `middlwares`)

---

_Built during RequestLens — Express.js practice project by Raghuwar_
