import type { City } from '../lib/cityList'

interface Props {
  cities: City[]
  value: string
  onChange: (cityName: string) => void
  disabled: boolean
}

export default function CityDropdown({ cities, value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="city-select"
        className="text-xs font-medium uppercase tracking-widest text-gray-400"
      >
        City
      </label>
      <select
        id="city-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300"
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
