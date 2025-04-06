"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { EmissionsTracker } from "../components/emissions-tracker.jsx"
import { DeforestationTracker } from "../components/DeforestationTracker.jsx"
import { AQIDisplay } from "../components/AQIDisplay.jsx"
import { TemperatureChart } from "../components/TemperatureChart.jsx"
import { LocationHeader } from "../components/LocationHeader.jsx"
import { YearSelector } from "../components/YearSelector.jsx"
import { NewsAlerts } from "../components/NewsAlerts.jsx"
import { TreesNeededCard } from "../components/TreesNeededCard.jsx"
import { WaterConsumption } from "../components/WaterConsumption.jsx"

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(2023)
  const [selectedLocation, setSelectedLocation] = useState("Global")

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <LocationHeader location={selectedLocation} onLocationChange={setSelectedLocation} />
        <YearSelector year={selectedYear} onYearChange={setSelectedYear} minYear={1990} maxYear={2023} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Carbon Emissions</CardTitle>
            <CardDescription>Global CO₂ emissions in metric tons</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsTracker year={selectedYear} location={selectedLocation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Deforestation</CardTitle>
            <CardDescription>Forest area lost in hectares</CardDescription>
          </CardHeader>
          <CardContent>
            <DeforestationTracker year={selectedYear} location={selectedLocation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Air Quality</CardTitle>
            <CardDescription>Current AQI measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <AQIDisplay location={selectedLocation} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Temperature Trends</CardTitle>
            <CardDescription>Average global temperature anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <TemperatureChart year={selectedYear} location={selectedLocation} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Trees Needed</CardTitle>
            <CardDescription>To offset carbon emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <TreesNeededCard location={selectedLocation} year={selectedYear} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Water Consumption</CardTitle>
            <CardDescription>Annual freshwater usage</CardDescription>
          </CardHeader>
          <CardContent>
            <WaterConsumption location={selectedLocation} year={selectedYear} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Climate News</CardTitle>
            <CardDescription>Recent environmental alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <NewsAlerts location={selectedLocation} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

