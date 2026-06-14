/**
 * Downloads GeoNames cities15000 dump and produces a compact city list
 * keyed by ISO2 country code, filtered to population >= MIN_POPULATION.
 * Every city name includes its state/region (e.g. "Springfield, Illinois").
 * Run once: node scripts/prepare-cities.mjs
 */

import { writeFileSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../src/data/cities.json')
const ZIP_PATH = '/tmp/geonames-cities15000.zip'
const MIN_POPULATION = 100_000

// GeoNames column indices in cities*.txt (tab-separated)
const COL_NAME = 1
const COL_LAT = 4
const COL_LON = 5
const COL_COUNTRY = 8
const COL_ADMIN1 = 10
const COL_POPULATION = 14

console.log('Downloading GeoNames country info...')
const countryRes = await fetch('https://download.geonames.org/export/dump/countryInfo.txt')
if (!countryRes.ok) throw new Error(`HTTP ${countryRes.status} fetching countryInfo.txt`)
const countryText = await countryRes.text()

const countryNames = {}
for (const line of countryText.split('\n')) {
  if (line.startsWith('#') || !line.trim()) continue
  const cols = line.split('\t')
  // col 0 = ISO2, col 4 = name
  if (cols.length > 4 && cols[0]) countryNames[cols[0]] = cols[4]
}
console.log(`Loaded ${Object.keys(countryNames).length} country names`)

console.log('Downloading GeoNames admin1 codes...')
const admin1Res = await fetch('https://download.geonames.org/export/dump/admin1CodesASCII.txt')
if (!admin1Res.ok) throw new Error(`HTTP ${admin1Res.status} fetching admin1CodesASCII.txt`)
const admin1Text = await admin1Res.text()

// "US.CA\tCalifornia\t..." → { "US.CA": "California" }
const admin1Names = {}
for (const line of admin1Text.split('\n')) {
  if (!line.trim()) continue
  const [code, name] = line.split('\t')
  if (code && name) admin1Names[code] = name
}
console.log(`Loaded ${Object.keys(admin1Names).length} admin1 state/region names`)

console.log('Downloading cities15000.zip...')
const zipRes = await fetch('https://download.geonames.org/export/dump/cities15000.zip')
if (!zipRes.ok) throw new Error(`HTTP ${zipRes.status} fetching cities15000.zip`)
writeFileSync(ZIP_PATH, Buffer.from(await zipRes.arrayBuffer()))

const EXTRACT_DIR = '/tmp/geonames-extract'
execSync(`mkdir -p ${EXTRACT_DIR} && unzip -o ${ZIP_PATH} cities15000.txt -d ${EXTRACT_DIR}`)
const tsv = readFileSync(`${EXTRACT_DIR}/cities15000.txt`, 'utf8')

// First pass: collect all qualifying cities, keeping the admin1 code temporarily
const byCountry = {}

for (const line of tsv.split('\n')) {
  if (!line.trim()) continue
  const cols = line.split('\t')
  const name = cols[COL_NAME]
  const lat = parseFloat(cols[COL_LAT])
  const lon = parseFloat(cols[COL_LON])
  const countryCode = cols[COL_COUNTRY]
  const admin1Code = cols[COL_ADMIN1]
  const population = parseInt(cols[COL_POPULATION], 10)

  if (!name || isNaN(lat) || isNaN(lon) || !countryCode) continue
  if (population < MIN_POPULATION) continue

  if (!byCountry[countryCode]) {
    byCountry[countryCode] = { name: countryNames[countryCode] ?? countryCode, cities: [] }
  }
  byCountry[countryCode].cities.push({ name, lat, lon, _admin1: admin1Code })
}

// Second pass: append ", StateName" to every city
for (const [countryCode, entry] of Object.entries(byCountry)) {
  for (const city of entry.cities) {
    if (city._admin1) {
      const stateName = admin1Names[`${countryCode}.${city._admin1}`]
      if (stateName) city.name = `${city.name}, ${stateName}`
    }
    delete city._admin1
  }

  entry.cities.sort((a, b) => a.name.localeCompare(b.name))
}

// Remove countries with no qualifying cities
for (const code of Object.keys(byCountry)) {
  if (byCountry[code].cities.length === 0) delete byCountry[code]
}

writeFileSync(OUT, JSON.stringify(byCountry))
const kb = (Buffer.byteLength(JSON.stringify(byCountry)) / 1024).toFixed(1)
const totalCities = Object.values(byCountry).reduce((n, e) => n + e.cities.length, 0)
console.log(
  `Written ${Object.keys(byCountry).length} countries, ` +
    `${totalCities} cities ≥ ${MIN_POPULATION.toLocaleString()} pop, ` +
    `~${kb} KB → ${OUT}`,
)
