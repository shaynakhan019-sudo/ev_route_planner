/**
 * Tests for the api.ts helpers with a mocked fetch.
 * Written against the API contract, not against a specific implementation.
 *
 * ADAPT (one place): change the import path / function names below to match
 * your frontend/src/lib/api.ts (or wherever api.ts lives).
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getGraph, getLocations, findRoute } from '@/lib/api'

type RouteArgs = Parameters<typeof findRoute>[0]
const callFindRoute = (start: string, end: string, algorithm: RouteArgs['algorithm']) =>
  findRoute({ start, end, algorithm })

const LOCATIONS = { locations: ['A', 'B', 'C'] }
const GRAPH = {
  nodes: [{ id: 'A', label: 'A', is_charging_station: false }],
  edges: [{ source: 'A', target: 'B', distance: 10 }],
}
const ROUTE = {
  path: ['A', 'B', 'D'],
  total_distance: 25,
  nodes_explored: 4,
  algorithm: 'astar',
}

function mockFetchOnce(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getLocations', () => {
  it('calls GET /api/locations and returns the locations', async () => {
    const fetchMock = mockFetchOnce(LOCATIONS)
    const result = await getLocations()
    expect(fetchMock.mock.calls[0][0]).toBe('/api/locations')
    // helper may return the raw body or just the array; both satisfy the contract
    expect([LOCATIONS, LOCATIONS.locations]).toContainEqual(result)
  })
})

describe('getGraph', () => {
  it('calls GET /api/graph and returns nodes and edges', async () => {
    const fetchMock = mockFetchOnce(GRAPH)
    const result = await getGraph()
    expect(fetchMock.mock.calls[0][0]).toBe('/api/graph')
    expect(result).toEqual(GRAPH)
  })
})

describe('findRoute', () => {
  it('POSTs start, end and algorithm as JSON to /api/route', async () => {
    const fetchMock = mockFetchOnce(ROUTE)
    const result = await callFindRoute('A', 'D', 'astar')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/route')
    expect(options.method).toBe('POST')
    expect(JSON.parse(options.body)).toEqual({ start: 'A', end: 'D', algorithm: 'astar' })
    expect(result).toEqual(ROUTE)
  })

  it('rejects with the server error message on HTTP 400', async () => {
    mockFetchOnce({ error: 'Unknown start location' }, 400)
    await expect(callFindRoute('Z', 'D', 'astar')).rejects.toThrow(/Unknown start location/)
  })

  it('rejects with the server error message on HTTP 404 (no route)', async () => {
    mockFetchOnce({ error: 'No route found' }, 404)
    await expect(callFindRoute('A', 'D', 'bfs')).rejects.toThrow(/No route found/)
  })

  it('rejects when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(callFindRoute('A', 'D', 'ucs')).rejects.toThrow()
  })
})
