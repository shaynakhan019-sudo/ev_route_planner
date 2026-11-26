# Setup

## Prerequisites

- Python 3.12 or newer
- Node.js 20 or newer
- Docker Desktop (only needed for the Docker route)

## Backend

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
python -m ev_route_planner.app
```

The API now listens on `http://localhost:8000`. Always run the command from the
repository root (the folder that *contains* `ev_route_planner/`), and use
`python -m ...`, not `python app.py`, because the code uses package imports.

Quick check:

```bash
curl http://localhost:8000/api/graph
curl -X POST http://localhost:8000/api/route \
  -H "Content-Type: application/json" \
  -d '{"start":"A","end":"N","algorithm":"astar"}'
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies every `/api` request to
`http://localhost:8000`, so start the backend first.

## Tests

| What | Command |
|------|---------|
| Backend | `python -m pytest -v` (repo root) |
| Frontend | `cd frontend && npm test` |
| Frontend (watch mode) | `cd frontend && npm run test:watch` |

### One-time frontend test setup

Add the test tools and scripts to `frontend/`:

```bash
cd frontend
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

In `frontend/package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

`vitest.config.ts` and `src/test/setup.ts` are already provided.

## Production build

```bash
cd frontend
npm run build      # type-checks, then writes static files to frontend/dist
npm run preview    # optional: serve the build locally to check it
```

## Docker

```bash
docker compose up --build        # start both services
docker compose down              # stop and remove them
```

| Service | URL |
|---------|-----|
| App (Nginx + built frontend) | http://localhost:8080 |
| API (gunicorn) | http://localhost:8000 |

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `command not found: python` / `pip` (macOS) | Use `python3` / `pip3`, or activate the venv first |
| `No module named ev_route_planner.app` | You are in the wrong folder, or the files are not inside `ev_route_planner/` |
| `curl: (7) Failed to connect` | The backend is not running; start it in its own terminal and leave it open |
| Frontend shows a network error | Start the backend first (port 8000) |
| `Address already in use` | Another program uses the port; stop it or change the port |
| `npm ci` fails in CI | Commit `frontend/package-lock.json` |
