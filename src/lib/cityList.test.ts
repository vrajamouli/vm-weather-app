import { describe, it, expect } from 'vitest'
import { getCitiesByCountry, getCountries } from './cityList'

describe('getCitiesByCountry', () => {
  it('returns cities for a known country code', () => {
    const cities = getCitiesByCountry('GB')
    expect(cities.length).toBeGreaterThan(0)
    cities.forEach((city) => {
      expect(city.countryCode).toBe('GB')
      expect(typeof city.name).toBe('string')
      expect(typeof city.lat).toBe('number')
      expect(typeof city.lon).toBe('number')
    })
  })

  it('returns an empty array for an unknown country code', () => {
    expect(getCitiesByCountry('XX')).toEqual([])
  })

  it('returns an empty array for an empty string', () => {
    expect(getCitiesByCountry('')).toEqual([])
  })
})

describe('getCountries', () => {
  it('returns a non-empty list of countries', () => {
    const countries = getCountries()
    expect(countries.length).toBeGreaterThan(0)
  })

  it('returns countries sorted alphabetically by name', () => {
    const countries = getCountries()
    for (let i = 1; i < countries.length; i++) {
      expect(countries[i].name.localeCompare(countries[i - 1].name)).toBeGreaterThanOrEqual(0)
    }
  })

  it('each country has a code and name', () => {
    getCountries().forEach((c) => {
      expect(typeof c.code).toBe('string')
      expect(c.code.length).toBe(2)
      expect(typeof c.name).toBe('string')
    })
  })
})
