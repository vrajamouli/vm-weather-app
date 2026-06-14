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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Weather App</h1>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          {/* Selection */}
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

          {/* Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={!selectedCity}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              Refresh
            </button>
            <button
              onClick={handleClear}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-600">Unit:</span>
              <button
                onClick={() => setUnit('celsius')}
                className={`rounded px-3 py-1 text-sm font-medium ${unit === 'celsius' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                °C
              </button>
              <button
                onClick={() => setUnit('fahrenheit')}
                className={`rounded px-3 py-1 text-sm font-medium ${unit === 'fahrenheit' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Weather Display */}
          {fetchState.status === 'loading' && (
            <div role="status" className="mt-6 flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" aria-label="Loading" />
              <span className="ml-3 text-gray-500">Fetching weather data…</span>
            </div>
          )}

          {fetchState.status === 'error' && (
            <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4">
              <p className="text-sm text-red-700">{fetchState.message}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          )}

          {fetchState.status === 'success' && (
            <WeatherDisplay data={fetchState.data} unit={unit} />
          )}
        </div>
      </div>
    </div>
  )
}
