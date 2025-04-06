"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Droplet, Info, ArrowUpRight, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function WaterConsumption() {
  const { selectedLocation, selectedYear, environmentalData } = useDashboard()

  if (!selectedLocation || !environmentalData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Water Consumption & Pollution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Select a location to view water data
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get water quality data
  const waterData = environmentalData.find((data) => data.type === "water")

  // Calculate water metrics based on water quality data
  const waterQuality = waterData ? waterData.value : 0
  const waterConsumption = calculateWaterConsumption(selectedLocation.type)
  const pollutionLevel = 100 - waterQuality
  const waterStress = calculateWaterStress(selectedLocation.name, waterQuality)

  // Get water quality status
  const getWaterQualityStatus = () => {
    if (waterQuality >= 80) return { label: "Excellent", color: "text-green-500", variant: "success" }
    if (waterQuality >= 60) return { label: "Good", color: "text-blue-500", variant: "default" }
    if (waterQuality >= 40) return { label: "Fair", color: "text-yellow-500", variant: "warning" }
    if (waterQuality >= 20) return { label: "Poor", color: "text-orange-500", variant: "warning" }
    return { label: "Critical", color: "text-red-500", variant: "destructive" }
  }

  const waterStatus = getWaterQualityStatus()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Water Consumption & Pollution</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This analysis shows water quality, consumption patterns, and pollution levels for the selected
                  location.
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
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${waterStatus.color} bg-muted`}>
                <Droplet className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-medium flex items-center gap-2">
                  <span className={waterStatus.color}>{waterStatus.label} Water Quality</span>
                  <Badge variant={waterStatus.variant as any}>{waterQuality.toFixed(1)} / 100</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Water quality index for {selectedLocation.name}, {selectedYear}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Daily Water Consumption</h4>
                <span className="text-sm font-medium">{waterConsumption} liters per capita</span>
              </div>
              <Progress value={Math.min(100, (waterConsumption / 200) * 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Average daily water consumption per person</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Pollution Level</h4>
                <span className="text-sm font-medium">{pollutionLevel.toFixed(1)}%</span>
              </div>
              <Progress
                value={pollutionLevel}
                className="h-2"
                indicatorClassName={pollutionLevel > 60 ? "bg-destructive" : undefined}
              />
              <p className="text-xs text-muted-foreground mt-1">Percentage of water bodies affected by pollution</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Water Stress Level</h4>
                <span className="text-sm font-medium">{waterStress.toFixed(1)}%</span>
              </div>
              <Progress
                value={waterStress}
                className="h-2"
                indicatorClassName={waterStress > 60 ? "bg-destructive" : undefined}
              />
              <p className="text-xs text-muted-foreground mt-1">Ratio of water withdrawal to available supply</p>
            </div>

            {pollutionLevel > 60 || waterStress > 70 ? (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex gap-2 items-start mt-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">Water Resource Alert</h4>
                  <p className="text-xs mt-1">
                    {selectedLocation.name} is experiencing{" "}
                    {waterStress > 70 ? "high water stress" : "significant water pollution"}. Sustainable water
                    management practices are urgently needed.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <Button variant="link" size="sm" className="mt-4 self-end flex items-center gap-1">
            View detailed water report <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to calculate water consumption based on location type
function calculateWaterConsumption(locationType: string): number {
  switch (locationType) {
    case "city":
      return 135 + Math.round(Math.random() * 40)
    case "state":
      return 110 + Math.round(Math.random() * 30)
    case "district":
      return 90 + Math.round(Math.random() * 25)
    case "region":
      return 80 + Math.round(Math.random() * 20)
    default:
      return 100 + Math.round(Math.random() * 30)
  }
}

// Helper function to calculate water stress based on location name and water quality
function calculateWaterStress(locationName: string, waterQuality: number): number {
  // Base water stress is inversely proportional to water quality
  let baseStress = 100 - waterQuality * 0.8

  // Adjust based on location
  if (locationName.includes("Delhi") || locationName.includes("Rajasthan")) {
    baseStress += 20
  } else if (locationName.includes("Kerala") || locationName.includes("Assam")) {
    baseStress -= 15
  } else if (locationName.includes("Mumbai") || locationName.includes("Chennai")) {
    baseStress += 10
  }

  // Ensure within range
  return Math.max(5, Math.min(95, baseStress))
}

