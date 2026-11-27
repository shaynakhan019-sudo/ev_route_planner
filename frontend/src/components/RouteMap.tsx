import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import type { GraphNode, GraphEdge } from '@/lib/api'

interface RouteMapProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  path?: string[]
  loading?: boolean
  error?: string | null
}

export default function RouteMap({
  nodes,
  edges,
  path = [],
  loading = false,
  error = null,
}: RouteMapProps) {
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-border bg-card p-6">
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

  const flowNodes = nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / Math.max(nodes.length, 1)
    const radius = Math.max(150, nodes.length * 25)

    const isInRoute = path.includes(node.id)

    return {
      id: node.id,
      position: {
        x: 300 + radius * Math.cos(angle),
        y: 220 + radius * Math.sin(angle),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: node.label || node.id,
      },
      style: {
        background: node.is_charging_station
          ? '#fef3c7'
          : isInRoute
            ? '#dbeafe'
            : '#ffffff',
        border: isInRoute
          ? '2px solid #2563eb'
          : node.is_charging_station
            ? '2px solid #d97706'
            : '1px solid #94a3b8',
        borderRadius: '10px',
        padding: '12px 18px',
        color: '#1e293b',
        fontWeight: 600,
        minWidth: 70,
      },
    }
  })

  const flowEdges = edges.map((edge, index) => {
    const sourceIndex = path.indexOf(edge.source)
    const targetIndex = path.indexOf(edge.target)

    const isRouteEdge =
      sourceIndex !== -1 &&
      targetIndex !== -1 &&
      Math.abs(sourceIndex - targetIndex) === 1

    return {
      id: `edge-${index}`,
      source: edge.source,
      target: edge.target,
      label: `${edge.distance} km`,
      animated: isRouteEdge,
      style: {
        stroke: isRouteEdge ? '#2563eb' : '#94a3b8',
        strokeWidth: isRouteEdge ? 3 : 1.5,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isRouteEdge ? '#2563eb' : '#94a3b8',
      },
    }
  })

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-border bg-card">
      {nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No map data available.
        </div>
      ) : (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      )}
    </div>
  )
}