import { useEffect, useState } from 'react'
import ControlsPanel from '../components/ControlsPanel'
import RouteMap from '../components/RouteMap'
import {
  fetchLocations,
  fetchGraph,
  fetchRoute,
  type Algorithm,
  type GraphNode,
  type GraphEdge,
  type RouteResponse,
} from '../api'

export default function RoutePlannerPage() {
  const [locations, setLocations] = useState<string[]>([])
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])

  const [locationsLoading, setLocationsLoading] = useState(true)
  const [graphLoading, setGraphLoading] = useState(true)

  const [locationsError, setLocationsError] = useState<string | null>(null)
  const [graphError, setGraphError] = useState<string | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)

  const [routeLoading, setRouteLoading] = useState(false)
  const [route, setRoute] = useState<RouteResponse | null>(null)

  useEffect(() => {
    let active = true

    fetchLocations()
      .then(data => {
        if (active) setLocations(data)
      })
      .catch(error => {
        if (active) setLocationsError(error.message || 'Could not load locations.')
      })
      .finally(() => {
        if (active) setLocationsLoading(false)
      })

    fetchGraph()
      .then(data => {
        if (active) {
          setNodes(data.nodes)
          setEdges(data.edges)
        }
      })
      .catch(error => {
        if (active) setGraphError(error.message || 'Could not load graph.')
      })
      .finally(() => {
        if (active) setGraphLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function handleFindRoute(
    start: string,
    end: string,
    algorithm: Algorithm
  ) {
    setRouteLoading(true)
    setRouteError(null)
    setRoute(null)

    try {
      const result = await fetchRoute(start, end, algorithm)
      setRoute(result)
    } catch (error) {
      setRouteError(
        error instanceof Error ? error.message : 'Could not calculate route.'
      )
    } finally {
      setRouteLoading(false)
    }
  }

  return (
    <main className="min-h-screen space-y-6 bg-slate-50 p-5 md:p-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">EV Route Planner</h1>
        <p className="mt-2 text-slate-500">
          Find and explore routes between electric vehicle charging locations.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <div>
          <ControlsPanel
            locations={locations}
            loading={routeLoading}
            locationsLoading={locationsLoading}
            locationsError={locationsError}
            error={routeError}
            onSubmit={handleFindRoute}
          />

          {route && (
            <section className="mt-5 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-slate-800">Route Summary</h2>
              <p className="mt-3 text-sm text-slate-600">
                **Algorithm:** {route.algorithm.toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                **Total distance:** {route.total_distance} km
              </p>
              <p className="mt-2 text-sm text-slate-600">
                **Nodes explored:** {route.nodes_explored}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                **Path:** {route.path.join(' → ')}
              </p>
            </section>
          )}
        </div>

        <section className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>🔵 Normal location</span>
            <span>⚡ Charging station</span>
            <span className="font-semibold text-sky-700">Blue line = calculated route</span>
          </div>

          <RouteMap
            nodes={nodes}
            edges={edges}
            path={route?.path}
            loading={graphLoading}
            error={graphError}
          />
        </section>
      </div>
    </main>
  )
}