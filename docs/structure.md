# Project Structure

```
.
├── README.md
├── docker-compose.yml            # runs frontend + backend with one command
├── requirements-dev.txt          # backend + pytest + ruff
├── ruff.toml                     # backend lint rules
├── pytest.ini                    # pytest settings
├── .github/workflows/ci.yml      # CI: lint, tsc, tests, build
├── docs/                         # documentation
├── tests/                        # backend tests (pytest)
│   ├── conftest.py               # Flask test client + graph fixtures
│   ├── reference.py              # independent Dijkstra / BFS used as ground truth
│   ├── test_algorithms.py
│   └── test_api.py
├── ev_route_planner/             # backend (Flask)
│   ├── app.py                    # endpoints + validation
│   ├── graph.py                  # graph data, neighbours, heuristic
│   ├── bfs.py  ucs.py  greedy.py  astar.py
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/                     # React + TypeScript + Vite
    ├── src/
    │   ├── __tests__/            # Vitest tests
    │   └── test/setup.ts         # jsdom shims for React Flow / Radix
    ├── vitest.config.ts
    ├── nginx.conf                # serves the build and proxies /api
    └── Dockerfile                # build with Node, serve with Nginx
```

## How the pieces connect

```
Browser ──> Vite dev server :5173 ──/api──> Flask :8000        (development)
Browser ──> Nginx :8080 (container) ─/api─> Flask :8000 (gunicorn)   (Docker)
```

The frontend only talks to the three endpoints in [api.md](api.md), so the two
halves can be built and tested independently.
