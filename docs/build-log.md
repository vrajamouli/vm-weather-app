# Build Log — vm-weather-app

A full record of every step taken to go from an empty directory to a working, tested, deployed weather app. Built in a single Claude Code session on 2026-06-09.

---

## 1. Project infrastructure setup (`/setup-matt-pocock-skills`)

Configured the per-repo agent skill infrastructure:

- **Issue tracker**: GitHub Issues via `gh` CLI → `docs/agents/issue-tracker.md`
- **Triage labels**: Default five-label vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) → `docs/agents/triage-labels.md`
- **Domain docs**: Single-context layout (`CONTEXT.md` + `docs/adr/`) → `docs/agents/domain.md`
- **`CLAUDE.md`** created at repo root pointing to all three agent config files

---

## 2. Design session (`/grill-with-docs`)

Interviewed to lock down the design before writing any code. Decisions made one at a time:

| Decision | Choice | Rationale |
|---|---|---|
| Purpose | Display weather for global cities in a browser | Core product statement |
| Weather data | Current conditions + hourly forecast (24h) + weekly forecast (7-day) | Historical data excluded |
| Data points per slot | Temperature + Weather Condition + precipitation chance | Key facts for day planning |
| Refresh model | Manual — Refresh button only, no auto-poll | Simplicity |
| City selection | Country dropdown → City dropdown | Guided two-step flow |
| City dataset | Static bundled JSON from `dr5hn/countries-states-cities-database` | No runtime geocoding API needed |
| Weather API | Open-Meteo | Free, no key, no rate limits, coordinate-based |
| Framework | React + Vite + TypeScript | Modern, fast dev experience |
| Styling | Tailwind CSS | Utility-first, pairs well with React |
| Temperature unit | User-selectable °C / °F toggle | Passed as a query param to Open-Meteo — no client-side conversion |

**Outputs:**
- `CONTEXT.md` — 9 domain terms defined (Country, City, City List, Current Conditions, Hourly Forecast, Weekly Forecast, Weather Condition, Temperature Unit, Weather Display)
- `docs/adr/0001-open-meteo-weather-api.md` — records why Open-Meteo was chosen over OpenWeatherMap and WeatherAPI.com
- `docs/adr/0002-static-bundled-city-list.md` — records why a static bundled JSON was chosen over a runtime geocoding API

---

## 3. PRD (`/to-prd`)

Three test seams identified before writing the PRD:

1. **Open-Meteo API adapter** — mock `fetch` at the network boundary; test URL construction, response mapping, error cases
2. **City List loader** — pure function, unit-tested with no mocks needed
3. **Weather Display component** — integration tests with mocked adapter data

PRD written covering problem statement, 20 user stories, implementation decisions, testing decisions, and out-of-scope items.

Published to GitHub as **issue #1** with label `ready-for-agent`.

---

## 4. Issue breakdown (`/to-issues`)

PRD broken into 8 vertical slices, each a thin end-to-end cut through all layers:

| Issue | Title | Blocked by |
|---|---|---|
| #2 | Project scaffold (Vite + React + TS + Tailwind) | — |
| #3 | City List loader + Country/City dropdowns | #2 |
| #4 | Open-Meteo adapter | #2 |
| #5 | Current Conditions display | #3, #4 |
| #6 | Temperature Unit toggle (°C / °F) | #5 |
| #7 | Hourly Forecast display | #5, #6 |
| #8 | Weekly Forecast display | #5, #6 |
| #9 | Refresh and Clear buttons | #5 |

All 8 published to GitHub with label `ready-for-agent`.

---

## 5. Build

### Issue #2 — Project scaffold

- Initialised Vite project with `react-ts` template
- Installed React 19, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`
- Installed Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Created `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- `npm run build` and `npm run dev` both pass
- Commit: `feat: scaffold Vite + React + TypeScript + Tailwind CSS`

### Issue #3 — City List loader + Country/City dropdowns

