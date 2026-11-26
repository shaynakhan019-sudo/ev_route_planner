# EV Route Planner

A web app that visualises electric-vehicle routes on a network of locations and
charging stations. Pick a start, a destination and a search algorithm (A*, UCS,
Greedy Best-First or BFS) and watch the route appear on the map.

| Part | Tech |
|------|------|
| Frontend (`frontend/`) | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide, React Flow, Framer Motion |
| Backend (`ev_route_planner/`) | Python 3.12, Flask, BFS / UCS / Greedy / A* |
| Tests | pytest (backend), Vitest + React Testing Library (frontend) |
| DevOps | GitHub Actions, Docker, Docker Compose, Nginx |

## Quick start (Docker, one command)

```bash
docker compose up --build
```

Open <http://localhost:8080>. The API is also reachable at <http://localhost:8000/api/graph>.

## Quick start (local development)

Backend (terminal 1, from the repo root):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
python -m ev_route_planner.app          # http://localhost:8000
```

Frontend (terminal 2):

```bash
cd frontend
npm install
npm run dev                             # http://localhost:5173 (proxies /api to :8000)
```

## Running the tests

```bash
# backend (from the repo root, venv active)
python -m pytest -v

# frontend
cd frontend && npm test
```

Lint and type-check, exactly as CI runs them:

```bash
ruff check .                            # backend lint
cd frontend && npm run lint && npx tsc -b
```

## Production build

```bash
cd frontend
npm run build                           # outputs frontend/dist
```

`docker compose up --build` does this for you: the frontend image builds the app
and serves it with Nginx, which also forwards `/api` to the backend container.

## Documentation

- [docs/setup.md](docs/setup.md): installation, running, production build, troubleshooting
- [docs/api.md](docs/api.md): the API contract with examples
- [docs/structure.md](docs/structure.md): project structure and how the pieces fit together
- [docs/testing-and-ci.md](docs/testing-and-ci.md): tests, CI pipeline and Docker details
