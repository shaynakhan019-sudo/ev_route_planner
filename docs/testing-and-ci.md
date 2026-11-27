# Testing, CI and Docker

## Backend tests (pytest)

Located in `tests/`. They are written against the API contract:

- `test_algorithms.py`: all four algorithms return valid paths for every pair of
  locations; UCS and A* match an independent Dijkstra reference (optimal cost);
  BFS uses the fewest hops; Greedy and BFS never beat the optimum.
- `test_api.py`: response shapes for the three endpoints; valid routes for each
  algorithm; errors for same start/end, unknown location, invalid algorithm,
  missing fields, non-JSON body and wrong types.

`tests/reference.py` builds its own graph model from `/api/graph`, so the tests
keep working if the graph data changes.

Not covered: the HTTP 404 "no route" case, because the sample graph is fully
connected. Add a test once a disconnected node exists.

## Frontend tests (Vitest + React Testing Library)

Located in `frontend/src/__tests__/`:

- `api.test.ts`: the fetch helpers with `fetch` mocked (URLs, request body, error handling).
- `ControlsPanel.test.tsx`: controls render, options listed, submit values, disabled while loading.
- `RouteMap.test.tsx`: loading state, error state, normal state.

The component tests need their import paths, prop names and label texts matched
to the real components. Each file marks this in an `ADAPT` comment at the top.

## CI (`.github/workflows/ci.yml`)

Runs on every push and pull request:

| Job | Steps |
|-----|-------|
| backend | install, `ruff check .`, `python -m pytest` |
| frontend | `npm ci`, `npm run lint`, `npx tsc -b`, `npm test`, `npm run build` |
| docker | `docker compose build` (after the other two pass) |

## Docker

- `ev_route_planner/Dockerfile`: Python 3.12 slim, serves with gunicorn on port 8000.
- `frontend/Dockerfile`: multi-stage; Node 20 builds the app, Nginx serves `dist/`.
- `frontend/nginx.conf`: serves the SPA and forwards `/api/` to the `backend` service.
- `docker-compose.yml`: starts the backend, waits for its health check, then starts the frontend on port 8080.
