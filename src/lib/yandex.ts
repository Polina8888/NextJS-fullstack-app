import { WeatherData } from '@/types/weather'

export async function fetchWeatherFromYandex(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = process.env.YANDEX_WEATHER_API_KEY

  if (!apiKey) {
    throw new Error('API ключ не задан')
  }

  const url = `https://api.weather.yandex.ru/v2/forecast?lat=${lat}&lon=${lon}&lang=ru_RU&limit=1`

  const response = await fetch(url, {
    headers: {
      'X-Yandex-Weather-Key': apiKey,
    },
  })

  if (!response.ok) {
    throw new Error(`Запрос завершился с ошибкой: ${response.status}`)
  }

  const json = await response.json()
  const fact = json.fact

  return {
    temp: fact.temp,
    feels_like: fact.feels_like,
    wind_speed: fact.wind_speed,
    humidity: fact.humidity,
    condition: fact.condition,
    icon: fact.icon,
  }
}