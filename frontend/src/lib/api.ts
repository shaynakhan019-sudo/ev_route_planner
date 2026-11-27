
const API_BASE_URL = '/api'

export type Algorithm = 'bfs' | 'ucs' | 'greedy' | 'astar'

export interface LocationsResponse {
  locations: string[]
}

export interface GraphNode {
  id: string
  label: string
  is_charging_station: boolean
}

export interface GraphEdge {
  source: string
  target: string
  distance: number
}

export interface GraphResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface RouteResponse {
  path: string[]
  total_distance: number
  nodes_explored: number
  algorithm: Algorithm
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`)
  }

  return data as T
}

export async function getLocations(): Promise<LocationsResponse> {
  const response = await fetch(`${API_BASE_URL}/locations`)
  return handleResponse<LocationsResponse>(response)
}

export async function getGraph(): Promise<GraphResponse> {
  const response = await fetch(`${API_BASE_URL}/graph`)
  return handleResponse<GraphResponse>(response)
}

export async function findRoute(
  start: string,
  end: string,
  algorithm: string
): Promise<RouteResponse> {
  const response = await fetch(`${API_BASE_URL}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ start, end, algorithm }),
  })

  return handleResponse<RouteResponse>(response)
}
