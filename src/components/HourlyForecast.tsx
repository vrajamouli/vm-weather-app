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
    <div className="overflow-hidden rounded-2xl bg-white">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-xs font-medium uppercase tracking-widest text-gray-400">
          Today's Hourly Forecast
        </h2>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-0 pb-0" style={{ minWidth: 'max-content' }}>
          {slots.map((slot, i) => (
            <div
              key={slot.hour}
              className="flex w-[4.5rem] flex-col items-center gap-1.5 px-2 py-4 text-center"
              style={{
                borderRight: i < slots.length - 1 ? '1px solid #F3F4F6' : 'none',
              }}
            >
              <span
                className="text-xs text-gray-400"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {formatHour(slot.hour)}
              </span>
              <span
                className="text-sm font-medium text-gray-900"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {Math.round(slot.temperature)}{unitSymbol(unit)}
              </span>
              <span className="text-xs leading-tight text-gray-400">{slot.condition}</span>
              <span
                className="text-xs font-medium"
                style={{ color: slot.precipitationChance > 0 ? '#2563EB' : '#D1D5DB' }}
              >
                {slot.precipitationChance}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
