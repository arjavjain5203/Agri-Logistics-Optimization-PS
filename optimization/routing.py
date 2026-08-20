"""Deterministic shortest-path and pickup-route functions."""

from __future__ import annotations

import heapq
from collections import defaultdict


def build_graph(edges: list[dict]) -> dict[str, list[tuple[str, float, float]]]:
    graph: dict[str, list[tuple[str, float, float]]] = defaultdict(list)
    for edge in edges:
        origin, destination = edge["from"], edge["to"]
        distance, minutes = float(edge["distance_km"]), float(edge["travel_time_min"])
        graph[origin].append((destination, distance, minutes))
        if not edge.get("one_way", False):
            graph[destination].append((origin, distance, minutes))
    return graph


def shortest_path(graph: dict, start: str, end: str) -> tuple[list[str], float, float] | None:
    queue = [(0.0, 0.0, start, [start])]
    best = {start: 0.0}
    while queue:
        distance, minutes, node, path = heapq.heappop(queue)
        if node == end:
            return path, distance, minutes
        if distance != best.get(node):
            continue
        for nxt, edge_distance, edge_minutes in sorted(graph.get(node, [])):
            candidate = distance + edge_distance
            if candidate < best.get(nxt, float("inf")):
                best[nxt] = candidate
                heapq.heappush(queue, (candidate, minutes + edge_minutes, nxt, path + [nxt]))
    return None


def route_cluster(graph: dict, vehicle_node: str, farm_ids: list[str], mandi_id: str):
    """Stable nearest-neighbour farm order, then shortest route to mandi."""
    remaining, current, full_path = set(farm_ids), vehicle_node, [vehicle_node]
    total_distance = total_minutes = 0.0
    while remaining:
        options = [(shortest_path(graph, current, farm), farm) for farm in remaining]
        options = [(result, farm) for result, farm in options if result]
        if not options:
            return None
        result, farm = min(options, key=lambda pair: (pair[0][1], pair[1]))
        path, distance, minutes = result
        full_path.extend(path[1:]); total_distance += distance; total_minutes += minutes
        current = farm; remaining.remove(farm)
    final_leg = shortest_path(graph, current, mandi_id)
    if not final_leg:
        return None
    path, distance, minutes = final_leg
    full_path.extend(path[1:]); total_distance += distance; total_minutes += minutes
    return full_path, total_distance, total_minutes
