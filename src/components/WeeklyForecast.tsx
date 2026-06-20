import type { WeatherData, TemperatureUnit } from '../lib/weatherApi'

interface Props {
  days: WeatherData['daily']
  unit: TemperatureUnit
}

const unitSymbol = (u: TemperatureUnit) => (u === 'celsius' ? '°C' : '°F')

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function WeeklyForecast({ days, unit }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400">
          7-Day Forecast
        </h2>
      </div>
      <div className="divide-y divide-gray-50">
        {days.map((day) => (
          <div key={day.date} className="flex items-center gap-3 px-6 py-3.5">
            <span
              className="w-24 shrink-0 text-sm font-medium text-gray-700"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {formatDate(day.date)}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-gray-400">
              {day.condition}
            </span>
            <span
              className="w-8 shrink-0 text-right text-sm font-medium"
              style={{
                fontFamily: "'DM Mono', monospace",
                color: day.precipitationChance > 0 ? '#2563EB' : '#D1D5DB',
              }}
            >
              {day.precipitationChance}%
            </span>
            <div
              className="shrink-0 text-sm"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <span className="font-medium text-gray-900">
                H: {Math.round(day.high)}{unitSymbol(unit)}
              </span>
              <span className="mx-1 text-gray-300">/</span>
              <span className="text-gray-400">
                L: {Math.round(day.low)}{unitSymbol(unit)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
