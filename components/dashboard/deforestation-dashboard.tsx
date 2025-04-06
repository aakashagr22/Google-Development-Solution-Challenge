"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapView } from "@/components/maps/map-view"
import { RegionSelector } from "@/components/maps/region-selector"
import { DeforestationChart } from "@/components/charts/deforestation-chart"
import { useDashboard } from "@/components/dashboard/dashboard-context"

export function DeforestationDashboard() {
  const { selectedLocation, selectedYear } = useDashboard()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Deforestation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <MapView
              location={selectedLocation}
              year={selectedYear}
              onLoadingChange={setIsLoading}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Region Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <RegionSelector />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Deforestation Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <DeforestationChart
            location={selectedLocation}
            year={selectedYear}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
} 