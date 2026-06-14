export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface CurrentConditions {
  temperature: number
  high: number
  low: number
  condition: string
  conditionCode: number
}

export interface HourlySlot {
  hour: number
  temperature: number
  condition: string
  precipitationChance: number
}

export interface DailySlot {
  date: string
  high: number
  low: number
  condition: string
  precipitationChance: number
}

export interface WeatherData {
  current: CurrentConditions
  hourly: HourlySlot[]
  daily: DailySlot[]
}

export type WeatherResult =
  | { ok: true; data: WeatherData }
  | { ok: false; error: string }

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

export function decodeWeatherCondition(code: number): string {
  return WMO_CODES[code] ?? 'Unknown'
}

export async function fetchWeather(params: {
  latitude: number
  longitude: number
  temperatureUnit: TemperatureUnit
}): Promise<WeatherResult> {
  const { latitude, longitude, temperatureUnit } = params
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('temperature_unit', temperatureUnit)
  url.searchParams.set('current', 'temperature_2m,weathercode')
  url.searchParams.set(
    'hourly',
    'temperature_2m,weathercode,precipitation_probability',
  )
  url.searchParams.set(
    'daily',
    'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  )
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('timezone', 'auto')

  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      return { ok: false, error: `Weather service returned ${res.status}` }
    }
    const json = await res.json()
    return { ok: true, data: parseResponse(json) }
  } catch {
    return { ok: false, error: 'Unable to reach the weather service' }
  }
}

function parseResponse(json: Record<string, unknown>): WeatherData {
  const current = json.current as Record<string, unknown>
  const hourly = json.hourly as Record<string, unknown[]>
  const daily = json.daily as Record<string, unknown[]>

  const todayHigh = (daily.temperature_2m_max as number[])[0] ?? 0
  const todayLow = (daily.temperature_2m_min as number[])[0] ?? 0
  const currentCode = current.weathercode as number

  const hourlySlots: HourlySlot[] = (hourly.time as string[]).slice(0, 24).map((_, i) => ({
    hour: i,
    temperature: (hourly.temperature_2m as number[])[i] ?? 0,
    condition: decodeWeatherCondition((hourly.weathercode as number[])[i] ?? 0),
    precipitationChance: (hourly.precipitation_probability as number[])[i] ?? 0,
  }))

  const dailySlots: DailySlot[] = (daily.time as string[]).map((date, i) => ({
    date,
    high: (daily.temperature_2m_max as number[])[i] ?? 0,
    low: (daily.temperature_2m_min as number[])[i] ?? 0,
    condition: decodeWeatherCondition((daily.weathercode as number[])[i] ?? 0),
    precipitationChance: (daily.precipitation_probability_max as number[])[i] ?? 0,
  }))

  return {
    current: {
      temperature: current.temperature_2m as number,
      high: todayHigh,
      low: todayLow,
      condition: decodeWeatherCondition(currentCode),
      conditionCode: currentCode,
    },
    hourly: hourlySlots,
    daily: dailySlots,
  }
}
