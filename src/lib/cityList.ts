import citiesData from '../data/cities.json'

export interface City {
  name: string
  countryCode: string
  lat: number
  lon: number
}

export interface CountryEntry {
  name: string
  cities: Array<{ name: string; lat: number; lon: number }>
}

const data = citiesData as Record<string, CountryEntry>

export function getCountries(): Array<{ code: string; name: string }> {
  return Object.entries(data)
    .map(([code, entry]) => ({ code, name: entry.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getCitiesByCountry(countryCode: string): City[] {
  const entry = data[countryCode]
  if (!entry) return []
  return entry.cities.map((c) => ({
    name: c.name,
    countryCode,
    lat: c.lat,
    lon: c.lon,
  }))
}
