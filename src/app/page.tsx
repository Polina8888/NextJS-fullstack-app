'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { WeatherData } from '@/types/weather'
import WeatherCard from '../components/WeatherCard'
import styles from './page.module.css'

const Map = dynamic(() => import('../components/Map'), { ssr: false })

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleMapClick(lat: number, lon: number) {
    setCoords({ lat, lon })
    setLoading(true)
    setWeather(null)

    try {
      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      const data = await res.json()
      setWeather(data)
    } catch (e) {
      console.error('Ошибка загрузки:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Погода на карте</h1>
      <div className={styles.container}>
        <Map onMapClick={handleMapClick} />
        <div className={styles.sidebar}>
          {!coords && <p className={styles.hint}>Кликните на карту, чтобы узнать погоду</p>}
          {loading && <p className={styles.loading}>Загрузка...</p>}
          {weather && !loading && <WeatherCard coords={coords!} weather={weather}/>}
        </div>
      </div>
    </main>
  )
}