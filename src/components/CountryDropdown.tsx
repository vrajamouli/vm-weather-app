import { getCountries } from '../lib/cityList'

interface Props {
  value: string
  onChange: (countryCode: string) => void
}

const countries = getCountries()

export default function CountryDropdown({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="country-select" className="text-sm font-medium text-gray-700">
        Country
      </label>
      <select
        id="country-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  )
}
