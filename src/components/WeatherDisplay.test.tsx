import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WeatherDisplay from './WeatherDisplay'
import App from '../App'
import type { WeatherData } from '../lib/weatherApi'

vi.mock('../lib/cityList', () => ({
  getCountries: () => [],
  getCitiesByCountry: () => [],
}))

const MOCK_WEATHER: WeatherData = {
  current: {
    temperature: 18,
    high: 22,
    low: 12,
    condition: 'Partly cloudy',
    conditionCode: 2,
  },
  hourly: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    temperature: 15 + (i % 5),
    condition: 'Clear sky',
    precipitationChance: 5,
  })),
  daily: Array.from({ length: 7 }, (_, i) => ({
    date: `2024-01-0${i + 1}`,
    high: 22 - i,
    low: 12 - i,
    condition: 'Mainly clear',
    precipitationChance: 10,
  })),
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('WeatherDisplay', () => {
  it('renders current temperature, condition, and high/low', () => {
    render(<WeatherDisplay data={MOCK_WEATHER} unit="celsius" />)
    const section = screen.getByText('Current Conditions').closest('div')!
    expect(within(section).getByText(/18.*°C/)).toBeInTheDocument()
    expect(within(section).getByText('Partly cloudy')).toBeInTheDocument()
    expect(within(section).getByText(/H:.*22.*°C/)).toBeInTheDocument()
    expect(within(section).getByText(/L:.*12.*°C/)).toBeInTheDocument()
  })

  it('shows °F symbol in Current Conditions when unit is fahrenheit', () => {
    render(<WeatherDisplay data={MOCK_WEATHER} unit="fahrenheit" />)
    const section = screen.getByText('Current Conditions').closest('div')!
    expect(within(section).getByText(/18.*°F/)).toBeInTheDocument()
    expect(within(section).getByText(/H:.*22.*°F/)).toBeInTheDocument()
  })

  it('renders Hourly Forecast and Weekly Forecast sections', () => {
    render(<WeatherDisplay data={MOCK_WEATHER} unit="celsius" />)
    expect(screen.getByText("Today's Hourly Forecast")).toBeInTheDocument()
    expect(screen.getByText('7-Day Forecast')).toBeInTheDocument()
  })
})

describe('CurrentConditions unit toggle', () => {
  it('switches unit symbol globally when re-rendered with fahrenheit', () => {
    const { rerender } = render(<WeatherDisplay data={MOCK_WEATHER} unit="celsius" />)
    expect(screen.getAllByText(/°C/).length).toBeGreaterThan(0)
    rerender(<WeatherDisplay data={MOCK_WEATHER} unit="fahrenheit" />)
    expect(screen.getAllByText(/°F/).length).toBeGreaterThan(0)
    expect(screen.queryAllByText(/°C/).length).toBe(0)
  })
})

describe('App — controls', () => {
  it('Refresh button is disabled when no city is selected', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Refresh' })).toBeDisabled()
  })

  it('Clear button is rendered and hides weather display after click', async () => {
    render(<App />)
    const clearBtn = screen.getByRole('button', { name: 'Clear' })
    expect(clearBtn).toBeInTheDocument()
    await userEvent.click(clearBtn)
    expect(screen.queryByText('Current Conditions')).not.toBeInTheDocument()
  })
})
