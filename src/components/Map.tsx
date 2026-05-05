'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'

// указываю CDN, тк относительный путь не работает.
import L from 'leaflet'
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface MapProps {
  onMapClick: (lat: number, lon: number) => void
}

function ClickHandler({ onMapClick }: MapProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function Map({ onMapClick }: MapProps) {
  const [marker, setMarker] = useState<LatLng | null>(null)

  function handleClick(lat: number, lon: number) {
    setMarker(new LatLng(lat, lon))
    onMapClick(lat, lon)
  }

  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={5}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <ClickHandler onMapClick={handleClick} />
      {marker && <Marker position={marker} />}
    </MapContainer>
  )
}