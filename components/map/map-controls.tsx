"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, Compass } from "lucide-react"

interface MapControlsProps {
  map?: any
}

export default function MapControls({ map }: MapControlsProps) {
  const handleZoomIn = () => {
    if (map && typeof map.getZoom === "function") {
      map.setZoom((map.getZoom() || 0) + 1)
    }
  }

  const handleZoomOut = () => {
    if (map && typeof map.getZoom === "function") {
      map.setZoom((map.getZoom() || 0) - 1)
    }
  }

  const handleResetOrientation = () => {
    if (map) {
      if (typeof map.setHeading === "function") {
        map.setHeading(0)
      }
      if (typeof map.setTilt === "function") {
        map.setTilt(0)
      }
    }
  }

  return (
    <Card className="p-2 flex flex-col gap-2">
      <Button variant="outline" size="icon" onClick={handleZoomIn}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button variant="outline" size="icon" onClick={handleZoomOut}>
        <Minus className="h-4 w-4" />
        <span className="sr-only">Zoom out</span>
      </Button>
      <div className="w-full h-px bg-border my-1" />
      <Button variant="outline" size="icon" onClick={handleResetOrientation}>
        <Compass className="h-4 w-4" />
        <span className="sr-only">Reset orientation</span>
      </Button>
    </Card>
  )
}

