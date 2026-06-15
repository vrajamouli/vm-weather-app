# vm-weather-app

A browser-based weather app. Select a country and city to see current conditions, a 24-hour hourly forecast, and a 7-day weekly forecast — no account or API key required.

Built with React 19 + Vite + TypeScript + Tailwind CSS, powered by [Open-Meteo](https://open-meteo.com/).

---

## Features

- **Country → City selection** — guided two-step dropdown; city list is disabled until a country is chosen
- **Current Conditions** — real-time temperature, daily high/low, and weather condition
- **Hourly Forecast** — 24 scrollable slots for the current day with temperature, condition, and precipitation chance
- **7-Day Forecast** — daily high/low, condition, and precipitation chance for the week ahead
- **°C / °F toggle** — switches temperature units globally across all three sections
- **Refresh / Clear** — re-fetch data or reset the display without reloading the page
- **No API key** — Open-Meteo is free, key-free, and has no rate limits

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Test

```bash
npm test
```

28 tests across 5 files — all passing.

---

## Project structure

```
src/
├── components/
│   ├── CountryDropdown.tsx      # Country selector
│   ├── CityDropdown.tsx         # City selector (disabled until country chosen)
│   ├── CurrentConditions.tsx    # Temperature, high/low, condition
│   ├── HourlyForecast.tsx       # 24-hour slots
│   ├── WeeklyForecast.tsx       # 7-day rows
│   └── WeatherDisplay.tsx       # Wrapper for all three forecast sections
├── lib/
│   ├── cityList.ts              # getCountries() and getCitiesByCountry()
│   └── weatherApi.ts            # Open-Meteo adapter (fetchWeather)
├── data/
│   └── cities.json              # ~6,100 cities bundled at build time
scripts/
└── prepare-cities.mjs           # Builds cities.json from GeoNames data
docs/
├── adr/                         # Architectural decision records
└── build-log.md                 # Full record of the initial build session
```

---

## Data sources

| Source | Purpose |
|---|---|
| [Open-Meteo](https://open-meteo.com/) | Weather data — coordinate-based, free, no key |
| [GeoNames cities15000](https://download.geonames.org/export/dump/) | City list — filtered to population ≥ 100,000 |

The city list is a static JSON file bundled at build time (~379 KB). Cities with the same name within a country are disambiguated with their state (e.g. "Springfield, Illinois").

---

## Architecture decisions

- [ADR 0001 — Use Open-Meteo as the weather API](docs/adr/0001-open-meteo-weather-api.md)
- [ADR 0002 — Use a static bundled city list](docs/adr/0002-static-bundled-city-list.md)
