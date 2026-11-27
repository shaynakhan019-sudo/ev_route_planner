import {
  getLocations,
  getGraph,
  findRoute,
} from './lib/api'

import type {
  Algorithm,
  GraphNode,
  GraphEdge,
  RouteResponse,
} from './lib/api'

// Fetch all available locations
export async function fetchLocations(): Promise<string[]> {
  const response = await getLocations()
  return response.locations
}

// Fetch graph nodes and edges
export async function fetchGraph(): Promise<{
  nodes: GraphNode[]
  edges: GraphEdge[]
}> {
  return await getGraph()
}

// Find route between selected locations
export async function fetchRoute(
  start: string,
  end: string,
  algorithm: Algorithm
): Promise<RouteResponse> {
  return await findRoute(start, end, algorithm)
}

// Export types for other components
export type {
  Algorithm,
  GraphNode,
  GraphEdge,
  RouteResponse,
}