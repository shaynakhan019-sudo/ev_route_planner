"""Graph data and helper functions for the EV Route Planner.

Coordinates (x, y) are in km and are used ONLY for the heuristic.
Every edge distance is >= the straight-line distance between its endpoints,
so the heuristic is admissible and consistent: A* returns the optimal cost.
"""
import math

# node id -> (x, y, is_charging_station)
NODES = {
    "A": (0, 0, False),
    "B": (10, 0, False),
    "C": (20, 5, True),
    "D": (30, 0, False),
    "E": (5, 12, True),
    "F": (15, 14, True),
    "G": (25, 15, True),
    "H": (35, 12, False),
    "I": (0, 25, False),
    "J": (12, 28, False),
    "K": (22, 30, True),
    "L": (32, 27, False),
    "M": (42, 20, True),
    "N": (45, 5, False),
}

# (a, b, distance) - roads are undirected
EDGES = [
    ("A", "B", 10), ("A", "E", 13), ("B", "C", 12), ("B", "F", 16),
    ("B", "E", 14), ("C", "D", 12), ("C", "F", 11), ("C", "G", 12),
    ("D", "H", 14), ("D", "N", 17), ("E", "F", 11), ("E", "I", 15),
    ("F", "G", 11), ("F", "J", 15), ("G", "H", 11), ("G", "K", 16),
    ("H", "M", 11), ("H", "N", 13), ("H", "L", 16), ("I", "J", 13),
    ("J", "K", 11), ("K", "L", 11), ("L", "M", 13), ("M", "N", 16),
]

# adjacency: node -> {neighbor: distance}
ADJACENCY = {n: {} for n in NODES}
for _a, _b, _d in EDGES:
    ADJACENCY[_a][_b] = _d
    ADJACENCY[_b][_a] = _d


def get_locations():
    """All location ids, sorted."""
    return sorted(NODES)


def has_node(node):
    return node in NODES


def get_neighbors(node):
    """Neighbors of `node`, sorted for deterministic search order."""
    return sorted(ADJACENCY[node])


def get_edge_cost(a, b):
    """Distance of the direct edge a-b (KeyError if no such edge)."""
    return ADJACENCY[a][b]


def heuristic(node, goal):
    """Straight-line (Euclidean) distance estimate between two nodes."""
    x1, y1, _ = NODES[node]
    x2, y2, _ = NODES[goal]
    return math.hypot(x1 - x2, y1 - y2)


def path_cost(path):
    """Total distance along a list of nodes."""
    return sum(get_edge_cost(a, b) for a, b in zip(path, path[1:]))


def reconstruct_path(parents, goal):
    path = [goal]
    while parents[path[-1]] is not None:
        path.append(parents[path[-1]])
    return path[::-1]


def graph_to_json():
    """Graph in the shape required by GET /api/graph."""
    return {
        "nodes": [
            {"id": n, "label": n, "is_charging_station": NODES[n][2]}
            for n in sorted(NODES)
        ],
        "edges": [
            {"source": a, "target": b, "distance": d} for a, b, d in EDGES
        ],
    }
