"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Fuel,
  Wrench,
  Navigation,
  Phone,
  Settings,
  Eye
} from "lucide-react"
import { useState, useEffect } from "react"
import { AddVehicleDialog } from "@/components/vehicles/add-vehicle-dialog"

// Mock vehicle data
const mockVehicles = [
  {
    id: "1",
    unitId: "Engine 1",
    type: "Engine",
    name: "Engine 1",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    latitude: 40.7128,
    longitude: -74.0060,
    fuelLevel: 85,
    capabilities: ["Fire Suppression", "Rescue", "Hazmat"],
    lastService: "2025-04-15",
    nextService: "2025-05-15",
    notes: "Primary response engine",
    crew: ["John Smith", "Mike Davis"],
    lastLocationUpdate: "2025-05-09T15:30:00Z"
  },
  {
    id: "2",
    unitId: "Ladder 2",
    type: "Ladder",
    name: "Ladder 2",
    station: "Station 1",
    status: "On Scene",
    location: "123 Main St",
    latitude: 40.7128,
    longitude: -74.0060,
    fuelLevel: 92,
    capabilities: ["Aerial Operations", "Rescue", "Ventilation"],
    lastService: "2025-04-20",
    nextService: "2025-05-20",
    notes: "100ft aerial ladder",
    crew: ["Sarah Johnson", "Tom Brown"],
    lastLocationUpdate: "2025-05-09T15:30:00Z"
  },
  {
    id: "3",
    unitId: "Ambulance 3",
    type: "Ambulance",
    name: "Ambulance 3",
    station: "Station 2",
    status: "En Route",
    location: "456 Oak Ave",
    latitude: 40.7589,
    longitude: -73.9851,
    fuelLevel: 78,
    capabilities: ["Medical Transport", "Basic Life Support", "Advanced Life Support"],
    lastService: "2025-04-10",
    nextService: "2025-05-10",
    notes: "ALS equipped ambulance",
    crew: ["Lisa Wilson"],
    lastLocationUpdate: "2025-05-09T15:45:00Z"
  },
  {
    id: "4",
    unitId: "Rescue 1",
    type: "Rescue",
    name: "Rescue 1",
    station: "Station 3",
    status: "Dispatched",
    location: "789 Pine Rd",
    latitude: 40.6892,
    longitude: -74.0445,
    fuelLevel: 95,
    capabilities: ["Technical Rescue", "Hazmat", "Heavy Rescue"],
    lastService: "2025-04-25",
    nextService: "2025-05-25",
    notes: "Heavy rescue unit with extrication tools",
    crew: ["Amy Green", "Chris White"],
    lastLocationUpdate: "2025-05-09T16:00:00Z"
  },
  {
    id: "5",
    unitId: "Engine 2",
    type: "Engine",
    name: "Engine 2",
    station: "Station 2",
    status: "In Service",
    location: "Station 2",
    latitude: 40.7589,
    longitude: -73.9851,
    fuelLevel: 100,
    capabilities: ["Fire Suppression", "Rescue"],
    lastService: "2025-04-30",
    nextService: "2025-05-30",
    notes: "Secondary response engine",
    crew: ["Mike Davis", "Lisa Wilson"],
    lastLocationUpdate: "2025-05-09T16:15:00Z"
  }
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load vehicles from localStorage
    if (typeof window !== 'undefined') {
      const savedVehicles = localStorage.getItem('vehicles')
      if (savedVehicles) {
        try {
          const parsedVehicles = JSON.parse(savedVehicles)
          setVehicles(parsedVehicles)
        } catch (error) {
          console.error('Error parsing vehicles from localStorage:', error)
        }
      }
      setLoading(false)
    }
  }, [])

  const handleVehicleAdded = (newVehicle: any) => {
    const updatedVehicles = [...vehicles, newVehicle]
    setVehicles(updatedVehicles)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on scene": return "success"
      case "en route": return "warning"
      case "in service": return "success"
      case "dispatched": return "info"
      case "out of service": return "destructive"
      case "maintenance": return "warning"
      default: return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "engine": return "🚒"
      case "ladder": return "🪜"
      case "ambulance": return "🚑"
      case "rescue": return "🚨"
      case "hazmat": return "☢️"
      default: return "🚛"
    }
  }

  const getFuelColor = (level: number) => {
    if (level > 75) return "text-green-600"
    if (level > 50) return "text-yellow-600"
    return "text-red-600"
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesFilter = filter === "all" || vehicle.status.toLowerCase().replace(" ", "_") === filter
    const matchesSearch = vehicle.unitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.station.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">Vehicles</h1>
            <p className="text-gray-600">Fire department apparatus and vehicles</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddVehicleDialog onVehicleAdded={handleVehicleAdded} />
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            {["all", "in_service", "on_scene", "en_route", "dispatched", "out_of_service", "maintenance"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicles List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle: any) => (
                <Card 
                key={vehicle.id} 
                className={
                  selectedVehicle === vehicle.id ? "ring-2 ring-red-500" : ""
                }
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(vehicle.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{vehicle.unitId}</CardTitle>
                        <CardDescription>{vehicle.type} • {vehicle.station}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <span className={getFuelColor(vehicle.fuelLevel)}>{vehicle.fuelLevel}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Updated: {formatTime(vehicle.lastLocationUpdate)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-gray-500" />
                      <span>Next service: {new Date(vehicle.nextService).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {vehicle.capabilities.slice(0, 3).map((capability, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                    {vehicle.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No vehicles found</p>
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4">
            {selectedVehicle ? (
              (() => {
                const vehicle = vehicles.find(v => v.id === selectedVehicle)
                if (!vehicle) return null
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Truck className="h-5 w-5" />
                        <span>Vehicle Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Unit ID:</span> {vehicle.unitId}</p>
                          <p><span className="font-medium">Type:</span> {vehicle.type}</p>
                          <p><span className="font-medium">Name:</span> {vehicle.name}</p>
                          <p><span className="font-medium">Station:</span> {vehicle.station}</p>
                          <div className="flex items-center">
                            <span className="font-medium">Status:</span>
                            <Badge variant={getStatusColor(vehicle.status)} className="ml-2">
                              {vehicle.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Picture */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Vehicle Image</h4>
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=400&h=300&fit=crop&crop=center&auto=format&q=80`}
                            alt={`${vehicle.unitId} - ${vehicle.type}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to a placeholder if image fails to load
                              e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="400" height="300" fill="#f3f4f6"/>
                                  <text x="200" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">
                                    ${vehicle.type} Vehicle
                                  </text>
                                  <text x="200" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af">
                                    ${vehicle.unitId}
                                  </text>
                                </svg>
                              `)}`
                            }}
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700">
                              {vehicle.type}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          {vehicle.unitId} - {vehicle.type} Vehicle
                        </p>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Location</h4>
                        <div className="text-sm">
                          <p className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{vehicle.location}</span>
                          </p>
                          <p className="text-gray-600 mt-1">
                            Last updated: {formatTime(vehicle.lastLocationUpdate)}
                          </p>
                        </div>
                      </div>

                      {/* Fuel Level */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Fuel Level</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                vehicle.fuelLevel > 75 ? "bg-green-500" :
                                vehicle.fuelLevel > 50 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${vehicle.fuelLevel}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-medium ${getFuelColor(vehicle.fuelLevel)}`}>
                            {vehicle.fuelLevel}%
                          </span>
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Capabilities</h4>
                        <div className="space-y-1">
                          {vehicle.capabilities.map((capability, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Crew */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Current Crew</h4>
                        <div className="space-y-1">
                          {vehicle.crew.map((member, index) => (
                            <Badge key={index} variant="secondary" className="mr-1 mb-1">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Maintenance */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Maintenance</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Last Service:</span> {new Date(vehicle.lastService).toLocaleDateString()}</p>
                          <p><span className="font-medium">Next Service:</span> {new Date(vehicle.nextService).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Notes</h4>
                        <p className="text-sm text-gray-600">{vehicle.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Navigation className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Wrench className="h-4 w-4 mr-1" />
                            Service
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a vehicle to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}
