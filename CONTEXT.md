# vm-weather-app

A browser-based app that displays weather data for cities across the globe. Users select a country and city; the app displays current conditions and forecasts sourced from Open-Meteo.

## Language

**Country**:
A nation used to filter the City List. Represented by name and ISO country code.
_Avoid_: nation, region

**City**:
A named populated place within a Country, drawn from the City List. The subject of every weather query. Carries a name, country code, and coordinates (latitude/longitude).
_Avoid_: location, place, town

**City List**:
The static dataset of Cities bundled with the app at build time, sourced from `dr5hn/countries-states-cities-database`. Keyed by country code; provides the lat/lon coordinates passed to Open-Meteo. Never fetched at runtime.
_Avoid_: city database, places list

**Current Conditions**:
Real-time temperature for the selected City, plus the predicted high and low for the current day.
_Avoid_: current weather, live weather

**Hourly Forecast**:
A 24-hour breakdown showing temperature, weather condition, and precipitation chance for the current day, displayed as hourly slots.
_Avoid_: daily forecast, today's forecast

**Weekly Forecast**:
A 7-day breakdown showing high/low temperature, weather condition, and precipitation chance per day.
_Avoid_: extended forecast, 7-day forecast

**Weather Condition**:
A plain-language description of sky and precipitation state (e.g. "Clear sky", "Partly cloudy", "Rain") derived from Open-Meteo's WMO weather interpretation codes.
_Avoid_: weather status, sky condition

**Temperature Unit**:
The display unit for all temperature values — Celsius (°C) or Fahrenheit (°F) — toggled by the user. Applies globally across Current Conditions, Hourly Forecast, and Weekly Forecast.
_Avoid_: unit preference, temperature format

**Weather Display**:
The UI area below the selection dropdowns that renders Current Conditions, Hourly Forecast, and Weekly Forecast for the selected City. Hidden until a City is selected; cleared by the Clear button.
_Avoid_: weather panel, results area
