import type { WeatherData, TemperatureUnit } from '../lib/weatherApi'

interface Props {
  data: WeatherData['current']
  unit: TemperatureUnit
}

const unitSymbol = (u: TemperatureUnit) => (u === 'celsius' ? '°C' : '°F')

function skyGradient(condition: string): string {
  const c = condition.toLowerCase()
  const h = new Date().getHours()
  const night = h < 6 || h >= 20

  if (c.includes('thunder') || c.includes('storm')) {
    return night
      ? 'linear-gradient(to bottom, #0D1520, #1C2535)'
      : 'linear-gradient(to bottom, #1C2A3A, #4A5568)'
  }
  if (c.includes('heavy rain') || c.includes('dense')) {
    return night
      ? 'linear-gradient(to bottom, #0F2030, #1E3040)'
      : 'linear-gradient(to bottom, #2C4A62, #506D7E)'
  }
  if (c.includes('rain') || c.includes('shower')) {
    return night
      ? 'linear-gradient(to bottom, #0F2233, #1E3448)'
      : 'linear-gradient(to bottom, #2E4F6A, #607D8B)'
  }
  if (c.includes('drizzle')) {
    return night
      ? 'linear-gradient(to bottom, #111E2C, #1E2E40)'
      : 'linear-gradient(to bottom, #3D5F7A, #7A9BB0)'
  }
  if (c.includes('snow') || c.includes('blizzard') || c.includes('ice') || c.includes('sleet') || c.includes('frost')) {
    return night
      ? 'linear-gradient(to bottom, #1A2535, #2D3E52)'
      : 'linear-gradient(to bottom, #7191A7, #D5E2EA)'
  }
  if (c.includes('fog') || c.includes('rime') || c.includes('haze')) {
    return night
      ? 'linear-gradient(to bottom, #1A1E24, #2C3038)'
      : 'linear-gradient(to bottom, #8A939C, #C5CACF)'
  }
  if (c.includes('overcast')) {
    return night
      ? 'linear-gradient(to bottom, #161A20, #262C35)'
      : 'linear-gradient(to bottom, #607080, #A8B4BE)'
  }
  if (c.includes('partly cloudy') || c.includes('mainly clear') || c.includes('cloudy')) {
    return night
      ? 'linear-gradient(to bottom, #0B1628, #1C3054)'
      : 'linear-gradient(to bottom, #4A7DAB, #AFC8DC)'
  }
  // Clear sky
  return night
    ? 'linear-gradient(to bottom, #0B1628, #1C3054)'
    : 'linear-gradient(to bottom, #1565C0, #90CAF9)'
}

export default function CurrentConditions({ data, unit }: Props) {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: skyGradient(data.condition) }}
    >
      <div className="px-7 py-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">
          Current Conditions
        </p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div
              className="leading-none text-white"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 'clamp(3.5rem, 10vw, 5rem)',
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              {Math.round(data.temperature)}{unitSymbol(unit)}
            </div>
            <div className="mt-2 text-base font-light text-white/75">
              {data.condition}
            </div>
          </div>
          <div
            className="shrink-0 text-right text-sm text-white/55 leading-relaxed"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            <div>H: {Math.round(data.high)}{unitSymbol(unit)}</div>
            <div>L: {Math.round(data.low)}{unitSymbol(unit)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
