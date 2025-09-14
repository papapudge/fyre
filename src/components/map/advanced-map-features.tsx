"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MapPin, 
  Layers, 
  Thermometer, 
  Target,
  Zap,
  Activity,
  BarChart3
} from "lucide-react"

interface AdvancedMapFeaturesProps {
  map: any
  incidents: any[]
  vehicles: any[]
  stations: any[]
}

export function AdvancedMapFeatures({ map, incidents, vehicles, stations }: AdvancedMapFeaturesProps) {
  const [heatMapData, setHeatMapData] = useState<any[]>([])
  const [heatMap, setHeatMap] = useState<any>(null)
  const [markerClusterer, setMarkerClusterer] = useState<any>(null)
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [showClustering, setShowClustering] = useState(true)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showTransit, setShowTransit] = useState(false)

  // Initialize heat map data from incidents
  useEffect(() => {
    if (incidents.length > 0) {
      const heatData = incidents.map(incident => ({
        lat: incident.lat,
        lng: incident.lng
      }))
      setHeatMapData(heatData)
    }
  }, [incidents])

  // Toggle heat map
  const toggleHeatMap = () => {
    if (!map) return

    if (showHeatMap) {
      if (heatMap) {
        // Mock: remove heat map
        setHeatMap(null)
      }
    } else {
      if (heatMapData.length > 0) {
        // Mock: create heat map
        const newHeatMap = { data: heatMapData, map: map }
        setHeatMap(newHeatMap)
      }
    }
    setShowHeatMap(!showHeatMap)
  }

  // Toggle traffic layer
  const toggleTraffic = () => {
    if (!map) return

    if (showTraffic) {
      // Mock: remove traffic layer
      console.log('Traffic layer removed')
    } else {
      // Mock: add traffic layer
      console.log('Traffic layer added')
    }
    setShowTraffic(!showTraffic)
  }

  // Toggle transit layer
  const toggleTransit = () => {
    if (!map) return

    if (showTransit) {
      // Mock: remove transit layer
      console.log('Transit layer removed')
    } else {
      // Mock: add transit layer
      console.log('Transit layer added')
    }
    setShowTransit(!showTransit)
  }

  // Get incident density for heat map intensity
  const getIncidentDensity = () => {
    const totalIncidents = incidents.length
    const highSeverity = incidents.filter(i => i.severity === 'High').length
    const mediumSeverity = incidents.filter(i => i.severity === 'Medium').length
    
    return {
      total: totalIncidents,
      high: highSeverity,
      medium: mediumSeverity,
      low: totalIncidents - highSeverity - mediumSeverity
    }
  }

  const density = getIncidentDensity()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Advanced Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Heat Map Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Incident Heat Map</span>
            </div>
            <Button
              size="sm"
              variant={showHeatMap ? "default" : "outline"}
              onClick={toggleHeatMap}
            >
              {showHeatMap ? "Hide" : "Show"}
            </Button>
          </div>
          
          {showHeatMap && (
            <div className="text-xs text-gray-600 space-y-1">
              <div>Total Incidents: {density.total}</div>
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-xs">High: {density.high}</Badge>
                <Badge variant="warning" className="text-xs">Medium: {density.medium}</Badge>
                <Badge variant="success" className="text-xs">Low: {density.low}</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Clustering Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Marker Clustering</span>
            </div>
            <Button
              size="sm"
              variant={showClustering ? "default" : "outline"}
              onClick={() => setShowClustering(!showClustering)}
            >
              {showClustering ? "Hide" : "Show"}
            </Button>
          </div>
          
          {showClustering && (
            <div className="text-xs text-gray-600">
              Groups nearby markers for better performance
            </div>
          )}
        </div>

        {/* Traffic Layer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-500" />
              <span className="text-sm">Traffic Layer</span>
            </div>
            <Button
              size="sm"
              variant={showTraffic ? "default" : "outline"}
              onClick={toggleTraffic}
            >
              {showTraffic ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        {/* Transit Layer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Transit Layer</span>
            </div>
            <Button
              size="sm"
              variant={showTransit ? "default" : "outline"}
              onClick={toggleTransit}
            >
              {showTransit ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="pt-2 border-t">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Map Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-medium text-blue-900">Active Vehicles</div>
              <div className="text-blue-700">{vehicles.filter(v => v.isOnline).length}</div>
            </div>
            <div className="bg-red-50 p-2 rounded">
              <div className="font-medium text-red-900">Active Incidents</div>
              <div className="text-red-700">{incidents.length}</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="font-medium text-green-900">Stations</div>
              <div className="text-green-700">{stations.length}</div>
            </div>
            <div className="bg-purple-50 p-2 rounded">
              <div className="font-medium text-purple-900">Coverage</div>
              <div className="text-purple-700">95%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
