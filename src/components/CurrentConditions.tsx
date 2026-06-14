import type { WeatherData } from '../lib/weatherApi'
import type { TemperatureUnit } from '../lib/weatherApi'

interface Props {
  data: WeatherData['current']
  unit: TemperatureUnit
}

const unitSymbol = (u: TemperatureUnit) => (u === 'celsius' ? '°C' : '°F')

export default function CurrentConditions({ data, unit }: Props) {
  return (
    <div className="rounded-xl bg-blue-50 p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Current Conditions</h2>
      <div className="flex items-center gap-6">
        <span className="text-5xl font-bold text-blue-700">
          {Math.round(data.temperature)}{unitSymbol(unit)}
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-base text-gray-700">{data.condition}</span>
          <span className="text-sm text-gray-500">
            H: {Math.round(data.high)}{unitSymbol(unit)} · L: {Math.round(data.low)}{unitSymbol(unit)}
          </span>
        </div>
      </div>
    </div>
  )
}
