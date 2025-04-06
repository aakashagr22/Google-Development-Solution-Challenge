"use client"

import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function RegionSelector() {
  const { selectedLocation } = useDashboard()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {selectedLocation ? selectedLocation.name : "Select a region"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 