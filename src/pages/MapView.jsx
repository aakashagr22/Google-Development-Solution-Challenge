"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import { MapControls } from "../components/MapControls.jsx"
import { MapLegend } from "../components/MapLegend.jsx"
import { TimeSeriesChart } from "../components/TimeSeriesChart.jsx"
import { SatelliteSearch } from "../components/SatelliteSearch.jsx"

export function MapView() {
  const [mapType, setMapType] = useState("emissions")
  const [year, setYear] = useState(2023)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Interactive Map View</h2>
        <Tabs value={mapType} onValueChange={setMapType} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="emissions">Emissions</TabsTrigger>
            <TabsTrigger value="deforestation">Deforestation</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="disasters">Disasters</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle>Global {mapType.charAt(0).toUpperCase() + mapType.slice(1)} Map</CardTitle>
            <CardDescription>Interactive visualization of climate data</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-b-lg bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                Map visualization would render here
                <br />
                (Requires map integration)
              </div>
              <MapControls className="absolute bottom-4 right-4" />
              <MapLegend className="absolute bottom-4 left-4" type={mapType} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Time Controls</CardTitle>
              <CardDescription>Adjust time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year: {year}</label>
                <input
                  type="range"
                  min="1990"
                  max="2023"
                  value={year}
                  onChange={(e) => setYear(Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1990</span>
                  <span>2023</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Satellite Search</CardTitle>
              <CardDescription>Find satellite imagery</CardDescription>
            </CardHeader>
            <CardContent>
              <SatelliteSearch />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Historical Trends</CardTitle>
          <CardDescription>Time series data for selected region</CardDescription>
        </CardHeader>
        <CardContent>
          <TimeSeriesChart type={mapType} year={year} />
        </CardContent>
      </Card>
    </div>
  )
}

