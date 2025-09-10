"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  Eye, 
  EyeOff, 
  Navigation, 
  Layers, 
  Activity,
  Truck,
  Building,
  Droplets,
  AlertTriangle,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  List,
  X,
  Locate
} from "lucide-react"
import dynamic from "next/dynamic"
import { stationApi, vehicleApi, hydrantApi, incidentApi, type Station, type Vehicle, type Hydrant, type Incident } from "@/lib/api"

// Dynamic import only for Google Maps to avoid SSR issues
const MapContent = dynamic(() => import('./google-map-content'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Google Maps...</div>
})

// Import LiveTracking directly to avoid dynamic import conflicts
import { LiveTracking } from './live-tracking'

interface LayerState {
  stations: boolean
  vehicles: boolean
  hydrants: boolean
  incidents: boolean
  personnel: boolean
}

export function FireMap() {
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]) // Delhi coordinates as tuple
  const [zoom, setZoom] = useState(12)
  const [layers, setLayers] = useState<LayerState>({
    stations: true,
    vehicles: true,
    hydrants: true,
    incidents: true,
    personnel: false
  })
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [showEntitiesPanel, setShowEntitiesPanel] = useState(false)
  
  // Real data state
  const [stations, setStations] = useState<Station[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [hydrants, setHydrants] = useState<Hydrant[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [stationsData, vehiclesData, hydrantsData, incidentsData] = await Promise.all([
          stationApi.getAll({ limit: 100 }),
          vehicleApi.getAll({ limit: 100 }),
          hydrantApi.getAll({ limit: 100 }),
          incidentApi.getAll({ limit: 100 })
        ])
        
        setStations(stationsData.stations)
        setVehicles(vehiclesData.vehicles)
        setHydrants(hydrantsData.hydrants)
        setIncidents(incidentsData.incidents)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  const toggleLayer = useCallback((layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }, [])

  const handleVehicleSelect = useCallback((vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setShowEntitiesPanel(true)
    // Center map on selected vehicle
    if (vehicle.latitude && vehicle.longitude) {
      setCenter([vehicle.latitude, vehicle.longitude])
      setZoom(16)
    }
  }, [])

  const handleLocate = useCallback(() => {
    // Reset to default center and zoom
    setCenter([28.6139, 77.2090])
    setZoom(12)
    setSelectedVehicle(undefined)
  }, [])

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Floating Control Panels */}
      
      {/* Layers Panel */}
      <div className={`absolute top-2 left-2 z-10 transition-all duration-300 ${
        showLayersPanel ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Card className="w-72 sm:w-80 border-gray-300 max-h-[calc(100vh-4rem)] overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLayersPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={layers.stations ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("stations")}
              className="w-full justify-start"
            >
              {layers.stations ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Building className="h-4 w-4 mr-2" />
              Fire Stations
            </Button>
            <Button
              variant={layers.vehicles ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("vehicles")}
              className="w-full justify-start"
            >
              {layers.vehicles ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Truck className="h-4 w-4 mr-2" />
              Vehicles
            </Button>
            <Button
              variant={layers.hydrants ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("hydrants")}
              className="w-full justify-start"
            >
              {layers.hydrants ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Droplets className="h-4 w-4 mr-2" />
              Hydrants
            </Button>
            <Button
              variant={layers.incidents ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("incidents")}
              className="w-full justify-start"
            >
              {layers.incidents ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents
            </Button>
            <Button
              variant={layers.personnel ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("personnel")}
              className="w-full justify-start"
            >
              {layers.personnel ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Users className="h-4 w-4 mr-2" />
              Personnel
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Entities Panel */}
      <div className={`absolute top-2 right-2 z-10 transition-all duration-300 ${
        showEntitiesPanel ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <Card className="w-72 sm:w-80 border-gray-300 max-h-[calc(100vh-4rem)] overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <List className="h-5 w-5" />
                Live Tracking
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEntitiesPanel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-sm text-gray-500">Loading vehicles...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-sm text-red-500">Error loading vehicles: {error}</div>
              </div>
            ) : (
              <LiveTracking 
                vehicles={vehicles}
                onVehicleSelect={handleVehicleSelect}
                selectedVehicle={selectedVehicle}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLayersPanel(!showLayersPanel)}
          className="bg-white border-gray-300 hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Layers</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEntitiesPanel(!showEntitiesPanel)}
          className="bg-white border-gray-300 hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Entities</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLocate}
          className="bg-white border-gray-300 hover:bg-gray-50 text-xs sm:text-sm border border-gray-200"
        >
          <Locate className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Locate</span>
        </Button>
      </div>

      {/* Map */}
      <div className="h-full">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium">Loading Map Data...</div>
              <div className="text-sm text-gray-500 mt-2">Fetching stations, vehicles, and incidents</div>
            </div>
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium text-red-600">Error Loading Map</div>
              <div className="text-sm text-gray-500 mt-2">{error}</div>
            </div>
          </div>
        ) : (
          <MapContent
            center={center}
            zoom={zoom}
            layers={layers}
            stations={stations}
            vehicles={vehicles}
            hydrants={hydrants}
            incidents={incidents}
            getStatusColor={(status: string) => {
              switch (status.toLowerCase()) {
                case "on_scene": return "destructive"
                case "en_route": return "warning"
                case "in_service": return "success"
                case "active": return "success"
                case "damaged": return "destructive"
                case "out_of_service": return "destructive"
                default: return "secondary"
              }
            }}
            getSeverityColor={(severity: string) => {
              switch (severity.toLowerCase()) {
                case "critical": return "destructive"
                case "high": return "destructive"
                case "medium": return "warning"
                case "low": return "success"
                default: return "secondary"
              }
            }}
          />
        )}
      </div>
    </div>
  )
}