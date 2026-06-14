import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WeeklyForecast from './WeeklyForecast'
import type { WeatherData } from '../lib/weatherApi'

const DAILY_SLOTS: WeatherData['daily'] = Array.from({ length: 7 }, (_, i) => ({
  date: `2024-01-0${i + 1}`,
  high: 22 - i,
  low: 12 - i,
  condition: 'Mainly clear',
  precipitationChance: 10 + i * 5,
}))

describe('WeeklyForecast', () => {
  it('renders all 7 daily slots', () => {
    render(<WeeklyForecast days={DAILY_SLOTS} unit="celsius" />)
    const highLabels = screen.getAllByText(/H:/)
    expect(highLabels.length).toBe(7)
  })

  it('renders temperatures in celsius', () => {
    render(<WeeklyForecast days={DAILY_SLOTS} unit="celsius" />)
    expect(screen.getAllByText(/°C/).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/°F/).length).toBe(0)
  })

  it('renders temperatures in fahrenheit', () => {
    render(<WeeklyForecast days={DAILY_SLOTS} unit="fahrenheit" />)
    expect(screen.getAllByText(/°F/).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/°C/).length).toBe(0)
  })

  it('shows the section heading', () => {
    render(<WeeklyForecast days={DAILY_SLOTS} unit="celsius" />)
    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument()
  })

  it('renders weather condition for each day', () => {
    render(<WeeklyForecast days={DAILY_SLOTS} unit="celsius" />)
    expect(screen.getAllByText('Mainly clear').length).toBe(7)
  })
})
