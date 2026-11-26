/**
 * Tests for the controls panel (start, end, algorithm, "Find route" button).
 *
 * ADAPT (top of file only): component path, prop names and label texts.
 * Assumed props: locations: string[], loading?: boolean,
 *                onSubmit(start, end, algorithm)
 */
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ControlsPanel from '@/components/ControlsPanel'

const LOCATIONS = ['A', 'B', 'C', 'D']
const BUTTON = /find route/i // ADAPT: your button text
const LABELS = { start: /start/i, end: /end|destination/i, algorithm: /algorithm/i } // ADAPT

function setup(props: { loading?: boolean } = {}) {
  const onSubmit = vi.fn()
  const user = userEvent.setup()
  render(<ControlsPanel locations={LOCATIONS} onSubmit={onSubmit} {...props} />)
  return { onSubmit, user }
}

// Works for shadcn <Select> (Radix): open the combobox, then click the option.
async function choose(
  user: ReturnType<typeof userEvent.setup>,
  label: RegExp,
  option: string | RegExp,
) {
  await user.click(screen.getByRole('combobox', { name: label }))
  const listbox = await screen.findByRole('listbox')
  await user.click(within(listbox).getByRole('option', { name: option }))
}

describe('ControlsPanel', () => {
  it('renders start, end and algorithm controls and the submit button', () => {
    setup()
    expect(screen.getByRole('combobox', { name: LABELS.start })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: LABELS.end })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: LABELS.algorithm })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: BUTTON })).toBeInTheDocument()
  })

  it('offers every location as an option', async () => {
    const { user } = setup()
    await user.click(screen.getByRole('combobox', { name: LABELS.start }))
    const listbox = await screen.findByRole('listbox')
    for (const loc of LOCATIONS) {
      expect(within(listbox).getByRole('option', { name: loc })).toBeInTheDocument()
    }
  })

  it('submits the chosen start, end and algorithm', async () => {
    const { onSubmit, user } = setup()
    await choose(user, LABELS.start, 'A')
    await choose(user, LABELS.end, 'D')
    await choose(user, LABELS.algorithm, /a\*|astar/i)
    await user.click(screen.getByRole('button', { name: BUTTON }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const [start, end, algorithm] = onSubmit.mock.calls[0]
    expect(start).toBe('A')
    expect(end).toBe('D')
    expect(algorithm).toBe('astar')
  })

  it('disables the submit button while loading', () => {
    setup({ loading: true })
    expect(screen.getByRole('button', { name: BUTTON })).toBeDisabled()
  })
})
