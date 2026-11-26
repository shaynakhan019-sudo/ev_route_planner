/**
 * Tests for the loading and error states of the map.
 *
 * ADAPT (top of file only): component path and prop names.
 * Assumed props: nodes, edges, path?: string[], loading?: boolean, error?: string | null
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RouteMap from '@/components/RouteMap'

const NODES = [
  { id: 'A', label: 'A', is_charging_station: false },
  { id: 'B', label: 'B', is_charging_station: true },
]
const EDGES = [{ source: 'A', target: 'B', distance: 10 }]

function renderMap(props: { loading?: boolean; error?: string | null } = {}) {
  return render(
    <div style={{ width: 800, height: 600 }}>
      <RouteMap nodes={NODES} edges={EDGES} {...props} />
    </div>,
  )
}

describe('RouteMap states', () => {
  it('shows a loading indicator while the graph is loading', () => {
    renderMap({ loading: true })
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('shows the error message when loading fails', () => {
    renderMap({ error: 'Could not reach the server' })
    expect(screen.getByText(/could not reach the server/i)).toBeInTheDocument()
  })

  it('does not show loading or error text in the normal state', () => {
    renderMap()
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/error|could not/i)).not.toBeInTheDocument()
  })

  it('renders the node labels when the graph is ready', async () => {
    renderMap()
    expect(await screen.findByText('A')).toBeInTheDocument()
    expect(await screen.findByText('B')).toBeInTheDocument()
  })
})
