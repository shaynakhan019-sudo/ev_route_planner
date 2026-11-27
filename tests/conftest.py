import pytest

from ev_route_planner.app import app
from tests.reference import build_adjacency

ALGORITHMS = ["astar", "bfs", "ucs", "greedy"]


@pytest.fixture
def client():
    app.config.update(TESTING=True)
    return app.test_client()


@pytest.fixture
def graph_json(client):
    return client.get("/api/graph").get_json()


@pytest.fixture
def adjacency(graph_json):
    return build_adjacency(graph_json)


@pytest.fixture
def locations(client):
    return client.get("/api/locations").get_json()["locations"]
