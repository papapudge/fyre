"use client"

import { Wrapper, Status } from "@googlemaps/react-wrapper"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AdvancedMapFeatures } from "./advanced-map-features"

// Marker icons will be created inside the component when Google Maps is loaded

interface LayerVisibility {
  stations: boolean
  vehicles: boolean
  hydrants: boolean
  incidents: boolean
}

interface MapContentProps {
  center: [number, number]
  zoom: number
  layers: LayerVisibility
  stations: any[]
  vehicles: any[]
  hydrants: any[]
  incidents: any[]
  getStatusColor: (status: string) => string
  getSeverityColor: (severity: string) => string
  showAdvancedFeatures?: boolean
  onToggleAdvancedFeatures?: () => void
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div className="h-full w-full flex items-center justify-center">Loading map...</div>
    case Status.FAILURE:
      return <div className="h-full w-full flex items-center justify-center text-red-500">Error loading map</div>
    default:
      return <div className="h-full w-full"></div>
  }
}

function MapComponent({
  center,
  zoom,
  layers,
  stations,
  vehicles,
  hydrants,
  incidents,
  getStatusColor,
  getSeverityColor,
  showAdvancedFeatures = false,
  onToggleAdvancedFeatures
}: MapContentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>()
  const [markers, setMarkers] = useState<any[]>([])
  const markersRef = useRef<any[]>([])
  const [infoWindow, setInfoWindow] = useState<any>()

  // Create marker icons once when Google Maps is loaded
  const [markerIcons, setMarkerIcons] = useState<{[key: string]: any}>({})

  useEffect(() => {
    if ((window as any).google?.maps && Object.keys(markerIcons).length === 0) {
      const createMarkerIcon = (emoji: string, color: string = "#ffffff") => {
        return {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="${color}" stroke="#ffffff" stroke-width="3"/>
              <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-family="Arial, sans-serif">${emoji}</text>
            </svg>
          `)}`,
          scaledSize: new (window as any).google.maps.Size(40, 40),
          anchor: new (window as any).google.maps.Point(20, 20)
        }
      }

      const icons = {
        station: createMarkerIcon("🏢", "#3b82f6"), // Blue for stations
        engine: createMarkerIcon("🚒", "#ef4444"), // Red for fire engines
        ladder: createMarkerIcon("🪜", "#f59e0b"), // Orange for ladder trucks
        ambulance: createMarkerIcon("🚑", "#10b981"), // Green for ambulances
        hydrant: createMarkerIcon("💧", "#06b6d4"), // Cyan for hydrants
        incident: createMarkerIcon("🔥", "#dc2626"), // Dark red for incidents
        personnel: createMarkerIcon("👨‍🚒", "#8b5cf6") // Purple for personnel
      }
      
      setMarkerIcons(icons)
    }
  }, [markerIcons])

  // Initialize map
  useEffect(() => {
    if (ref.current && !map && (window as any).google?.maps) {
      const newMap = new (window as any).google.maps.Map(ref.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: zoom,
        mapTypeId: (window as any).google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: (window as any).google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: (window as any).google.maps.ControlPosition.TOP_CENTER,
          mapTypeIds: [
            (window as any).google.maps.MapTypeId.SATELLITE,
            (window as any).google.maps.MapTypeId.ROADMAP,
            (window as any).google.maps.MapTypeId.HYBRID,
            (window as any).google.maps.MapTypeId.TERRAIN
          ]
        },
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })
      setMap(newMap)
      setInfoWindow(new (window as any).google.maps.InfoWindow())
    }
  }, [ref, map, center, zoom])

  // Update map center and zoom
  useEffect(() => {
    if (map) {
      map.setCenter({ lat: center[0], lng: center[1] })
      map.setZoom(zoom)
    }
  }, [map, center, zoom])

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    setMarkers([])
  }, [])

  // Add markers based on layers
  useEffect(() => {
    if (!map || !infoWindow || !(window as any).google?.maps || Object.keys(markerIcons).length === 0) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    
    const newMarkers: any[] = []

    // Add station markers
    if (layers.stations && stations && Array.isArray(stations)) {
      stations.forEach((station) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: station.latitude, lng: station.longitude },
          map: map,
          icon: markerIcons.station,
          title: station.name
        })

        marker.addListener("click", () => {
          infoWindow.setContent(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-lg">${station.name}</h3>
              <p class="text-sm text-gray-600">Personnel: ${station.personnel}</p>
              <p class="text-sm text-gray-600">Vehicles: ${station.vehicles}</p>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('viewStation', {detail: ${JSON.stringify(station)}}))"
                class="mt-2 w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          `)
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      })
    }

    // Add vehicle markers
    if (layers.vehicles && vehicles && Array.isArray(vehicles)) {
      vehicles.forEach((vehicle) => {
        const iconType = vehicle.type.toLowerCase() as keyof typeof markerIcons
        const icon = markerIcons[iconType] || markerIcons.engine

        const marker = new (window as any).google.maps.Marker({
          position: { lat: vehicle.latitude, lng: vehicle.longitude },
          map: map,
          icon: icon,
          title: vehicle.name
        })

        marker.addListener("click", () => {
          const statusColor = getStatusColor(vehicle.status)
          infoWindow.setContent(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-lg">${vehicle.name}</h3>
              <p class="text-sm text-gray-600">Type: ${vehicle.type}</p>
              <span class="inline-block px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-800 mt-1">
                ${vehicle.status}
              </span>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('trackVehicle', {detail: ${JSON.stringify(vehicle)}}))"
                class="mt-2 w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Track Vehicle
              </button>
            </div>
          `)
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      })
    }

    // Add hydrant markers
    if (layers.hydrants && hydrants && Array.isArray(hydrants)) {
      hydrants.forEach((hydrant) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: hydrant.latitude, lng: hydrant.longitude },
          map: map,
          icon: markerIcons.hydrant,
          title: hydrant.hydrantId
        })

        marker.addListener("click", () => {
          const statusColor = getStatusColor(hydrant.status)
          infoWindow.setContent(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-lg">${hydrant.hydrantId}</h3>
              <p class="text-sm text-gray-600">Flow Rate: ${hydrant.flowRate} GPM</p>
              <span class="inline-block px-2 py-1 text-xs rounded-full bg-${statusColor}-100 text-${statusColor}-800 mt-1">
                ${hydrant.status}
              </span>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('viewHydrant', {detail: ${JSON.stringify(hydrant)}}))"
                class="mt-2 w-full bg-cyan-500 text-white px-3 py-1 rounded text-sm hover:bg-cyan-600"
              >
                View Details
              </button>
            </div>
          `)
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      })
    }

    // Add incident markers
    if (layers.incidents && incidents && Array.isArray(incidents)) {
      incidents.forEach((incident) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: incident.latitude, lng: incident.longitude },
          map: map,
          icon: markerIcons.incident,
          title: incident.incidentNumber
        })

        marker.addListener("click", () => {
          const severityColor = getSeverityColor(incident.severity)
          infoWindow.setContent(`
            <div class="p-2 min-w-[200px]">
              <h3 class="font-semibold text-lg">${incident.incidentNumber}</h3>
              <p class="text-sm text-gray-600">Type: ${incident.type}</p>
              <span class="inline-block px-2 py-1 text-xs rounded-full bg-${severityColor}-100 text-${severityColor}-800 mt-1">
                ${incident.severity}
              </span>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('viewIncident', {detail: ${JSON.stringify(incident)}}))"
                class="mt-2 w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                View Incident
              </button>
            </div>
          `)
          infoWindow.open(map, marker)
        })

        newMarkers.push(marker)
      })
    }

    markersRef.current = newMarkers
    setMarkers(newMarkers)
  }, [map, infoWindow, layers, stations, vehicles, hydrants, incidents, getStatusColor, getSeverityColor, markerIcons])

  // Listen for custom events from info windows
  useEffect(() => {
    const handleViewStation = (event: CustomEvent) => {
      const station = event.detail
      // Center map on station
      if (map) {
        map.setCenter({ lat: station.latitude, lng: station.longitude })
        map.setZoom(16)
      }
      infoWindow?.close()
    }

    const handleTrackVehicle = (event: CustomEvent) => {
      const vehicle = event.detail
      // Center map on vehicle
      if (map) {
        map.setCenter({ lat: vehicle.latitude, lng: vehicle.longitude })
        map.setZoom(16)
      }
      infoWindow?.close()
    }

    const handleViewHydrant = (event: CustomEvent) => {
      const hydrant = event.detail
      // Center map on hydrant
      if (map) {
        map.setCenter({ lat: hydrant.latitude, lng: hydrant.longitude })
        map.setZoom(16)
      }
      infoWindow?.close()
    }

    const handleViewIncident = (event: CustomEvent) => {
      const incident = event.detail
      // Center map on incident
      if (map) {
        map.setCenter({ lat: incident.latitude, lng: incident.longitude })
        map.setZoom(16)
      }
      infoWindow?.close()
    }

    window.addEventListener("viewStation", handleViewStation as EventListener)
    window.addEventListener("trackVehicle", handleTrackVehicle as EventListener)
    window.addEventListener("viewHydrant", handleViewHydrant as EventListener)
    window.addEventListener("viewIncident", handleViewIncident as EventListener)

    return () => {
      window.removeEventListener("viewStation", handleViewStation as EventListener)
      window.removeEventListener("trackVehicle", handleTrackVehicle as EventListener)
      window.removeEventListener("viewHydrant", handleViewHydrant as EventListener)
      window.removeEventListener("viewIncident", handleViewIncident as EventListener)
    }
  }, [])

  return (
    <div className="h-full w-full relative">
      <div ref={ref} className="h-full w-full" />
    </div>
  )
}

function GoogleMapContent(props: MapContentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return <div className="h-full w-full flex items-center justify-center text-red-500">Google Maps API key not found</div>
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent {...props} />
    </Wrapper>
  )
}

export default GoogleMapContent
