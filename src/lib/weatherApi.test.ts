import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchWeather, decodeWeatherCondition } from './weatherApi'

const MOCK_RESPONSE = {
  current: {
    temperature_2m: 18.5,
    weathercode: 2,
  },
  hourly: {
    time: Array.from({ length: 168 }, (_, i) => `2024-01-01T${String(i % 24).padStart(2, '0')}:00`),
    temperature_2m: Array.from({ length: 168 }, (_, i) => 15 + i % 5),
    weathercode: Array.from({ length: 168 }, () => 1),
    precipitation_probability: Array.from({ length: 168 }, () => 10),
  },
  daily: {
    time: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07'],
    weathercode: [2, 3, 61, 63, 0, 1, 2],
    temperature_2m_max: [22, 20, 18, 16, 21, 23, 24],
    temperature_2m_min: [12, 11, 10, 9, 13, 14, 15],
    precipitation_probability_max: [5, 10, 80, 90, 0, 5, 10],
  },
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchWeather', () => {
  it('constructs the correct Open-Meteo URL for celsius', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RESPONSE,
    }))

    await fetchWeather({ latitude: 51.5, longitude: -0.12, temperatureUnit: 'celsius' })

    const calledUrl = new URL((fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string)
    expect(calledUrl.origin + calledUrl.pathname).toBe('https://api.open-meteo.com/v1/forecast')
    expect(calledUrl.searchParams.get('latitude')).toBe('51.5')
    expect(calledUrl.searchParams.get('longitude')).toBe('-0.12')
    expect(calledUrl.searchParams.get('temperature_unit')).toBe('celsius')
    expect(calledUrl.searchParams.get('forecast_days')).toBe('7')
  })

  it('constructs the correct URL for fahrenheit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RESPONSE,
    }))

    await fetchWeather({ latitude: 40.71, longitude: -74.0, temperatureUnit: 'fahrenheit' })

    const calledUrl = new URL((fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string)
    expect(calledUrl.searchParams.get('temperature_unit')).toBe('fahrenheit')
  })

  it('returns ok:true with correctly mapped weather data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_RESPONSE,
    }))

    const result = await fetchWeather({ latitude: 51.5, longitude: -0.12, temperatureUnit: 'celsius' })

    expect(result.ok).toBe(true)
    if (!result.ok) return

    expect(result.data.current.temperature).toBe(18.5)
    expect(result.data.current.condition).toBe('Partly cloudy')
    expect(result.data.current.high).toBe(22)
    expect(result.data.current.low).toBe(12)

    expect(result.data.hourly).toHaveLength(24)
    expect(result.data.hourly[0].hour).toBe(0)
    expect(result.data.hourly[0].condition).toBe('Mainly clear')

    expect(result.data.daily).toHaveLength(7)
    expect(result.data.daily[0].date).toBe('2024-01-01')
    expect(result.data.daily[2].condition).toBe('Light rain')
  })

  it('returns ok:false on a non-200 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }))

    const result = await fetchWeather({ latitude: 51.5, longitude: -0.12, temperatureUnit: 'celsius' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain('500')
  })

  it('returns ok:false on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    const result = await fetchWeather({ latitude: 51.5, longitude: -0.12, temperatureUnit: 'celsius' })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(typeof result.error).toBe('string')
  })
})

describe('decodeWeatherCondition', () => {
  it('maps known WMO codes to strings', () => {
    expect(decodeWeatherCondition(0)).toBe('Clear sky')
    expect(decodeWeatherCondition(63)).toBe('Rain')
    expect(decodeWeatherCondition(95)).toBe('Thunderstorm')
  })

  it('returns Unknown for unmapped codes', () => {
    expect(decodeWeatherCondition(999)).toBe('Unknown')
  })
})
