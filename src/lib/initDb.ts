import pool from './db'

export async function initDb() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_cache (
        id          SERIAL PRIMARY KEY,
        lat         NUMERIC(9,6)  NOT NULL,
        lon         NUMERIC(9,6)  NOT NULL,
        data        JSONB         NOT NULL,
        fetched_at  TIMESTAMP     NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_weather_cache_lat_lon
        ON weather_cache (lat, lon);
    `)
}