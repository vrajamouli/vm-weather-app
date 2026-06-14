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
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">7-Day Forecast</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {days.map((day) => (
          <div key={day.date} className="flex items-center justify-between py-3">
            <span className="w-28 text-sm font-medium text-gray-700">{formatDate(day.date)}</span>
            <span className="flex-1 text-sm text-gray-500">{day.condition}</span>
            <span className="text-sm text-blue-600 w-10 text-right">{day.precipitationChance}%</span>
            <div className="ml-4 flex gap-2 text-sm font-semibold">
              <span className="text-gray-800">H: {Math.round(day.high)}{unitSymbol(unit)}</span>
              <span className="text-gray-400">L: {Math.round(day.low)}{unitSymbol(unit)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