- Downloaded `dr5hn/countries-states-cities-database` (47MB) and wrote `scripts/prepare-cities.mjs` to filter it down to name + lat + lon only (8MB output)
- Bundled filtered dataset as `src/data/cities.json`
- Installed Vitest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`)
- `src/lib/cityList.ts`: `getCountries()` and `getCitiesByCountry(countryCode)` pure functions
- `src/components/CountryDropdown.tsx` and `src/components/CityDropdown.tsx`
- 6 unit tests for `getCitiesByCountry` and `getCountries` — all pass
- Commit: `feat: City List loader, Country/City dropdowns, and Vitest setup`

### Issue #4 — Open-Meteo adapter

- `src/lib/weatherApi.ts`: `fetchWeather({ latitude, longitude, temperatureUnit })` returning a discriminated union `WeatherResult`
- Full WMO weather interpretation code → human-readable string mapping (24 codes)
- Response parsed into typed `WeatherData` (current, hourly[24], daily[7])
- 7 unit tests: URL construction for both units, response mapping, non-200 error, network failure, WMO decoding — all pass
- Commit: `feat: Open-Meteo adapter with WMO code mapping and unit tests`

### Issues #5 + #6 — Current Conditions + Temperature Unit toggle

- `src/components/CurrentConditions.tsx`: current temperature, high/low, Weather Condition
- `src/components/WeatherDisplay.tsx`: wrapper that will grow to include all three forecast sections
- `src/App.tsx`: full fetch lifecycle — `useEffect` on `[selectedCityName, unit]`, loading/error/success states
- Refresh button (disabled when no city selected), Clear button, °C/°F toggle
- Loading spinner (`role="status"`) and error alert (`role="alert"`) states
- Component tests mock `cityList` to avoid loading 8MB dataset in jsdom (which caused test timeouts)
- 5 component tests + 6 unit tests = 11 new tests, 18 total — all pass
- **Bug encountered**: `vi.mock` inside `describe` blocks caused Vitest hoisting warnings; fixed by moving mock to top of file and importing `App` statically
- Commits: `feat: Current Conditions display with loading/error states and unit toggle`

### Issues #7 + #8 — Hourly Forecast + Weekly Forecast

- `src/components/HourlyForecast.tsx`: 24 scrollable hourly slots, each showing temperature, Weather Condition, precipitation chance; `formatHour()` converts 0–23 to 12-hour AM/PM
- `src/components/WeeklyForecast.tsx`: 7 daily rows, each showing formatted date, Weather Condition, precipitation %, high/low
- Both respect global Temperature Unit
- `WeatherDisplay.tsx` updated to render all three sections
- **Test fix**: existing `WeatherDisplay` tests broke once Hourly + Weekly rendered, because `/18/` matched multiple elements; fixed with `within(section)` scoping
- 4 tests for `HourlyForecast`, 5 for `WeeklyForecast` = 9 new tests, **28 total — all pass**
- Commit: `feat: Hourly Forecast and Weekly Forecast display`

### Issue #9 — Refresh and Clear buttons

Wired during issues #5/#6 as part of the same `App.tsx` fetch lifecycle — no separate commit needed. Both buttons were implemented, tested, and passing before this issue was explicitly targeted.

---

## 6. Bug fix — `useEffect` infinite loop

**Symptom**: When running in the browser, the app made hundreds of repeated calls to the Open-Meteo API after a city was selected, never resolving.

**Root cause**: `useEffect` depended on `selectedCity`, which was computed as `cities.find(c => c.name === selectedCityName)`. This returns a new object reference on every render. Because `setFetchState({ status: 'loading' })` triggers a re-render, and each re-render produces a new `selectedCity` reference, the effect fired again — infinite loop.

**Fix**: Changed `useEffect` dependency from `[selectedCity, unit]` to `[selectedCityName, unit]`. String comparison is stable across renders.

**Discovered via**: Playwright automation during the `/run` step — `page.on('request')` logging showed dozens of identical Open-Meteo requests firing with no responses returning.

Commit: `fix: prevent useEffect infinite loop on weather fetch`

---

## 7. Running the app

**Dev server limitation**: `npm run dev` fails to serve `src/data/cities.json` in the Vite dev server because Vite's module transform pipeline times out on the 8MB JSON file. This is a dev-only issue — the production build bundles it correctly.

**Workaround**: Use `npm run build && npm run preview` for local testing.

**Verified working** via Playwright headless browser automation — confirmed:
- Initial state: Country dropdown populated, City dropdown disabled, Refresh disabled
- After selecting United Kingdom → London: single API request to Open-Meteo, 200 response
- Weather Display renders: 13°C Overcast, H: 18°C L: 10°C, 24-hour hourly slots, 7-day forecast

---

## 8. Repository hygiene

- `.claude/settings.local.json` (Claude Code permission allowlist) was accidentally committed in the initial push
- Removed from tracking: `git rm -r --cached .claude/`
- Added `.claude/` to `.gitignore`
- Commit: `chore: remove .claude/ from version control`

---

## 9. Post-build: city list switched to GeoNames with population filter

**Motivation**: the dr5hn dataset includes every settlement regardless of size — villages, hamlets, administrative areas. For a weather use case only cities large enough to have distinct local weather matter, and the 8MB bundle was hitting Vite's dev-server module transform limit (causing `ERR_ABORTED`).

**Change**: `scripts/prepare-cities.mjs` rewritten to pull from **GeoNames `cities15000` dump** (`download.geonames.org`) and filter to population ≥ 100,000. Country names sourced from GeoNames `countryInfo.txt`.

**Result**:
- 6,047 cities across 171 countries (down from ~150,000 settlements)
- Bundle: ~300 KB (down from 8 MB)
- Dev server (`npm run dev`) now works without hitting Vite's transform timeout
- Deduplication: where GeoNames lists the same city name multiple times within a country, the highest-population entry is kept

**ADR updated**: `docs/adr/0002-static-bundled-city-list.md` records the rationale for switching source and the population floor decision.

Commit: `feat: filter city list to population ≥ 100k using GeoNames dataset`

**Follow-up — include duplicates with state disambiguation**: the previous version silently dropped duplicate city names within a country (kept only the highest-population one). Updated `prepare-cities.mjs` to:
- Download `admin1CodesASCII.txt` from GeoNames to resolve admin1 codes to state/region names
- Collect all cities without deduplication
- In a second pass, detect names that appear more than once within the same country and append the state name (e.g. `Springfield Illinois`, `Springfield Massachusetts`, `Springfield Missouri`)
- Cities with unique names within their country are unchanged (e.g. `London`)
- Result: 6,106 cities (59 more than before), ~310 KB

The City dropdown renders the `name` field directly, so disambiguated cities automatically show their state in the list.

Commit: `feat: include duplicate city names disambiguated with state name`

**Follow-up — append state to all cities**: changed from appending state only to duplicate names to appending `, StateName` to every city in the dataset (e.g. `London, England`, `Adelaide, South Australia`). The duplicate-detection logic was removed — it is no longer needed since every city name is now globally unique within its country. Bundle size: ~379 KB.

Commit: `feat: append state name to all cities using comma-space separator`

---

## Final state

**28 tests passing** across 5 test files:

| File | Tests | Covers |
|---|---|---|
| `src/lib/cityList.test.ts` | 6 | `getCitiesByCountry`, `getCountries` |
| `src/lib/weatherApi.test.ts` | 7 | Adapter URL construction, response mapping, error cases |
| `src/components/WeatherDisplay.test.tsx` | 7 | Current Conditions render, unit toggle, App controls |
| `src/components/HourlyForecast.test.tsx` | 4 | 24 slots, unit symbols |
| `src/components/WeeklyForecast.test.tsx` | 5 | 7 slots, unit symbols, conditions |

**GitHub**: https://github.com/vamsimohun/vm-weather-app  
**Issues**: #1 PRD, #2–#9 implementation slices (all closed)
