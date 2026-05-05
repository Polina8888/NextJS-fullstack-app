'use client'

import { WeatherData } from '@/types/weather'
import styles from './WeatherCard.module.css'

interface WeatherCardProps {
  weather: WeatherData
  coords: { lat: number; lon: number }
}

export default function WeatherCard({ weather, coords }: WeatherCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.coords}>
        {coords.lat.toFixed(4)}, {coords.lon.toFixed(4)}
      </p>
      <img
        src={`https://yastatic.net/weather/i/icons/funky/dark/${weather.icon}.svg`}
        alt={weather.condition}
        className={styles.icon}
      />
      <p className={styles.condition}>{weather.condition}</p>
      <p className={styles.temp}>{weather.temp}°C</p>
      <div className={styles.details}>
        <span>Ощущается: {weather.feels_like}°C</span>
        <span>Ветер: {weather.wind_speed} м/с</span>
        <span>Влажность: {weather.humidity}%</span>
      </div>
    </div>
  )
}