import { Suspense } from "react"
import MapView from "@/components/map/map-view"
import MapFallback from "@/components/map/map-fallback"
import DeforestationTracker from "@/components/environmental-data/deforestation-tracker"

export default function MapPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Environmental Map</h1>
      <p className="text-muted-foreground">
        Explore environmental data on an interactive map. View deforestation, carbon emissions, urban sprawl, and water
        quality data.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<MapFallback />}>
            <MapView />
          </Suspense>
        </div>
        <div>
          <DeforestationTracker />
        </div>
      </div>
    </div>
  )
}

