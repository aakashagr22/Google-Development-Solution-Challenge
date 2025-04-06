"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, AlertTriangle, ArrowUpRight, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

export default function BiodiversityImpact() {
  const { selectedLocation, selectedYear, environmentalData } = useDashboard()

  if (!selectedLocation || !environmentalData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Biodiversity Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Select a location to view biodiversity impact data
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get deforestation data
  const deforestationData = environmentalData.find((data) => data.type === "deforestation")

  // Calculate biodiversity impact based on deforestation data
  const impactLevel = deforestationData ? calculateImpactLevel(deforestationData.value) : "unknown"
  const speciesAtRisk = deforestationData ? Math.round(deforestationData.value * 5) : 0
  const habitatLoss = deforestationData ? Math.round(deforestationData.value * 1.2) : 0

  // Get impact color
  const getImpactColor = () => {
    switch (impactLevel) {
      case "critical":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "moderate":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Get impact badge variant
  const getImpactBadgeVariant = () => {
    switch (impactLevel) {
      case "critical":
        return "destructive"
      case "high":
        return "warning"
      case "moderate":
        return "secondary"
      case "low":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Biodiversity Impact</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This analysis shows the estimated impact of deforestation on local biodiversity, including habitat
                  loss and species at risk.
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
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getImpactColor()} bg-muted`}>
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-medium flex items-center gap-2">
                  <span className={getImpactColor()}>
                    {impactLevel.charAt(0).toUpperCase() + impactLevel.slice(1)} Impact
                  </span>
                  <Badge variant={getImpactBadgeVariant()}>
                    {impactLevel === "critical" && "Urgent Action Needed"}
                    {impactLevel === "high" && "Significant Concern"}
                    {impactLevel === "moderate" && "Monitoring Required"}
                    {impactLevel === "low" && "Sustainable Level"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on deforestation data for {selectedLocation.name}, {selectedYear}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Species at Risk</h4>
                <span className="text-sm font-medium">{speciesAtRisk}</span>
              </div>
              <Progress value={Math.min(100, (speciesAtRisk / 100) * 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Estimated number of local species affected by habitat changes
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium">Habitat Loss</h4>
                <span className="text-sm font-medium">{habitatLoss}%</span>
              </div>
              <Progress value={habitatLoss} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">Percentage of natural habitat lost in the region</p>
            </div>

            {impactLevel === "critical" || impactLevel === "high" ? (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 flex gap-2 items-start mt-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-destructive">Critical Ecosystem Alert</h4>
                  <p className="text-xs mt-1">
                    Current deforestation rates in {selectedLocation.name} are threatening critical ecosystems and
                    endangered species. Immediate conservation efforts are recommended.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <Button variant="link" size="sm" className="mt-4 self-end flex items-center gap-1">
            View detailed biodiversity report <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to calculate impact level based on deforestation value
function calculateImpactLevel(deforestationValue: number): "critical" | "high" | "moderate" | "low" | "unknown" {
  if (deforestationValue >= 30) return "critical"
  if (deforestationValue >= 20) return "high"
  if (deforestationValue >= 10) return "moderate"
  if (deforestationValue >= 0) return "low"
  return "unknown"
}

