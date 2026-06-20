import { getCountries } from '../lib/cityList'

interface Props {
  value: string
  onChange: (countryCode: string) => void
}

const countries = getCountries()

export default function CountryDropdown({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="country-select"
        className="text-xs font-medium uppercase tracking-widest text-gray-400"
      >
        Country
      </label>
      <select
        id="country-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
