# AncientWhiteArmyVets RPG Tools (v2020.2)

Static, no-build **Dungeons & Dragons 5e** character helper tools (HTML/CSS/JS).

This repo can be used in two ways:

1. **Static UI only**: open/serve the HTML pages and everything runs in the browser.
2. **Full app (UI + API)**: run the included Node/Express server which serves the UI and exposes `/api/*` endpoints backed by MySQL.

## What this repo contains

- **Static web UI**: `Application/public/*`
  - Primary pages: `index.html`, `physical-stats.html`, `abilities.html`, `pregen-characters.html`
  - API base URL is same-origin: `window.location.origin + '/api'` (see `Application/public/lib/api.config.js`)
- **Node/Express server**: `Web-Server/src/index.js`
  - Serves the UI from `Application/public`
  - Serves the API under `/api/*`
- **Root entrypoint**: `index.js`
  - Delegates to `Web-Server/src/index.js` (useful for hosts that expect a root `index.js`)

## Prerequisites

### Static UI only

- Any modern browser (Chrome/Edge/Firefox)
- Optional but recommended: a local HTTP server to avoid `file://` restrictions
  - Python 3, or
  - Node.js (for `npx serve`)

### Full app (UI + API)

- Node.js **18+** (see `package.json` `engines.node`)
- npm (bundled with Node)
- MySQL 5.7/8.x (local install or XAMPP/MariaDB often works)

## Quick start

### Option A: run the static UI only

Serving over HTTP avoids `file://` restrictions and matches real hosting.

Python (Windows):

```bash
py -m http.server 8000
```

Python (macOS/Linux):

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000/`

Node alternative:

```bash
npx serve
```

Tip: if you want to serve the UI folder directly, run the server from `Application/public`.

### Option B: run the full app (recommended for API features)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your server env file:
   - Copy `Web-Server/.env.example` to `Web-Server/.env`
   - Update DB and JWT values as needed

3. Start the dev server (nodemon):

   ```bash
   npm run dev
   ```

4. Open the app in your browser:
   - `http://localhost:4001/` (default)
   - or `http://ancientwhitearmyvetsrpgtoolsv20202.localhost:4001/` (example dev URL)

## VS Code tasks

If you’re using VS Code, this repo includes tasks in `.vscode/tasks.json`:

- **Install & Dev (npm)**: runs `npm install` then `npm run dev`
- **Open in Browser**: opens `http://ancientwhitearmyvetsrpgtoolsv20202.localhost:4001/`

Run them via **Terminal → Run Task…**.

## Configuration

### Server port

The server listens on:

- `PORT` environment variable, otherwise **4001**.

Note: `Web-Server/.env.example` currently shows `PORT=3001`, but the server default is `4001`.

### Environment variables

The server loads `Web-Server/.env` (see `Web-Server/src/index.js`). Common variables:

- `PORT` – HTTP port for the Express app
- `LOG_LEVEL` – morgan log preset (e.g. `dev`)
- `NODE_ENV` – `development`, `test`, `production`

Database (defaults are chosen to work with many local MySQL/XAMPP setups):

- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_USER` / `DB_USERNAME` (default: `root`)
- `DB_PASS` / `DB_PASSWORD` (default: empty)
- `DB_DATABASE` / `DB_NAME` (default: `ancientwhitearmyvet`)

JWT secrets:

- `JWT_ACCESS_SECRET` (or `JWT_SECRET`)
- `JWT_REFRESH_SECRET`

## Database behavior

On startup, `Web-Server/src/db-config.js`:

- Creates the database (if missing): `CREATE DATABASE IF NOT EXISTS <DB_DATABASE>`
- Creates tables:
  - `users`
  - `characters`

### Tasks table

The Tasks API expects a `tasks` table, but it is **not currently auto-created** during DB init.

You can create it manually using the schema in `Web-Server/src/queries/tasks.queries.js`:

```sql
CREATE TABLE IF NOT EXISTS tasks(
  task_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  task_name varchar(255) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
  status varchar(10) DEFAULT 'pending',
  PRIMARY KEY (task_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

## API overview

All API routes are served from the same origin as the UI.

### Auth (`/api/auth`)

- `POST /api/auth/register`
  - body: `{ "username": "...", "email": "...", "password": "..." }`
- `POST /api/auth/login`
  - body: `{ "username": "...", "password": "..." }`
  - returns: `access_token` and `refresh_token`
- `POST /api/auth/token`
  - body: `{ "token": "<refresh_token>" }`
- `POST /api/auth/logout`
  - body: `{ "token": "<refresh_token>" }`

### Authenticated requests

Protected endpoints use `Web-Server/src/middleware/auth.middleware.js`.

Send your access token as:

- `Authorization: Bearer <access_token>`

### User (`/api/user`)

- `GET /api/user/me`
- `PUT /api/user/me/update`

### Tasks (`/api/tasks`)

- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:taskId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

### Characters (`/api/characters`)

- `GET /api/characters`
- `POST /api/characters`
- `GET /api/characters/:characterId`
- `PUT /api/characters/:characterId`
- `DELETE /api/characters/:characterId`

## Running tests

`npm test` runs Mocha tests under `Web-Server/tests/*`.

Some tests are **integration/opt-in** and require env vars:

- `RUN_INTEGRATION=1` – enables integration tests
- `API_BASE_URL` – e.g. `http://localhost:4001`
- `TEST_ACCESS_TOKEN` – access token string (with or without the `Bearer ` prefix)

### Example (PowerShell)

```powershell
$env:RUN_INTEGRATION = "1"
$env:API_BASE_URL = "http://localhost:4001"
$env:TEST_ACCESS_TOKEN = "Bearer <paste-access-token>"

npm test
```

### Example (cmd.exe)

```bat
set RUN_INTEGRATION=1
set API_BASE_URL=http://localhost:4001
set TEST_ACCESS_TOKEN=Bearer <paste-access-token>

npm test
```

## Production notes

This app is designed to serve **UI + API from the same Express process** (static files + `/api/*`). That makes production deployment straightforward: put the Node process behind a reverse proxy (recommended) and expose a single origin.

### Environment + secrets

- Prefer setting environment variables in your hosting platform (or systemd service) instead of relying on a checked-in `.env` file.
- Set **strong, unique** JWT secrets in production:
  - `JWT_ACCESS_SECRET` (or `JWT_SECRET`)
  - `JWT_REFRESH_SECRET`

Important behavior note: refresh tokens are stored **in-memory** (`refreshTokens` array in `Web-Server/src/utils/jwt-helpers.js`). If you restart the process (or run multiple instances), previously issued refresh tokens will no longer be recognized.

### Ports, binding, and reverse proxy

- The server listens on `PORT` (default `4001`). In production, it’s common to run Node on an internal port and have Nginx/Apache/Caddy terminate TLS on `443` and proxy to Node.
- You can control which interface the server binds to with:
  - `HOST` or `BIND_HOST`

Typical setups:

- **Behind a reverse proxy on the same machine**: set `HOST=127.0.0.1` so Node is not directly exposed.
- **Container / VM with direct exposure**: set `HOST=0.0.0.0` so the process listens on all interfaces.

### Database in production

- Ensure MySQL credentials are provided via env vars (`DB_HOST`, `DB_USER`, `DB_PASS`, etc.).
- On startup, the app will attempt to create the database (if missing) and create the `users` + `characters` tables.
- The `tasks` table is **not auto-created** during startup; create it ahead of time if you use the Tasks feature.

### Logging

- HTTP request logging uses `morgan` and `LOG_LEVEL` (default `dev`).
- Ensure your production host captures stdout/stderr (Docker logs, systemd journal, PaaS logs, etc.).

### Process management

- In production, use a process manager or supervisor (systemd, PM2, Docker, your PaaS) so the server restarts on crashes and runs on boot.
- Use `npm run start` for production (not `npm run dev`).

## Troubleshooting

- **Browser shows “Index of /”**: you’re likely hitting the wrong port. Default is **4001**.
- **401 Access Denied**: ensure `Authorization: Bearer <access_token>` is sent.
- **DB init failed**: verify MySQL is running and `Web-Server/.env` matches your local credentials.

## Credits / License

Copyright © 2020 Frank Jamison.

This repository is a personal toolset for tabletop RPG character creation assistance.
