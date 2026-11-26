"""Uniform-Cost Search: lowest total distance (optimal)."""
import heapq
from itertools import count

from .graph import get_edge_cost, get_neighbors, reconstruct_path


def ucs(start, goal):
    """Return (path, total_distance, nodes_explored); path is None if no route."""
    tie = count()
    frontier = [(0, next(tie), start)]
    parents = {start: None}
    best = {start: 0}
    closed = set()
    explored = 0
    while frontier:
        g, _, node = heapq.heappop(frontier)
        if node in closed:
            continue
        closed.add(node)
        explored += 1
        if node == goal:
            return reconstruct_path(parents, goal), g, explored
        for nxt in get_neighbors(node):
            ng = g + get_edge_cost(node, nxt)
            if nxt not in best or ng < best[nxt]:
                best[nxt] = ng
                parents[nxt] = node
                heapq.heappush(frontier, (ng, next(tie), nxt))
    return None, 0, explored
