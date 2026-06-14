import type { City } from '../lib/cityList'

interface Props {
  cities: City[]
  value: string
  onChange: (cityName: string) => void
  disabled: boolean
}

export default function CityDropdown({ cities, value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="city-select" className="text-sm font-medium text-gray-700">
        City
      </label>
      <select
        id="city-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="">{disabled ? 'Select a country first' : 'Select a city'}</option>
        {cities.map((city) => (
          <option key={`${city.name}-${city.lat}-${city.lon}`} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  )
}
