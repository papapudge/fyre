"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
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
  Settings,
  Locate
} from "lucide-react"
import dynamic from "next/dynamic"
import { 
  type Station, 
  type Vehicle, 
  type Hydrant, 
  type Incident, 
  stationApi, 
  vehicleApi, 
  hydrantApi, 
  incidentApi 
} from "@/lib/api"

// Simple fallback map (no Google Maps API required)
const MapContent = dynamic(() => import('./simple-map-fallback'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading Map...</div>
})

// Import LiveTracking directly to avoid dynamic import conflicts
import { LiveTracking } from './live-tracking'

// Mock data for fallback when API calls fail
const mockStations: Station[] = [
  {
    id: "station1",
    name: "Fire Station 1",
    address: "123 Main Street, Delhi",
    latitude: 28.6139,
    longitude: 77.2090,
    phone: "+91-11-2345-6789",
    capacity: 50,
    isActive: true,
    coverage: 5.2,
    population: 25000,
    established: "1985",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "station2",
    name: "Fire Station 2",
    address: "456 North Avenue, Delhi",
    latitude: 28.6289,
    longitude: 77.2190,
    phone: "+91-11-2345-6790",
    capacity: 35,
    isActive: true,
    coverage: 4.8,
    population: 20000,
    established: "1992",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "station3",
    name: "Fire Station 3",
    address: "789 South Road, Delhi",
    latitude: 28.5989,
    longitude: 77.1990,
    phone: "+91-11-2345-6791",
    capacity: 40,
    isActive: true,
    coverage: 6.1,
    population: 30000,
    established: "1978",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

const mockVehicles: Vehicle[] = [
  {
    id: "vehicle1",
    unitId: "E-01",
    type: "ENGINE",
    name: "Engine 1",
    stationId: "station1",
    status: "IN_SERVICE",
    latitude: 28.6139,
    longitude: 77.2090,
    lastLocationUpdate: "2024-01-15T10:30:00Z",
    fuelLevel: 85,
    capabilities: ["Fire Suppression", "Water Rescue", "Medical Support"],
    year: 2018,
    make: "Pierce",
    model: "Pumper",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "vehicle2",
    unitId: "L-01",
    type: "LADDER",
    name: "Ladder 1",
    stationId: "station1",
    status: "EN_ROUTE",
    latitude: 28.6200,
    longitude: 77.2150,
    lastLocationUpdate: "2024-01-15T10:25:00Z",
    fuelLevel: 92,
    capabilities: ["Aerial Operations", "Rescue", "Ventilation"],
    year: 2020,
    make: "Pierce",
    model: "Ladder Truck",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:25:00Z"
  },
  {
    id: "vehicle3",
    unitId: "R-01",
    type: "RESCUE",
    name: "Rescue 1",
    stationId: "station2",
    status: "ON_SCENE",
    latitude: 28.6289,
    longitude: 77.2190,
    lastLocationUpdate: "2024-01-15T10:20:00Z",
    fuelLevel: 78,
    capabilities: ["Heavy Rescue", "Technical Rescue", "Hazmat"],
    year: 2019,
    make: "Spartan",
    model: "Heavy Rescue",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:20:00Z"
  },
  {
    id: "vehicle4",
    unitId: "A-01",
    type: "AMBULANCE",
    name: "Ambulance 1",
    stationId: "station2",
    status: "IN_SERVICE",
    latitude: 28.6250,
    longitude: 77.2100,
    lastLocationUpdate: "2024-01-15T10:35:00Z",
    fuelLevel: 65,
    capabilities: ["Advanced Life Support", "Emergency Medical"],
    year: 2021,
    make: "Mercedes",
    model: "Sprinter",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:35:00Z"
  },
  {
    id: "vehicle5",
    unitId: "E-02",
    type: "ENGINE",
    name: "Engine 2",
    stationId: "station3",
    status: "OUT_OF_SERVICE",
    latitude: 28.5989,
    longitude: 77.1990,
    lastLocationUpdate: "2024-01-15T09:45:00Z",
    fuelLevel: 45,
    capabilities: ["Fire Suppression", "Water Supply"],
    year: 2015,
    make: "Pierce",
    model: "Pumper",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T09:45:00Z"
  }
]

const mockHydrants: Hydrant[] = [
  {
    id: "hydrant1",
    hydrantId: "H-001",
    stationId: "station1",
    latitude: 28.6149,
    longitude: 77.2080,
    flowRate: 1500,
    pressure: 65,
    status: "ACTIVE",
    type: "WET_BARREL",
    lastInspection: "2023-12-15",
    nextInspection: "2024-06-15",
    accessibility: "Street side",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "hydrant2",
    hydrantId: "H-002",
    stationId: "station1",
    latitude: 28.6129,
    longitude: 77.2100,
    flowRate: 1200,
    pressure: 58,
    status: "ACTIVE",
    type: "DRY_BARREL",
    lastInspection: "2023-11-20",
    nextInspection: "2024-05-20",
    accessibility: "Parking area",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "hydrant3",
    hydrantId: "H-003",
    stationId: "station2",
    latitude: 28.6299,
    longitude: 77.2180,
    flowRate: 1800,
    pressure: 72,
    status: "ACTIVE",
    type: "WET_BARREL",
    lastInspection: "2024-01-10",
    nextInspection: "2024-07-10",
    accessibility: "Sidewalk",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "hydrant4",
    hydrantId: "H-004",
    stationId: "station3",
    latitude: 28.5999,
    longitude: 77.1980,
    flowRate: 0,
    pressure: 0,
    status: "DAMAGED",
    type: "WET_BARREL",
    lastInspection: "2023-10-05",
    nextInspection: "2024-04-05",
    accessibility: "Construction area",
    isActive: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

const mockIncidents: Incident[] = [
  {
    id: "incident1",
    incidentNumber: "2024-0001",
    type: "FIRE",
    severity: "HIGH",
    status: "ON_SCENE",
    title: "Structure Fire - Commercial Building",
    description: "Fire reported in 3-story commercial building",
    latitude: 28.6200,
    longitude: 77.2150,
    address: "789 Business District, Delhi",
    stationId: "station1",
    callerName: "Security Guard",
    callerPhone: "+91-98765-43210",
    reportedAt: "2024-01-15T10:15:00Z",
    dispatchedAt: "2024-01-15T10:17:00Z",
    arrivedAt: "2024-01-15T10:25:00Z",
    injuries: 0,
    fatalities: 0,
    tags: ["Commercial", "High Rise"],
    createdAt: "2024-01-15T10:15:00Z",
    updatedAt: "2024-01-15T10:25:00Z"
  },
  {
    id: "incident2",
    incidentNumber: "2024-0002",
    type: "MEDICAL",
    severity: "MEDIUM",
    status: "DISPATCHED",
    title: "Medical Emergency - Heart Attack",
    description: "Chest pain reported, possible heart attack",
    latitude: 28.6089,
    longitude: 77.2040,
    address: "456 Residential Area, Delhi",
    stationId: "station2",
    callerName: "Family Member",
    callerPhone: "+91-87654-32109",
    reportedAt: "2024-01-15T10:30:00Z",
    dispatchedAt: "2024-01-15T10:32:00Z",
    injuries: 1,
    fatalities: 0,
    tags: ["Medical", "Cardiac"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:32:00Z"
  },
  {
    id: "incident3",
    incidentNumber: "2024-0003",
    type: "RESCUE",
    severity: "CRITICAL",
    status: "ACTIVE",
    title: "Vehicle Accident - Highway",
    description: "Multi-vehicle accident on highway, people trapped",
    latitude: 28.5950,
    longitude: 77.1950,
    address: "Highway NH-1, Delhi",
    stationId: "station3",
    callerName: "Witness",
    callerPhone: "+91-76543-21098",
    reportedAt: "2024-01-15T09:45:00Z",
    dispatchedAt: "2024-01-15T09:47:00Z",
    arrivedAt: "2024-01-15T09:58:00Z",
    injuries: 3,
    fatalities: 0,
    tags: ["Traffic", "Rescue", "Highway"],
    createdAt: "2024-01-15T09:45:00Z",
    updatedAt: "2024-01-15T09:58:00Z"
  }
]

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
    personnel: true
  })
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined)
  
  // Real data state
  const [stations, setStations] = useState<Station[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [hydrants, setHydrants] = useState<Hydrant[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from API with fallback to mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Load all data in parallel
        const [stationsRes, vehiclesRes, hydrantsRes, incidentsRes] = await Promise.all([
          stationApi.getAll({ limit: 100 }),
          vehicleApi.getAll({ limit: 100 }),
          hydrantApi.getAll({ limit: 100 }),
          incidentApi.getAll({ limit: 100 })
        ])

        setStations(stationsRes.stations)
        setVehicles(vehiclesRes.vehicles)
        setHydrants(hydrantsRes.hydrants)
        setIncidents(incidentsRes.incidents)
      } catch (err) {
        console.error('Failed to load data, falling back to mock data:', err)
        // Fall back to mock data instead of showing error
        setStations(mockStations)
        setVehicles(mockVehicles)
        setHydrants(mockHydrants)
        setIncidents(mockIncidents)
        // Error cleared since we have fallback data
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

  // Calculate statistics
  const activeIncidents = (incidents || []).filter(i => ['ACTIVE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE'].includes(i.status)).length
  const activeVehicles = (vehicles || []).filter(v => v.status === 'IN_SERVICE').length
  const totalStations = (stations || []).length
  const totalHydrants = (hydrants || []).length

  return (
    <div className="h-full w-full flex bg-gray-50 overflow-hidden relative m-0 p-0 map-container">
      {/* Left Sidebar - Statistics & Layer Controls */}
      <div className="w-80 min-w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden m-0 p-0 map-sidebar">
        {/* Statistics Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700 text-white m-0">
          <h2 className="text-lg font-bold mb-3">Fire Control Dashboard</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{activeIncidents}</div>
                  <div className="text-xs opacity-90">Active Incidents</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{activeVehicles}</div>
                  <div className="text-xs opacity-90">Active Units</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{totalStations}</div>
                  <div className="text-xs opacity-90">Fire Stations</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                <div>
                  <div className="text-2xl font-bold">{totalHydrants}</div>
                  <div className="text-xs opacity-90">Hydrants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Map Layers
          </h3>
          <div className="space-y-2">
            <Button
              variant={layers.stations ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("stations")}
              className="w-full justify-start"
            >
              {layers.stations ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Building className="h-4 w-4 mr-2" />
              Fire Stations ({totalStations})
            </Button>
            <Button
              variant={layers.vehicles ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("vehicles")}
              className="w-full justify-start"
            >
              {layers.vehicles ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Truck className="h-4 w-4 mr-2" />
              Vehicles ({(vehicles || []).length})
            </Button>
            <Button
              variant={layers.hydrants ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("hydrants")}
              className="w-full justify-start"
            >
              {layers.hydrants ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <Droplets className="h-4 w-4 mr-2" />
              Hydrants ({totalHydrants})
            </Button>
            <Button
              variant={layers.incidents ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLayer("incidents")}
              className="w-full justify-start"
            >
              {layers.incidents ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              <AlertTriangle className="h-4 w-4 mr-2" />
              Incidents ({(incidents || []).length})
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocate}
              className="w-full justify-start"
            >
              <Locate className="h-4 w-4 mr-2" />
              Reset View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Map Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium">Loading Map Data...</div>
              <div className="text-sm text-gray-500 mt-2">Fetching stations, vehicles, and incidents</div>
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

      {/* Right Sidebar - Live Tracking */}
      <div className="w-80 min-w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Vehicle Tracking
          </h3>
          <div className="text-sm opacity-90 mt-1">Real-time unit status</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="text-sm text-gray-500">Loading vehicles...</div>
            </div>
          ) : (
            <LiveTracking
              vehicles={vehicles}
              onVehicleSelect={handleVehicleSelect}
              selectedVehicle={selectedVehicle}
            />
          )}
        </div>

        {/* Vehicle Statistics */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h4 className="font-medium mb-2">Vehicle Status Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>In Service:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {(vehicles || []).filter(v => v.status === 'IN_SERVICE').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>En Route:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {(vehicles || []).filter(v => v.status === 'EN_ROUTE').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>On Scene:</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {(vehicles || []).filter(v => v.status === 'ON_SCENE').length}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Out of Service:</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {(vehicles || []).filter(v => v.status === 'OUT_OF_SERVICE').length}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}