"use client"

import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AQIDisplay() {
  const { aqiData } = useDashboard()

  if (!aqiData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Air Quality Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Select a location to view AQI data
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Air Quality Index (AQI)</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  The Air Quality Index (AQI) is a measure of air pollution. Higher values indicate worse air quality
                  and greater health concerns.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-14 w-20 rounded-full flex items-center justify-center text-2xl font-bold ${aqiData.color}`}
              >
                {aqiData.value}
              </div>
              <div>
                <div className="text-lg font-medium">{aqiData.category}</div>
                <Badge variant="outline">{getCategoryDescription(aqiData.category)}</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Health Implications</h4>
              <p className="text-sm text-muted-foreground">{aqiData.healthImplications}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Cautionary Statement</h4>
              <p className="text-sm text-muted-foreground">{aqiData.cautionaryStatement}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Major Pollutants</h4>
              <div className="grid grid-cols-3 gap-2">
                <PollutantBadge name="PM2.5" value={aqiData.pollutants.pm25} unit="μg/m³" />
                <PollutantBadge name="PM10" value={aqiData.pollutants.pm10} unit="μg/m³" />
                <PollutantBadge name="O₃" value={aqiData.pollutants.o3} unit="ppb" />
                <PollutantBadge name="NO₂" value={aqiData.pollutants.no2} unit="ppb" />
                <PollutantBadge name="SO₂" value={aqiData.pollutants.so2} unit="ppb" />
                <PollutantBadge name="CO" value={aqiData.pollutants.co} unit="ppm" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PollutantBadge({ name, value, unit }: { name: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center bg-muted/30 p-2 rounded-md">
      <span className="text-xs font-medium">{name}</span>
      <span className="text-sm">{value}</span>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  )
}

function getCategoryDescription(category: string): string {
  switch (category) {
    case "Good":
      return "Safe for all activities"
    case "Moderate":
      return "Acceptable for most"
    case "Poor":
      return "Unhealthy for sensitive groups"
    case "Very Poor":
      return "Unhealthy for all"
    case "Severe":
      return "Hazardous conditions"
    default:
      return "Unknown"
  }
}

