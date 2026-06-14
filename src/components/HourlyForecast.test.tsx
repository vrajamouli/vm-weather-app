import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HourlyForecast from './HourlyForecast'
import type { WeatherData } from '../lib/weatherApi'

const HOURLY_SLOTS: WeatherData['hourly'] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  temperature: 15 + (i % 5),
  condition: i % 2 === 0 ? 'Clear sky' : 'Partly cloudy',
  precipitationChance: i * 2,
}))

describe('HourlyForecast', () => {
  it('renders all 24 hourly slots', () => {
    render(<HourlyForecast slots={HOURLY_SLOTS} unit="celsius" />)
    // Each slot shows a precipitation %, so count those
    const precipLabels = screen.getAllByText(/%$/)
    expect(precipLabels.length).toBe(24)
  })

  it('renders temperatures in celsius', () => {
    render(<HourlyForecast slots={HOURLY_SLOTS} unit="celsius" />)
    expect(screen.getAllByText(/°C/).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/°F/).length).toBe(0)
  })

  it('renders temperatures in fahrenheit', () => {
    render(<HourlyForecast slots={HOURLY_SLOTS} unit="fahrenheit" />)
    expect(screen.getAllByText(/°F/).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/°C/).length).toBe(0)
  })

  it('shows the section heading', () => {
    render(<HourlyForecast slots={HOURLY_SLOTS} unit="celsius" />)
    expect(screen.getByText("Today's Hourly Forecast")).toBeInTheDocument()
  })
})
