"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx"
import { Button } from "../ui/button.jsx"
import { Badge } from "../ui/badge.jsx"
import { Slider } from "../ui/slider.jsx"
import { Switch } from "../ui/switch.jsx"
import { Label } from "../ui/label.jsx"

export function AnalyticsSidebar({ activeAnalysis = "carbon" }) {
  const [timeRange, setTimeRange] = useState([1990, 2023])
  const [showProjections, setShowProjections] = useState(false)
  const [dataResolution, setDataResolution] = useState("monthly")

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Analysis Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Time Range</Label>
              <span className="text-sm text-muted-foreground">
                {timeRange[0]} - {timeRange[1]}
              </span>
            </div>
            <Slider value={timeRange} min={1950} max={2023} step={1} onValueChange={setTimeRange} className="w-full" />
          </div>

          <div className="space-y-2">
            <Label>Data Resolution</Label>
            <div className="grid grid-cols-3 gap-2">
              {["yearly", "monthly", "daily"].map((resolution) => (
                <Button
                  key={resolution}
                  variant={dataResolution === resolution ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDataResolution(resolution)}
                  className="w-full"
                >
                  {resolution.charAt(0).toUpperCase() + resolution.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="show-projections" checked={showProjections} onCheckedChange={setShowProjections} />
            <Label htmlFor="show-projections">Show Projections</Label>
          </div>

          <Button className="w-full">Apply Filters</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activeAnalysis === "carbon" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm">Global Carbon Project</span>
                <Badge variant="outline">Primary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NOAA Climate Data</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">EPA Emissions Database</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
            </>
          )}

          {activeAnalysis === "deforestation" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm">Global Forest Watch</span>
                <Badge variant="outline">Primary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">NASA Earth Observatory</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">FAO Forest Resources</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
            </>
          )}

          {activeAnalysis === "urban" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm">UN Habitat Data</span>
                <Badge variant="outline">Primary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">World Bank Urban Dev</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Landsat Imagery</span>
                <Badge variant="outline">Secondary</Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF Report
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Images
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

