"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import { Button } from "../components/ui/button.jsx"
import { Slider } from "../components/ui/slider.jsx"
import { Badge } from "../components/ui/badge.jsx"
import { AirQualityForecast } from "../components/AirQualityForecast.jsx"
import { TemperatureProjection } from "../components/TemperatureProjection.jsx"
import { EmissionsScenario } from "../components/EmissionsScenario.jsx"
import { SeaLevelRiseMap } from "../components/SeaLevelRiseMap.jsx"

export function Predictions() {
  const [scenarioType, setScenarioType] = useState("moderate")
  const [yearProjection, setYearProjection] = useState(2050)

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Climate Predictions</h2>
          <p className="text-muted-foreground">AI-powered climate projections and scenarios</p>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Scenario:</span>
            <Tabs value={scenarioType} onValueChange={setScenarioType} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="optimistic">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-500">
                    Optimistic
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="moderate">
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 border-yellow-500">
                    Moderate
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="pessimistic">
                  <Badge variant="outline" className="bg-red-100 dark:bg-red-900 border-red-500">
                    Pessimistic
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Year: {yearProjection}</span>
            <Slider
              value={[yearProjection]}
              min={2030}
              max={2100}
              step={5}
              onValueChange={(value) => setYearProjection(value[0])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Temperature Projection</CardTitle>
            <CardDescription>Global temperature increase by {yearProjection}</CardDescription>
          </CardHeader>
          <CardContent>
            <TemperatureProjection scenario={scenarioType} year={yearProjection} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Emissions Scenario</CardTitle>
            <CardDescription>Projected carbon emissions by {yearProjection}</CardDescription>
          </CardHeader>
          <CardContent>
            <EmissionsScenario scenario={scenarioType} year={yearProjection} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sea Level Rise</CardTitle>
            <CardDescription>Projected coastal impacts by {yearProjection}</CardDescription>
          </CardHeader>
          <CardContent>
            <SeaLevelRiseMap scenario={scenarioType} year={yearProjection} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Air Quality Forecast</CardTitle>
            <CardDescription>Projected AQI levels by {yearProjection}</CardDescription>
          </CardHeader>
          <CardContent>
            <AirQualityForecast scenario={scenarioType} year={yearProjection} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Policy Impact Simulator</CardTitle>
          <CardDescription>Explore how policy changes could affect climate outcomes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Renewable Energy Adoption</label>
                <Slider defaultValue={[30]} max={100} step={5} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Carbon Tax Level</label>
                <Slider defaultValue={[25]} max={100} step={5} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>None</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Reforestation Efforts</label>
                <Slider defaultValue={[40]} max={100} step={5} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <Button className="w-full md:w-auto">Simulate Policy Impact</Button>

            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Adjust the sliders above to simulate different policy scenarios and see their projected impact on
                climate outcomes. The simulator will calculate potential temperature changes, emissions reductions, and
                other key metrics based on your inputs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

