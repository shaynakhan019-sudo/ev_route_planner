"""Independent reference implementations used to check the real algorithms.

These work only from the public /api/graph JSON, so the tests depend on the
API contract and not on anybody's internal code. Roads are treated as
undirected (a road A-B can be driven both ways).
"""
import heapq
from collections import deque


def build_adjacency(graph_json):
    adj = {n["id"]: {} for n in graph_json["nodes"]}
    for e in graph_json["edges"]:
        adj[e["source"]][e["target"]] = e["distance"]
        adj[e["target"]][e["source"]] = e["distance"]
    return adj


def shortest_distance(adj, start, goal):
    """Dijkstra: optimal total distance, or None if unreachable."""
    best = {start: 0}
    heap = [(0, start)]
    while heap:
        dist, node = heapq.heappop(heap)
        if node == goal:
            return dist
        if dist > best.get(node, float("inf")):
            continue
        for nxt, w in adj[node].items():
            nd = dist + w
            if nd < best.get(nxt, float("inf")):
                best[nxt] = nd
                heapq.heappush(heap, (nd, nxt))
    return None


def fewest_hops(adj, start, goal):
    """BFS: minimum number of edges between start and goal, or None."""
    seen = {start: 0}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        if node == goal:
            return seen[node]
        for nxt in adj[node]:
            if nxt not in seen:
                seen[nxt] = seen[node] + 1
                queue.append(nxt)
    return None


def path_distance(adj, path):
    """Sum of edge distances along a path; raises KeyError if an edge is missing."""
    return sum(adj[a][b] for a, b in zip(path, path[1:]))
