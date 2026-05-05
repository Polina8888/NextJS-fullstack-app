export interface WeatherData {
  temp: number
  feels_like: number
  wind_speed: number
  humidity: number
  condition: string
  icon: string
}

// строчка из табл weather_cache
export interface WeatherCacheRow {
  id: number
  lat: number
  lon: number
  data: WeatherData
  fetched_at: Date
}