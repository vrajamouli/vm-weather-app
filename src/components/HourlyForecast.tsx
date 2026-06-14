import type { WeatherData, TemperatureUnit } from '../lib/weatherApi'

interface Props {
  slots: WeatherData['hourly']
  unit: TemperatureUnit
}

const unitSymbol = (u: TemperatureUnit) => (u === 'celsius' ? '°C' : '°F')

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM'
  if (hour < 12) return `${hour} AM`
  if (hour === 12) return '12 PM'
  return `${hour - 12} PM`
}

export default function HourlyForecast({ slots, unit }: Props) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Today's Hourly Forecast</h2>
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
          {slots.map((slot) => (
            <div
              key={slot.hour}
              className="flex w-16 flex-col items-center gap-1 rounded-lg bg-gray-50 px-2 py-3 text-center"
            >
              <span className="text-xs font-medium text-gray-500">{formatHour(slot.hour)}</span>
              <span className="text-sm font-semibold text-gray-800">
                {Math.round(slot.temperature)}{unitSymbol(unit)}
              </span>
              <span className="text-xs text-gray-500 leading-tight">{slot.condition}</span>
              <span className="text-xs text-blue-600">{slot.precipitationChance}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
