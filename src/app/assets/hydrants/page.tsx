"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Hydrant } from "@/lib/api"
import { 
  Droplets, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Gauge,
  Wrench,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react"
import { useState } from "react"

// Mock hydrant data
const mockHydrants = [
  {
    id: "1",
    hydrantId: "H-001",
    location: "123 Main St & 1st Ave",
    latitude: 40.7128,
    longitude: -74.0060,
    status: "Active",
    flowRate: 1000,
    pressure: 65,
    lastInspection: "2025-03-15",
    nextInspection: "2025-06-15",
    notes: "Good condition, recently serviced"
  },
  {
    id: "2", 
    hydrantId: "H-002",
    location: "456 Oak Ave & 2nd St",
    latitude: 40.7200,
    longitude: -74.0100,
    status: "Active",
    flowRate: 1200,
    pressure: 70,
    lastInspection: "2025-03-10",
    nextInspection: "2025-06-10",
    notes: "High flow capacity"
  },
  {
    id: "3",
    hydrantId: "H-003", 
    location: "789 Pine Rd & 3rd Ave",
    latitude: 40.6950,
    longitude: -74.0200,
    status: "Damaged",
    flowRate: 0,
    pressure: 0,
    lastInspection: "2025-02-20",
    nextInspection: "2025-05-20",
    notes: "Requires repair - valve issue"
  },
  {
    id: "4",
    hydrantId: "H-004",
    location: "321 Elm St & 4th Ave", 
    latitude: 40.7300,
    longitude: -73.9900,
    status: "Maintenance",
    flowRate: 950,
    pressure: 60,
    lastInspection: "2025-03-01",
    nextInspection: "2025-06-01", 
    notes: "Scheduled for routine maintenance"
  }
]

export default function HydrantsPage() {
  const [hydrants, setHydrants] = useState<Hydrant[]>([])
  const [selectedHydrant, setSelectedHydrant] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success"
      case "maintenance": return "warning"  
      case "damaged": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return CheckCircle
      case "maintenance": return AlertCircle
      case "damaged": return XCircle
      default: return CheckCircle
    }
  }

  const filteredHydrants = hydrants.filter(hydrant => {
    // Since hydrant doesn't have status, we'll use a mock status based on inspection date
    const status = hydrant.nextInspection && new Date(hydrant.nextInspection) < new Date() ? "damaged" : "operational"
    const matchesFilter = filter === "all" || status === filter
    const matchesSearch = hydrant.hydrantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hydrant.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">Hydrants</h1>
            <p className="text-gray-700">Fire hydrant management and monitoring</p>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Hydrant
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search hydrants..."
                className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-800">Status:</span>
            {["all", "active", "maintenance", "damaged"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hydrants List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredHydrants.length > 0 ? (
              filteredHydrants.map((hydrant) => {
              const StatusIcon = getStatusIcon(hydrant.status)
              
              return (
                <Card 
                  key={hydrant.id} 
                  className={
                    selectedHydrant === hydrant.id ? "ring-2 ring-red-500 shadow-md" : ""
                  }
                  onClick={() => setSelectedHydrant(hydrant.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Droplets className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-gray-900">{hydrant.hydrantId}</CardTitle>
                          <CardDescription className="text-gray-700">Lat: {hydrant.latitude}, Lng: {hydrant.longitude}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(hydrant.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {hydrant.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-800">Flow: {hydrant.flowRate} GPM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-800">Pressure: {hydrant.pressure} PSI</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-800">Last Inspected</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wrench className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-800">Next: {hydrant.nextInspection ? new Date(hydrant.nextInspection).toLocaleDateString() : 'Not scheduled'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
              })
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center text-gray-500">
                  <Gauge className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hydrants found</p>
                </div>
              </div>
            )}
          </div>

          {/* Hydrant Details */}
          <div className="space-y-4">
            {selectedHydrant ? (
              (() => {
                const hydrant = hydrants.find(h => h.id === selectedHydrant)
                if (!hydrant) return null
                
                const StatusIcon = getStatusIcon(hydrant.status)
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5" />
                        <span>Hydrant Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium text-gray-800">ID:</span> <span className="text-gray-900">{hydrant.hydrantId}</span></p>
                          <p><span className="font-medium text-gray-800">Location:</span> <span className="text-gray-900">Lat: {hydrant.latitude}, Lng: {hydrant.longitude}</span></p>
                          <p><span className="font-medium text-gray-800">Status:</span>
                            <Badge variant={getStatusColor(hydrant.status)} className="ml-2">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {hydrant.status}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Performance</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium text-gray-800">Flow Rate:</span> <span className="text-gray-900">{hydrant.flowRate} GPM</span></p>
                          <p><span className="font-medium text-gray-800">Pressure:</span> <span className="text-gray-900">{hydrant.pressure} PSI</span></p>
                        </div>
                      </div>

                      {/* Inspection Schedule */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Inspection Schedule</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium text-gray-800">Last Inspection:</span> <span className="text-gray-900">{hydrant.lastInspection ? new Date(hydrant.lastInspection).toLocaleDateString() : 'Not available'}</span></p>
                          <p><span className="font-medium text-gray-800">Next Inspection:</span> <span className="text-gray-900">{hydrant.nextInspection ? new Date(hydrant.nextInspection).toLocaleDateString() : 'Not scheduled'}</span></p>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Notes</h4>
                        <p className="text-sm text-gray-700">{hydrant.notes}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-1" />
                            Locate
                          </Button>
                          <Button size="sm" variant="outline">
                            <Wrench className="h-4 w-4 mr-1" />
                            Inspect
                          </Button>
                          <Button size="sm" variant="outline">
                            <Gauge className="h-4 w-4 mr-1" />
                            Test
                          </Button>
                          <Button size="sm" variant="outline">
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
                    <Droplets className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a hydrant to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}