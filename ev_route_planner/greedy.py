"""Greedy Best-First Search: orders the frontier by heuristic only (not optimal)."""
import heapq
from itertools import count

from .graph import get_neighbors, heuristic, path_cost, reconstruct_path


def greedy(start, goal):
    """Return (path, total_distance, nodes_explored); path is None if no route."""
    tie = count()
    frontier = [(heuristic(start, goal), next(tie), start)]
    parents = {start: None}
    visited = set()
    explored = 0
    while frontier:
        _, _, node = heapq.heappop(frontier)
        if node in visited:
            continue
        visited.add(node)
        explored += 1
        if node == goal:
            path = reconstruct_path(parents, goal)
            return path, path_cost(path), explored
        for nxt in get_neighbors(node):
            if nxt not in visited and nxt not in parents:
                parents[nxt] = node
                heapq.heappush(frontier, (heuristic(nxt, goal), next(tie), nxt))
    return None, 0, explored
