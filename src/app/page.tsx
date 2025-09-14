"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  AlertTriangle, 
  Users, 
  Truck, 
  MapPin, 
  Clock, 
  TrendingUp,
  Shield,
  Phone,
  Navigation,
  Camera,
  FileText,
  Zap,
  Target,
  ArrowRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { incidentApi, personnelApi, vehicleApi } from "@/lib/api"

// Real data will come from API - no more mock data

export default function Dashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    activeIncidents: 0,
    personnelOnDuty: 0,
    vehiclesInService: 0,
    averageResponseTime: 0,
    recentIncidents: [],
    personnelStatus: [],
    vehicleStatus: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        
        // Load data from API in parallel
        const [incidentsRes, personnelRes, vehiclesRes] = await Promise.all([
          incidentApi.getAll({ limit: 100 }),
          personnelApi.getAll({ limit: 100 }),
          vehicleApi.getAll({ limit: 100 })
        ])
        
        const incidents = incidentsRes.incidents
        const personnel = personnelRes.personnel  
        const vehicles = vehiclesRes.vehicles
        
        const activeIncidents = incidents.filter((incident: any) => 
          ['ACTIVE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE'].includes(incident.status)
        ).length
        
        const personnelOnDuty = personnel.filter((p: any) => p.status === "ON_DUTY").length
        const vehiclesInService = vehicles.filter((v: any) => v.status === "IN_SERVICE").length
        
        const averageResponseTime = incidents.length > 0 
          ? Math.round(incidents.reduce((acc: number, incident: any) => {
              if (!incident.reportedAt || !incident.dispatchedAt) return acc
              const reported = new Date(incident.reportedAt)
              const dispatched = new Date(incident.dispatchedAt)
              return acc + (dispatched.getTime() - reported.getTime()) / (1000 * 60)
            }, 0) / incidents.length)
          : 0

        setDashboardData({
          activeIncidents,
          personnelOnDuty,
          vehiclesInService,
          averageResponseTime,
          recentIncidents: incidents.slice(-5),
          personnelStatus: personnel.slice(0, 4),
          vehicleStatus: vehicles.slice(0, 4)
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
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
      case "in service": return "success"
      case "on duty": return "success"
      default: return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-6 w-96" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
        <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent">
                Operations Center
              </h1>
              <p className="text-gray-600 text-lg">Real-time fire department monitoring & response</p>
            </div>
            <div className="flex items-center space-x-3">
          <Badge variant="default" className="flex items-center space-x-2 px-4 py-2 bg-green-400 text-green-900">
            <div className="w-2 h-2 bg-green-800 rounded-full"></div>
            <span className="font-medium">All Systems Operational</span>
                </Badge>
              </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.activeIncidents}</p>
              <p className="text-xs text-gray-500">+1 from yesterday</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personnel On Duty</p>
              <p className="text-3xl font-bold text-blue-600">{dashboardData.personnelOnDuty}</p>
              <p className="text-xs text-gray-500">Available for dispatch</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
                  </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vehicles In Service</p>
              <p className="text-3xl font-bold text-green-600">{dashboardData.vehiclesInService}</p>
              <p className="text-xs text-gray-500">Ready for response</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-orange-600">{dashboardData.averageResponseTime}m</p>
              <p className="text-xs text-gray-500">-0.3m from last month</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Incidents */}
        <Card data-testid="active-incidents">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Active Incidents</span>
                  </CardTitle>
            <CardDescription>Current emergency responses in progress</CardDescription>
                </CardHeader>
          <CardContent>
                  {dashboardData.recentIncidents.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentIncidents.map((incident: any) => (
                      <div 
                        key={incident.id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/incidents?selected=${incident.id}`)}
                      >
                        <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{incident.id}</span>
                          <Badge variant={getSeverityColor(incident.severity)} className="text-xs">
                                {incident.severity}
                              </Badge>
                            </div>
                        <p className="text-sm text-gray-600">{incident.type} - {incident.location}</p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Truck className="h-3 w-3 mr-1" />
                          {incident.units?.join(", ") || "No units assigned"}
                            </p>
                          </div>
                      <Badge variant={getStatusColor(incident.status)} className="text-xs">
                              {incident.status}
                            </Badge>
                          </div>
                        </div>
                ))}
                      </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No active incidents</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            {/* Personnel Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Personnel Status</span>
                  </CardTitle>
            <CardDescription>Current personnel availability</CardDescription>
                </CardHeader>
          <CardContent>
                  {dashboardData.personnelStatus.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.personnelStatus.map((person: any) => (
                  <div key={person.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.rank} • {person.station}</p>
                          </div>
                    <Badge variant={getStatusColor(person.status)} className="text-xs">
                            {person.status}
                          </Badge>
                        </div>
                ))}
                      </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No personnel data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

          {/* Vehicle Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Vehicle Status</span>
                </CardTitle>
            <CardDescription>Current vehicle availability</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.vehicleStatus.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.vehicleStatus.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{vehicle.name}</p>
                      <p className="text-xs text-gray-500">{vehicle.type} • {vehicle.station}</p>
                          </div>
                    <Badge variant={getStatusColor(vehicle.status)} className="text-xs">
                            {vehicle.status}
                          </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No vehicle data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span>Quick Actions</span>
                </CardTitle>
            <CardDescription>Common operations and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/incidents/new')}
              >
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span className="text-sm">New Incident</span>
              </Button>
                    <Button 
                      variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => router.push('/map')}
                    >
                <MapPin className="h-6 w-6 text-blue-600" />
                <span className="text-sm">View Map</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/reports')}
              >
                <FileText className="h-6 w-6 text-green-600" />
                <span className="text-sm">Reports</span>
                    </Button>
                    <Button 
                      variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => router.push('/notifications')}
                    >
                <Shield className="h-6 w-6 text-purple-600" />
                <span className="text-sm">Alerts</span>
                    </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
  )
}