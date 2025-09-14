"use client"

import { Suspense } from "react"
import { MapPin } from "lucide-react"

// Import FireMap directly to avoid dynamic import conflicts
import { FireMap } from "@/components/map/fire-map"

export default function MapPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col m-0 p-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white border-b shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gray-900 via-red-600 to-orange-500 bg-clip-text text-transparent truncate">Map</h1>
          </div>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 hidden sm:block flex-shrink-0">
          Real-time Emergency Response
        </div>
      </div>

      {/* Map content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Suspense fallback={
          <div className="h-full relative bg-gray-50">
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto mb-2"></div>
              <p className="text-black text-sm">Loading map...</p>
            </div>
          </div>
        }>
          <FireMap />
        </Suspense>
      </div>
    </div>
  )
}
