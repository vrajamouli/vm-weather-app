# Use a static bundled city list instead of a runtime geocoding API

The City List is a static JSON dataset bundled with the app at build time, sourced from **GeoNames `cities15000` dump** (public domain, `download.geonames.org`). It is filtered to cities with population ≥ 100,000, yielding ~6,000 cities across 171 countries. Each entry carries city name, country code, lat, and lon. When a user selects a City, the app reads coordinates from this dataset and passes them directly to Open-Meteo — no geocoding API call is made at runtime.

The alternative (querying a geocoding service such as GeoDB Cities or GeoNames at runtime) would add a second external API dependency, a second failure point, and potential cost. Since Open-Meteo is coordinate-based, the coordinates must come from somewhere; bundling them with the city data eliminates the need for a runtime lookup entirely.

The dataset was originally sourced from `dr5hn/countries-states-cities-database`, which includes all settlements regardless of size. Switched to GeoNames with a 100,000 population floor to reduce bundle size (8 MB → ~300 KB) and surface only cities relevant to a weather use case. GeoNames was chosen over the dr5hn dataset because it includes population figures, enabling this filter.
