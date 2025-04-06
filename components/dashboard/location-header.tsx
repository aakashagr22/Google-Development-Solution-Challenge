"use client"

import { MapPin, AlertTriangle, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LocationResult } from "@/components/location-search"
import { Button } from "@/components/ui/button"
import { Collapsible } from "@/components/ui/collapsible"

interface LocationHeaderProps {
  location: LocationResult
  showAlerts: boolean
  setShowAlerts: (show: boolean) => void
  alerts: any[]
}

export default function LocationHeader({ location, showAlerts, setShowAlerts, alerts }: LocationHeaderProps) {
  if (!location) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-1 w-1" />
            <p>Please select a location to view environmental data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-700" />
          <h2 className="text-xl font-semibold text-green-800">{location.name}</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-200 hover:bg-green-50"
          onClick={() => setShowAlerts(!showAlerts)}
        >
          {showAlerts ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 text-green-700" />
              Hide Alerts
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 text-green-700" />
              Show Alerts
            </>
          )}
        </Button>
      </div>

      <Collapsible open={showAlerts}>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-green-100 bg-green-50"
            >
              <div className="flex-shrink-0">
                {alert.severity === "high" && (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                {alert.severity === "medium" && (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                {alert.severity === "low" && (
                  <AlertTriangle className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">{alert.title}</h3>
                <p className="text-sm text-green-700">{alert.description}</p>
                <p className="text-xs text-green-600 mt-1">{alert.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  )
}

function getLocationAlert(location: any) {
  // Return location-specific alerts based on the location
  if (location.name === "Delhi") {
    return <Badge variant="destructive">Air Quality Alert</Badge>
  } else if (location.name === "Mumbai") {
    return <Badge variant="warning">Coastal Erosion Risk</Badge>
  } else if (location.name === "Chennai") {
    return <Badge variant="warning">Water Scarcity Alert</Badge>
  } else if (location.name === "Western Ghats") {
    return <Badge variant="destructive">Deforestation Alert</Badge>
  }

  return null
}

