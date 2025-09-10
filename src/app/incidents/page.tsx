"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  Users,
  Truck,
  Phone,
  FileText,
  Camera,
  Navigation
} from "lucide-react"
import { useState, useEffect } from "react"
import { NewIncidentDialog } from "@/components/incidents/new-incident-dialog"

// Mock incidents data
const mockIncidents = [
  {
    id: "1",
    title: "Structure Fire - Residential",
    type: "Structure Fire",
    location: "123 Main St, Downtown",
    status: "On Scene",
    severity: "High",
    reportedTime: "2025-09-10T14:30:00Z",
    units: ["Engine 1", "Ladder 2", "Rescue 1"],
    personnel: ["John Smith", "Mike Davis", "Sarah Johnson", "Tom Brown"],
    description: "Multi-story residential building fire with possible occupants trapped"
  },
  {
    id: "2", 
    title: "Medical Emergency - Cardiac Arrest",
    type: "Medical",
    location: "456 Oak Ave, Uptown",
    status: "En Route",
    severity: "Critical",
    reportedTime: "2025-09-10T15:15:00Z",
    units: ["Ambulance 3", "Engine 2"],
    personnel: ["Lisa Wilson", "Amy Green"],
    description: "Adult male cardiac arrest, CPR in progress"
  },
  {
    id: "3",
    title: "Vehicle Accident - Multi-car",
    type: "Vehicle Accident", 
    location: "Highway 101 & Pine Rd",
    status: "Dispatched",
    severity: "Medium",
    reportedTime: "2025-09-10T15:45:00Z",
    units: ["Engine 1", "Rescue 1", "Ambulance 2"],
    personnel: ["Chris White", "Mike Davis"],
    description: "Three-vehicle collision with injuries reported"
  }
]

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real data from API
    setLoading(false)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "destructive"
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "success"
      default: return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "on scene": return "success"
      case "en route": return "warning"
      case "dispatched": return "info"
      case "closed": return "secondary"
      default: return "secondary"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "fire": return "🔥"
      case "medical": return "🚑"
      case "rescue": return "🚨"
      case "hazmat": return "☢️"
      default: return "📞"
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const filteredIncidents = incidents.filter((incident: any) => {
    const matchesFilter = filter === "all" || incident.status.toLowerCase().replace(" ", "_") === filter
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">Incidents</h1>
            <p className="text-gray-600">Emergency response management</p>
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
            <NewIncidentDialog onIncidentCreated={(incident) => {
              console.log("New incident created:", incident)
              // In a real app, this would update the incidents list
            }} />
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Status:</span>
          {["all", "dispatched", "en_route", "on_scene", "closed"].map((status) => (
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

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incidents List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident: any) => (
              <Card 
                key={incident.id} 
                className={
                  selectedIncident === incident.id ? "ring-2 ring-red-500" : ""
                }
                onClick={() => setSelectedIncident(incident.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <CardTitle className="text-lg">{incident.id}</CardTitle>
                        <CardDescription>{incident.title}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge variant={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{incident.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Reported: {formatTime(incident.reportedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{incident.personnel.length} personnel</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span>{incident.units.length} units</span>
                    </div>
                  </div>
                  
                  {incident.injuries > 0 && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <span className="font-medium text-red-800">
                        {incident.injuries} injury(ies) reported
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No incidents found</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Incident Details */}
          <div className="space-y-4">
            {selectedIncident ? (
              (() => {
                const incident = incidents.find((i: any) => i.id === selectedIncident)
                if (!incident) return null
                
                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{getTypeIcon(incident.type)}</span>
                        <span>Incident Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">ID:</span> {incident.id}</p>
                          <p><span className="font-medium">Type:</span> {incident.type}</p>
                          <p><span className="font-medium">Severity:</span> 
                            <Badge variant={getSeverityColor(incident.severity)} className="ml-2">
                              {incident.severity}
                            </Badge>
                          </p>
                          <p><span className="font-medium">Status:</span>
                            <Badge variant={getStatusColor(incident.status)} className="ml-2">
                              {incident.status}
                            </Badge>
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Location</h4>
                        <div className="text-sm">
                          <p className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{incident.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Timeline</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Reported:</span> {formatTime(incident.reportedAt)}</p>
                          <p><span className="font-medium">Dispatched:</span> {formatTime(incident.dispatchedAt)}</p>
                          <p><span className="font-medium">Arrived:</span> {formatTime(incident.arrivedAt)}</p>
                        </div>
                      </div>

                      {/* Units & Personnel */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Units Assigned</h4>
                        <div className="space-y-1">
                          {incident.units.map((unit, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {unit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Personnel</h4>
                        <div className="space-y-1">
                          {incident.personnel.map((person, index) => (
                            <Badge key={index} variant="secondary" className="mr-1">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Caller Info */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Caller Information</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Name:</span> {incident.caller}</p>
                          <p><span className="font-medium">Phone:</span> {incident.callerPhone}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Description</h4>
                        <p className="text-sm text-gray-600">{incident.description}</p>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Navigate to map with incident location
                              const mapUrl = `/map?incident=${incident.id}&lat=${incident.lat || 40.7128}&lng=${incident.lng || -74.0060}`
                              window.open(mapUrl, '_blank')
                            }}
                          >
                            <Navigation className="h-4 w-4 mr-1" />
                            Navigate
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Call emergency number or incident contact
                              const phoneNumber = incident.callerPhone || "100" // Indian emergency number
                              window.open(`tel:${phoneNumber}`, '_self')
                            }}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Open incident log form
                              const logData = {
                                incidentId: incident.id,
                                timestamp: new Date().toISOString(),
                                action: "Log Entry",
                                details: `Log entry for incident ${incident.id}`
                              }
                              console.log("Creating log entry:", logData)
                              alert(`Log entry created for incident ${incident.id}`)
                            }}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Log
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Open camera or photo upload
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.capture = 'environment' // Use back camera on mobile
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  console.log("Photo captured for incident:", incident.id, file)
                                  alert(`Photo captured for incident ${incident.id}`)
                                }
                              }
                              input.click()
                            }}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Photo
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
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an incident to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
  )
}
