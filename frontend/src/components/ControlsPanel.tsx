
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Algorithm } from '../lib/api'

interface ControlsPanelProps {
  locations: string[]
  loading?: boolean
  locationsLoading?: boolean
  locationsError?: string | null
  error?: string | null
  onSubmit: (
    start: string,
    end: string,
    algorithm: Algorithm
  ) => void | Promise<void>
}

interface DropdownProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className="w-full rounded-lg border border-input bg-background p-3 text-left text-sm"
      >
        {selected?.label || `Select ${label.toLowerCase()}`}
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute z-20 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ALGORITHMS: { value: Algorithm; label: string }[] = [
  { value: 'astar', label: 'A* Search' },
  { value: 'ucs', label: 'Uniform Cost Search (UCS)' },
  { value: 'bfs', label: 'Breadth First Search (BFS)' },
  { value: 'greedy', label: 'Greedy Best First Search' },
]

export default function ControlsPanel({
  locations,
  loading = false,
  locationsLoading = false,
  locationsError = null,
  error = null,
  onSubmit,
}: ControlsPanelProps) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar')

  const locationOptions = locations.map((location) => ({
    value: location,
    label: location,
  }))

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!start || !end || start === end || loading || locationsLoading) {
      return
    }

    onSubmit(start, end, algorithm)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-1 text-xl font-semibold">Plan Your Route</h2>

      <p className="mb-5 text-sm text-muted-foreground">
        Choose your starting point, destination and route algorithm.
      </p>

      {locationsLoading && (
        <p className="mb-3 text-sm text-muted-foreground">
          Loading locations...
        </p>
      )}

      {locationsError && (
        <p className="mb-3 text-sm text-red-500">{locationsError}</p>
      )}

      {error && (
        <p className="mb-3 text-sm text-red-500">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Dropdown
          label="Start Location"
          value={start}
          options={locationOptions}
          onChange={setStart}
        />

        <Dropdown
          label="Destination"
          value={end}
          options={locationOptions}
          onChange={setEnd}
        />

        <Dropdown
          label="Algorithm"
          value={algorithm}
          options={ALGORITHMS}
          onChange={(value) => setAlgorithm(value as Algorithm)}
        />

        {start && end && start === end && (
          <p className="text-sm text-red-500">
            Start and destination must be different.
          </p>
        )}

        <button
          type="submit"
          disabled={
            loading ||
            locationsLoading ||
            !start ||
            !end ||
            start === end
          }
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Find Route
        </button>
      </form>
    </section>
  )
}
