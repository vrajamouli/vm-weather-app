import { useState, useEffect } from 'react'
import CountryDropdown from './components/CountryDropdown'
import CityDropdown from './components/CityDropdown'
import WeatherDisplay from './components/WeatherDisplay'
import { getCitiesByCountry, type City } from './lib/cityList'
import { fetchWeather, type WeatherData, type TemperatureUnit } from './lib/weatherApi'

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: WeatherData }

export default function App() {
  const [countryCode, setCountryCode] = useState('')
  const [selectedCityName, setSelectedCityName] = useState('')
  const [unit, setUnit] = useState<TemperatureUnit>('celsius')
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'idle' })

  const cities = countryCode ? getCitiesByCountry(countryCode) : []
  const selectedCity: City | undefined = cities.find((c) => c.name === selectedCityName)

  useEffect(() => {
    if (!selectedCity) return
    void loadWeather(selectedCity, unit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCityName, unit])

  async function loadWeather(city: City, temperatureUnit: TemperatureUnit) {
    setFetchState({ status: 'loading' })
    const result = await fetchWeather({
      latitude: city.lat,
      longitude: city.lon,
      temperatureUnit,
    })
    if (result.ok) {
      setFetchState({ status: 'success', data: result.data })
    } else {
      setFetchState({ status: 'error', message: result.error })
    }
  }

  function handleCountryChange(code: string) {
    setCountryCode(code)
    setSelectedCityName('')
    setFetchState({ status: 'idle' })
  }

  function handleCityChange(cityName: string) {
    setSelectedCityName(cityName)
  }

  function handleRefresh() {
    if (selectedCity) void loadWeather(selectedCity, unit)
  }

  function handleClear() {
    setCountryCode('')
    setSelectedCityName('')
    setFetchState({ status: 'idle' })
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: '#EEF0F4' }}>
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <span
            className="text-xs font-medium uppercase tracking-widest text-gray-400"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Weather
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setUnit('celsius')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                unit === 'celsius'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('fahrenheit')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                unit === 'fahrenheit'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              °F
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-2xl bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <CountryDropdown value={countryCode} onChange={handleCountryChange} />
            </div>
            <div className="flex-1">
              <CityDropdown
                cities={cities}
                value={selectedCityName}
                onChange={handleCityChange}
                disabled={!countryCode}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={!selectedCity}
              className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Refresh
            </button>
            <button
              onClick={handleClear}
              className="text-sm text-gray-400 transition-colors hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Loading */}
        {fetchState.status === 'loading' && (
          <div role="status" className="mt-4 flex items-center justify-center py-14">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
              aria-label="Loading"
              style={{ borderColor: '#D1D5DB', borderTopColor: 'transparent' }}
            />
            <span className="ml-3 text-sm text-gray-400">Fetching weather data…</span>
          </div>
        )}

        {/* Error */}
        {fetchState.status === 'error' && (
          <div role="alert" className="mt-4 rounded-2xl bg-white px-6 py-5 shadow-sm">
            <p className="text-sm text-gray-700">{fetchState.message}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-600"
            >
              Try again
            </button>
          </div>
        )}

        {/* Weather */}
        {fetchState.status === 'success' && (
          <div className="mt-4">
            <WeatherDisplay data={fetchState.data} unit={unit} />
          </div>
        )}
      </div>
    </div>
  )
}
