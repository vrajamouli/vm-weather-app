import type { WeatherData, TemperatureUnit } from '../lib/weatherApi'
import CurrentConditions from './CurrentConditions'
import HourlyForecast from './HourlyForecast'
import WeeklyForecast from './WeeklyForecast'

interface Props {
  data: WeatherData
  unit: TemperatureUnit
}

export default function WeatherDisplay({ data, unit }: Props) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <CurrentConditions data={data.current} unit={unit} />
      <HourlyForecast slots={data.hourly} unit={unit} />
      <WeeklyForecast days={data.daily} unit={unit} />
    </div>
  )
}
