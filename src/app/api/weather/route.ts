import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { fetchWeatherFromYandex } from '@/lib/yandex'
import { WeatherData } from '@/types/weather'

const roundTo = 2 // точность 1km

function round(value: number): number {
  return parseFloat(value.toFixed(roundTo))
}

export async function GET(request: NextRequest) {
  console.log('пришел запрос:', request.nextUrl.searchParams.toString())

  const { searchParams } = request.nextUrl
  const latRaw = searchParams.get('lat')
  const lonRaw = searchParams.get('lon')

  if (!latRaw || !lonRaw) {
    return NextResponse.json(
      { error: 'Параметры lat и lon обязательны' },
      { status: 400 }
    )
  }

  const lat = round(parseFloat(latRaw))
  const lon = round(parseFloat(lonRaw))

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { error: 'lat и lon должны быть числами' },
      { status: 400 }
    )
  }

  try {
    const cached = await pool.query<{ data: WeatherData }>(    // проверяю кэш и его актуальность (1час)
      `SELECT data FROM weather_cache
            WHERE lat = ${lat} AND lon = ${lon}
            AND fetched_at > NOW() - INTERVAL '1 hour'
            LIMIT 1`,
    )

    console.log('результат из бд:', cached.rows)

    if (cached.rows.length > 0) {
      return NextResponse.json({
        ...cached.rows[0].data,
        cached: true,
      })
    }

    const weatherData = await fetchWeatherFromYandex(lat, lon)

    await pool.query(                                            // обновляем/добавляем запись в бд
      `INSERT INTO weather_cache (lat, lon, data, fetched_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (lat, lon)
            DO UPDATE SET data = $3, fetched_at = NOW()`,
      [lat, lon, JSON.stringify(weatherData)]
    )

    return NextResponse.json({ ...weatherData, cached: false })

  } catch (error) {
    console.error('Запрос с ошибкой:', error)
    return NextResponse.json(
      { error: 'Не удалось получить данные' },
      { status: 500 }
    )
  }
}