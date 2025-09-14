"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { 
  Navigation, 
  Clock, 
  Wifi, 
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  Truck
} from "lucide-react"

// Client-side only time component to avoid hydration issues
function ClientTime({ date }: { date: Date }) {
  const [timeString, setTimeString] = useState("")
  
  useEffect(() => {
    setTimeString(date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }))
  }, [date])
  
  return <span className="text-xs text-gray-500">{timeString}</span>
}

interface Vehicle {
  id: string
  name: string
  latitude?: number
  longitude?: number
  status: string
  type: string
  lastLocationUpdate?: string
  speed?: number
  heading?: number
  isOnline?: boolean
}

interface LiveTrackingProps {
  vehicles: Vehicle[]
  onVehicleSelect: (vehicle: Vehicle) => void
  selectedVehicle?: Vehicle
}

export function LiveTracking({ vehicles, onVehicleSelect, selectedVehicle }: LiveTrackingProps) {
  const { isTracking, toggleTracking } = useRealtimeData()
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [onlineVehicles, setOnlineVehicles] = useState<number>(0)

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      // Simulate vehicle movement and status updates
      setLastUpdate(new Date())
      
      // Count online vehicles
      const online = vehicles.filter(v => v.isOnline).length
      setOnlineVehicles(online)
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isTracking, vehicles])

  // Use the toggleTracking from the hook

  const resetTracking = () => {
    setLastUpdate(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on scene": return "destructive"
      case "en route": return "warning"
      case "in service": return "success"
      case "responding": return "warning"
      default: return "secondary"
    }
  }

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "engine": return "🚒"
      case "ladder": return "🪜"
      case "ambulance": return "🚑"
      case "rescue": return "🚁"
      default: return "🚗"
    }
  }

  return (
    <div className="space-y-4">
      {/* Tracking Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">Live Tracking</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTracking ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">
              {isTracking ? "Tracking Active" : "Tracking Paused"}
            </span>
          </div>
          <Badge variant={isTracking ? "success" : "secondary"} className="text-xs">
            {onlineVehicles} Online
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={toggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="flex-1"
          >
            {isTracking ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Start
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={resetTracking}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last update: <ClientTime date={lastUpdate} />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">Active Vehicles</span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <Truck className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-500">No vehicles available</p>
              <p className="text-xs text-gray-400 mt-1">Add vehicles to start tracking</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedVehicle?.id === vehicle.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onVehicleSelect(vehicle)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getVehicleIcon(vehicle.type)}</span>
                    <div>
                      <div className="font-medium text-sm">{vehicle.name}</div>
                      <div className="text-xs text-gray-500">{vehicle.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(vehicle.status) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                      {vehicle.status}
                    </Badge>
                    <div className="flex items-center gap-1 mt-1">
                      {vehicle.isOnline !== false ? (
                        <Wifi className="h-3 w-3 text-green-500" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-gray-400" />
                      )}
                      <ClientTime date={vehicle.lastLocationUpdate ? new Date(vehicle.lastLocationUpdate) : new Date()} />
                    </div>
                  </div>
                </div>
                
                {vehicle.speed && (
                  <div className="mt-2 text-xs text-gray-600">
                    Speed: {vehicle.speed} mph
                    {vehicle.heading && ` • Heading: ${vehicle.heading}°`}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
