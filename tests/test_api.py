"""Endpoint tests, written against the agreed API contract."""
import pytest

from tests.conftest import ALGORITHMS
from tests.reference import path_distance, shortest_distance


# ---------- GET /api/locations ----------
def test_locations_shape(client):
    resp = client.get("/api/locations")
    assert resp.status_code == 200
    body = resp.get_json()
    assert set(body) == {"locations"}
    assert isinstance(body["locations"], list)
    assert len(body["locations"]) >= 10
    assert all(isinstance(x, str) for x in body["locations"])
    assert len(body["locations"]) == len(set(body["locations"]))


# ---------- GET /api/graph ----------
def test_graph_shape(client):
    resp = client.get("/api/graph")
    assert resp.status_code == 200
    body = resp.get_json()
    assert set(body) == {"nodes", "edges"}
    for node in body["nodes"]:
        assert set(node) == {"id", "label", "is_charging_station"}
        assert isinstance(node["id"], str)
        assert isinstance(node["label"], str)
        assert isinstance(node["is_charging_station"], bool)
    for edge in body["edges"]:
        assert set(edge) == {"source", "target", "distance"}
        assert isinstance(edge["distance"], (int, float))
        assert edge["distance"] > 0


def test_graph_is_consistent_with_locations(client):
    locations = client.get("/api/locations").get_json()["locations"]
    graph = client.get("/api/graph").get_json()
    ids = [n["id"] for n in graph["nodes"]]
    assert sorted(ids) == sorted(locations)
    for edge in graph["edges"]:
        assert edge["source"] in ids and edge["target"] in ids


def test_graph_has_charging_stations_and_enough_data(client):
    graph = client.get("/api/graph").get_json()
    assert len(graph["nodes"]) >= 10
    assert any(n["is_charging_station"] for n in graph["nodes"])
    assert not all(n["is_charging_station"] for n in graph["nodes"])
    assert len(graph["edges"]) >= len(graph["nodes"]) - 1


# ---------- POST /api/route : success ----------
def post_route(client, start, end, algorithm):
    return client.post(
        "/api/route", json={"start": start, "end": end, "algorithm": algorithm}
    )


@pytest.mark.parametrize("algorithm", ALGORITHMS)
def test_route_success_shape(client, adjacency, locations, algorithm):
    start, end = locations[0], locations[-1]
    resp = post_route(client, start, end, algorithm)
    assert resp.status_code == 200
    body = resp.get_json()
    assert set(body) == {"path", "total_distance", "nodes_explored", "algorithm"}
    assert body["algorithm"] == algorithm
    assert body["path"][0] == start and body["path"][-1] == end
    assert isinstance(body["nodes_explored"], int) and body["nodes_explored"] >= 1
    assert body["total_distance"] == path_distance(adjacency, body["path"])


def test_all_algorithms_find_a_route_for_same_pair(client, locations):
    start, end = locations[0], locations[-1]
    for algorithm in ALGORITHMS:
        assert post_route(client, start, end, algorithm).status_code == 200


@pytest.mark.parametrize("algorithm", ["astar", "ucs"])
def test_optimal_algorithms_return_optimal_cost(client, adjacency, locations, algorithm):
    for start in locations:
        for end in locations:
            if start == end:
                continue
            body = post_route(client, start, end, algorithm).get_json()
            assert body["total_distance"] == shortest_distance(adjacency, start, end)


def test_route_works_in_both_directions(client, locations):
    a, b = locations[0], locations[-1]
    forward = post_route(client, a, b, "ucs").get_json()["total_distance"]
    backward = post_route(client, b, a, "ucs").get_json()["total_distance"]
    assert forward == backward


# ---------- POST /api/route : errors (HTTP 400) ----------
def assert_error(resp, status):
    assert resp.status_code == status
    body = resp.get_json()
    assert set(body) == {"error"}
    assert isinstance(body["error"], str) and body["error"]


def test_same_start_and_end_is_400(client, locations):
    assert_error(post_route(client, locations[0], locations[0], "astar"), 400)


def test_unknown_start_is_400(client, locations):
    assert_error(post_route(client, "NOPE", locations[0], "astar"), 400)


def test_unknown_end_is_400(client, locations):
    assert_error(post_route(client, locations[0], "NOPE", "astar"), 400)


def test_invalid_algorithm_is_400(client, locations):
    assert_error(post_route(client, locations[0], locations[1], "dijkstra"), 400)


@pytest.mark.parametrize("missing", ["start", "end", "algorithm"])
def test_missing_field_is_400(client, locations, missing):
    payload = {"start": locations[0], "end": locations[1], "algorithm": "astar"}
    del payload[missing]
    assert_error(client.post("/api/route", json=payload), 400)


def test_non_json_body_is_400(client):
    resp = client.post("/api/route", data="not json", content_type="text/plain")
    assert_error(resp, 400)


def test_wrong_types_are_400(client):
    resp = client.post("/api/route", json={"start": 1, "end": 2, "algorithm": "astar"})
    assert_error(resp, 400)


def test_unknown_endpoint_returns_json_404(client):
    resp = client.get("/api/does-not-exist")
    assert resp.status_code == 404


def test_cors_header_is_present(client):
    resp = client.get("/api/locations")
    assert resp.headers.get("Access-Control-Allow-Origin")
