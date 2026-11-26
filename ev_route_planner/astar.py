"""A* Search: orders the frontier by cost so far + heuristic (optimal)."""
import heapq
from itertools import count

from .graph import get_edge_cost, get_neighbors, heuristic, reconstruct_path


def astar(start, goal):
    """Return (path, total_distance, nodes_explored); path is None if no route."""
    tie = count()
    frontier = [(heuristic(start, goal), next(tie), 0, start)]
    parents = {start: None}
    best = {start: 0}
    closed = set()
    explored = 0
    while frontier:
        _, _, g, node = heapq.heappop(frontier)
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
                heapq.heappush(frontier, (ng + heuristic(nxt, goal), next(tie), ng, nxt))
    return None, 0, explored
