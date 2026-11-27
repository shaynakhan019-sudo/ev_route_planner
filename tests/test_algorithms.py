"""Unit tests for bfs, ucs, greedy and astar.

Each algorithm must return (path, total_distance, nodes_explored).
Optimality is checked against the independent reference in tests/reference.py.
"""
import itertools

import pytest

from ev_route_planner.astar import astar
from ev_route_planner.bfs import bfs
from ev_route_planner.greedy import greedy
from ev_route_planner.ucs import ucs
from tests.reference import fewest_hops, path_distance, shortest_distance

ALL = {"bfs": bfs, "ucs": ucs, "greedy": greedy, "astar": astar}
OPTIMAL = {"ucs": ucs, "astar": astar}


def all_pairs(locations):
    return list(itertools.permutations(locations, 2))


@pytest.mark.parametrize("name", ["bfs", "ucs", "greedy", "astar"])
def test_returns_valid_path_for_every_pair(name, adjacency, locations):
    algo = ALL[name]
    for start, end in all_pairs(locations):
        path, total, explored = algo(start, end)
        assert path[0] == start and path[-1] == end, (name, start, end)
        assert len(path) == len(set(path)), f"{name} path repeats a node: {path}"
        # every step must be a real road, and the reported distance must add up
        assert total == path_distance(adjacency, path), (name, start, end)
        assert isinstance(explored, int) and explored >= 1


@pytest.mark.parametrize("name", ["ucs", "astar"])
def test_ucs_and_astar_are_optimal(name, adjacency, locations):
    algo = OPTIMAL[name]
    for start, end in all_pairs(locations):
        _, total, _ = algo(start, end)
        assert total == shortest_distance(adjacency, start, end), (name, start, end)


def test_astar_and_ucs_agree(locations):
    for start, end in all_pairs(locations):
        assert astar(start, end)[1] == ucs(start, end)[1]


def test_bfs_uses_fewest_hops(adjacency, locations):
    for start, end in all_pairs(locations):
        path, _, _ = bfs(start, end)
        assert len(path) - 1 == fewest_hops(adjacency, start, end), (start, end)


@pytest.mark.parametrize("name", ["bfs", "greedy"])
def test_non_optimal_algorithms_never_beat_optimal(name, adjacency, locations):
    algo = ALL[name]
    for start, end in all_pairs(locations):
        _, total, _ = algo(start, end)
        assert total >= shortest_distance(adjacency, start, end)


def test_astar_explores_no_more_than_ucs_overall(locations):
    """With a good heuristic A* should not do more total work than UCS."""
    astar_work = sum(astar(s, e)[2] for s, e in all_pairs(locations))
    ucs_work = sum(ucs(s, e)[2] for s, e in all_pairs(locations))
    assert astar_work <= ucs_work


def test_adjacent_nodes_give_a_valid_route(adjacency):
    start = next(iter(adjacency))
    end = next(iter(adjacency[start]))
    for name, algo in ALL.items():
        path, total, _ = algo(start, end)
        assert path[0] == start and path[-1] == end, name
        assert total == path_distance(adjacency, path)
