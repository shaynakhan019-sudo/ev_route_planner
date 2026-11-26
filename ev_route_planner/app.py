"""Flask API for the EV Route Planner. Run: python -m ev_route_planner.app"""
from flask import Flask, jsonify, request

from . import graph
from .astar import astar
from .bfs import bfs
from .greedy import greedy
from .ucs import ucs

ALGORITHMS = {"astar": astar, "bfs": bfs, "ucs": ucs, "greedy": greedy}

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    """Simple CORS so the frontend works with or without the Vite proxy."""
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


def error(message, status):
    return jsonify({"error": message}), status


@app.get("/api/locations")
def locations():
    return jsonify({"locations": graph.get_locations()})


@app.get("/api/graph")
def get_graph():
    return jsonify(graph.graph_to_json())


@app.route("/api/route", methods=["POST", "OPTIONS"])
def route():
    if request.method == "OPTIONS":
        return "", 204

    body = request.get_json(silent=True)
    if not isinstance(body, dict):
        return error("Request body must be a JSON object", 400)

    start, end, algorithm = body.get("start"), body.get("end"), body.get("algorithm")

    for field, value in (("start", start), ("end", end), ("algorithm", algorithm)):
        if not isinstance(value, str) or not value:
            return error(f"Missing or invalid field: '{field}'", 400)

    if not graph.has_node(start):
        return error(f"Unknown start location: '{start}'", 400)
    if not graph.has_node(end):
        return error(f"Unknown end location: '{end}'", 400)
    if start == end:
        return error("Start and end must be different locations", 400)
    if algorithm not in ALGORITHMS:
        return error(
            f"Invalid algorithm '{algorithm}'. Must be one of: "
            + ", ".join(sorted(ALGORITHMS)),
            400,
        )

    path, total_distance, nodes_explored = ALGORITHMS[algorithm](start, end)
    if path is None:
        return error(f"No route found from '{start}' to '{end}'", 404)

    return jsonify(
        {
            "path": path,
            "total_distance": total_distance,
            "nodes_explored": nodes_explored,
            "algorithm": algorithm,
        }
    )


@app.errorhandler(404)
def not_found(_):
    return error("Endpoint not found", 404)


@app.errorhandler(405)
def method_not_allowed(_):
    return error("Method not allowed", 405)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
