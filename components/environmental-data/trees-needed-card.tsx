"use client"

import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TreesNeededCard() {
  const { treesNeeded, selectedLocation, selectedYear } = useDashboard()

  if (!treesNeeded || !selectedLocation) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Trees Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Select a location to calculate trees needed
          </div>
        </CardContent>
      </Card>
    )
  }

  // Format large numbers with commas
  const formattedTreesNeeded = treesNeeded.toLocaleString()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Trees Needed to Offset Carbon</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This calculation estimates the number of mature trees needed annually to offset the carbon emissions
                  from this location. One mature tree absorbs approximately 22 kg of CO₂ per year.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-4">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-10 w-10 text-green-500" />
            <div className="text-3xl font-bold">{formattedTreesNeeded}</div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            trees needed annually to offset carbon emissions in {selectedLocation.name} for {selectedYear}
          </p>

          <div className="mt-4 bg-muted/30 p-3 rounded-md w-full">
            <h4 className="text-sm font-medium mb-1">What this means</h4>
            <p className="text-xs text-muted-foreground">
              {getTreesNeededDescription(treesNeeded, selectedLocation.name)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getTreesNeededDescription(treesNeeded: number, locationName: string): string {
  if (treesNeeded < 1000000) {
    return `${locationName} would need a modest reforestation effort to offset its carbon footprint. This is achievable with community-based tree planting initiatives.`
  } else if (treesNeeded < 10000000) {
    return `${locationName} requires a significant reforestation program to balance its carbon emissions. This would need coordinated efforts between government and private sectors.`
  } else if (treesNeeded < 100000000) {
    return `${locationName} faces a major challenge in offsetting its carbon footprint. Large-scale afforestation projects combined with emissions reduction strategies are essential.`
  } else {
    return `${locationName} has an extremely high carbon footprint that would be difficult to offset through tree planting alone. Aggressive carbon reduction policies are necessary alongside massive reforestation efforts.`
  }
}

