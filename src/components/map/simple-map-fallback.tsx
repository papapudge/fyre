"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LayerVisibility {
  stations: boolean
  vehicles: boolean
  hydrants: boolean
  incidents: boolean
}

interface SimpleMapFallbackProps {
  center: [number, number]
  zoom: number
  layers: LayerVisibility
  stations: any[]
  vehicles: any[]
  hydrants: any[]
  incidents: any[]
  getStatusColor: (status: string) => string
  getSeverityColor: (severity: string) => string
}

export default function SimpleMapFallback({
  center,
  zoom,
  layers,
  stations,
  vehicles,
  hydrants,
  incidents,
  getStatusColor,
  getSeverityColor
}: SimpleMapFallbackProps) {
  return (
    <div className="h-full w-full bg-gray-100 relative overflow-hidden">
      {/* Mock Map Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 70%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)
          `
        }}
      >
        {/* Grid pattern to simulate map */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #000 1px, transparent 1px),
              linear-gradient(to bottom, #000 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Center Coordinates Display */}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow-md">
        <div className="text-xs font-mono">
          Center: {center[0].toFixed(4)}, {center[1].toFixed(4)}
        </div>
        <div className="text-xs text-gray-500">Zoom: {zoom}</div>
      </div>

      {/* Mock Markers - Stations */}
      {layers.stations && (stations || []).map((station, index) => (
        <div
          key={`station-${station.id}`}
          className="absolute w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
          title={station.name}
        >
          🏢
        </div>
      ))}

      {/* Mock Markers - Vehicles */}
      {layers.vehicles && (vehicles || []).map((vehicle, index) => (
        <div
          key={`vehicle-${vehicle.id}`}
          className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
          title={vehicle.name}
        >
          🚒
        </div>
      ))}

      {/* Mock Markers - Hydrants */}
      {layers.hydrants && (hydrants || []).map((hydrant, index) => (
        <div
          key={`hydrant-${hydrant.id}`}
          className="absolute w-6 h-6 bg-cyan-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
          title={hydrant.hydrantId}
        >
          💧
        </div>
      ))}

      {/* Mock Markers - Incidents */}
      {layers.incidents && (incidents || []).map((incident, index) => (
        <div
          key={`incident-${incident.id}`}
          className="absolute w-10 h-10 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform animate-pulse"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`
          }}
          title={incident.incidentNumber}
        >
          🔥
        </div>
      ))}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md">
        <div className="text-xs font-semibold mb-2">Map Legend</div>
        <div className="space-y-1 text-xs">
          {layers.stations && <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-xs">🏢</div><span>Stations ({(stations || []).length})</span></div>}
          {layers.vehicles && <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">🚒</div><span>Vehicles ({(vehicles || []).length})</span></div>}
          {layers.hydrants && <div className="flex items-center gap-2"><div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center text-xs">💧</div><span>Hydrants ({(hydrants || []).length})</span></div>}
          {layers.incidents && <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center text-xs">🔥</div><span>Incidents ({(incidents || []).length})</span></div>}
        </div>
      </div>

      {/* Fallback Notice */}
      <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-3 py-2 rounded text-xs">
        <div className="font-semibold">Fallback Map</div>
        <div>Google Maps API not available</div>
      </div>
    </div>
  )
}