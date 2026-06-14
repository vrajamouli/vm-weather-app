# Use Open-Meteo as the weather API

Open-Meteo is fully free with no API key, no account, and no rate limits — making it the most reliable choice for a project where availability and cost are concerns. The alternative (OpenWeatherMap) requires a key and has daily call limits on its free tier. Open-Meteo's API is coordinate-based (lat/lon), which pairs directly with the static City List that already carries coordinates, eliminating any geocoding step.

## Considered options

- **OpenWeatherMap** — most widely used, but free tier caps at 1,000 calls/day and requires account management
- **WeatherAPI.com** — clean API, free tier limited to 3-day forecast
- **Open-Meteo** — chosen: no key, no limits, 7-day hourly data in a single request
