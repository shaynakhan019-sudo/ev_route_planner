"""Breadth-First Search: fewest hops (ignores distances when searching)."""
from collections import deque

from .graph import get_neighbors, path_cost, reconstruct_path


def bfs(start, goal):
    """Return (path, total_distance, nodes_explored); path is None if no route."""
    frontier = deque([start])
    parents = {start: None}
    explored = 0
    while frontier:
        node = frontier.popleft()
        explored += 1
        if node == goal:
            path = reconstruct_path(parents, goal)
            return path, path_cost(path), explored
        for nxt in get_neighbors(node):
            if nxt not in parents:
                parents[nxt] = node
                frontier.append(nxt)
    return None, 0, explored
