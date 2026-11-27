# API Contract

Base URL: `http://localhost:8000` (the frontend calls the same paths through
the Vite proxy or Nginx). All responses are JSON.

## GET /api/locations

```json
{ "locations": ["A", "B", "C"] }
```

## GET /api/graph

```json
{
  "nodes": [ { "id": "A", "label": "A", "is_charging_station": false } ],
  "edges": [ { "source": "A", "target": "B", "distance": 10 } ]
}
```

Roads are undirected: an edge `A -> B` can be driven in both directions.

## POST /api/route

Request body:

```json
{ "start": "A", "end": "D", "algorithm": "astar" }
```

`algorithm` is one of `"astar"`, `"bfs"`, `"ucs"`, `"greedy"`.

Success (HTTP 200):

```json
{ "path": ["A", "B", "D"], "total_distance": 25, "nodes_explored": 4, "algorithm": "astar" }
```

Errors:

```json
{ "error": "message" }
```

| Status | When |
|--------|------|
| 400 | Bad input: missing or non-string field, unknown location, `start` equals `end`, invalid algorithm, body is not a JSON object |
| 404 | No route exists between the two locations |

## Algorithms

| Algorithm | Strategy | Optimal distance? |
|-----------|----------|-------------------|
| `bfs` | Fewest hops | No |
| `ucs` | Lowest total distance so far | Yes |
| `greedy` | Heuristic only (straight-line distance to goal) | No |
| `astar` | Distance so far + heuristic | Yes (heuristic never overestimates) |

`nodes_explored` counts the nodes taken from the search frontier and expanded,
and is comparable across algorithms.
