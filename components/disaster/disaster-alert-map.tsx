"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Flame, ThermometerSun, ArrowRight, AlertTriangle, CloudRain } from "lucide-react"

export default function DisasterAlertMap() {
  const [disasterType, setDisasterType] = useState("flood")
  const [timespan, setTimespan] = useState("7days")
  const [isLoading, setIsLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsLoading(true)

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
      renderMap()
    }, 1000)

    return () => clearTimeout(timer)
  }, [disasterType, timespan])

  const renderMap = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw India map outline (simplified)
    ctx.beginPath()
    ctx.moveTo(150, 50) // Northern border
    ctx.lineTo(250, 40)
    ctx.lineTo(320, 80)
    ctx.lineTo(330, 150)
    ctx.lineTo(290, 220)
    ctx.lineTo(320, 290)
    ctx.lineTo(270, 350)
    ctx.lineTo(180, 380)
    ctx.lineTo(150, 320)
    ctx.lineTo(120, 220)
    ctx.lineTo(100, 150)
    ctx.lineTo(150, 50)

    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw risk areas based on disaster type
    const hotspots = getDisasterHotspots()

    hotspots.forEach((spot) => {
      const { x, y, intensity } = spot

      // Draw hotspot circle
      const radius = 10 + intensity * 20
      const gradient = ctx.createRadialGradient(x, y, 1, x, y, radius)

      // Set gradient colors based on disaster type
      if (disasterType === "flood") {
        gradient.addColorStop(0, "rgba(0, 0, 255, 0.7)")
        gradient.addColorStop(1, "rgba(0, 0, 255, 0)")
      } else if (disasterType === "drought") {
        gradient.addColorStop(0, "rgba(255, 165, 0, 0.7)")
        gradient.addColorStop(1, "rgba(255, 165, 0, 0)")
      } else if (disasterType === "fire") {
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.7)")
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)")
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const getDisasterHotspots = () => {
    // Return different hotspots based on disaster type
    switch (disasterType) {
      case "flood":
        return [
          { x: 250, y: 80, intensity: 0.8 }, // Kashmir/Himachal
          { x: 290, y: 180, intensity: 0.9 }, // Bihar
          { x: 240, y: 350, intensity: 0.7 }, // Tamil Nadu
          { x: 120, y: 220, intensity: 0.8 }, // Gujarat
        ]
      case "drought":
        return [
          { x: 190, y: 200, intensity: 0.9 }, // Rajasthan
          { x: 250, y: 220, intensity: 0.8 }, // Maharashtra
          { x: 210, y: 280, intensity: 0.7 }, // Karnataka
        ]
      case "fire":
        return [
          { x: 170, y: 70, intensity: 0.7 }, // Uttarakhand
          { x: 140, y: 150, intensity: 0.6 }, // Central India
          { x: 300, y: 120, intensity: 0.5 }, // Northeast
        ]
      default:
        return []
    }
  }

  const getDisasterInfo = () => {
    switch (disasterType) {
      case "flood":
        return {
          title: "Flood Risk Assessment",
          description:
            "Shows areas with high probability of flooding based on rainfall patterns, river levels, and terrain data.",
          icon: <CloudRain className="h-5 w-5" />,
          color: "text-blue-500",
          alerts: [
            {
              location: "Bihar and Eastern UP",
              message: "Major rivers above danger mark. 72-hour evacuation notice in effect.",
            },
            {
              location: "Coastal Tamil Nadu",
              message: "Heavy rainfall expected. Flash flood warning issued.",
            },
          ],
        }
      case "drought":
        return {
          title: "Drought Severity Index",
          description:
            "Highlights regions experiencing agricultural drought based on rainfall deficit and soil moisture data.",
          icon: <ThermometerSun className="h-5 w-5" />,
          color: "text-orange-500",
          alerts: [
            {
              location: "Marathwada Region, Maharashtra",
              message: "Severe drought conditions. Water rationing advised.",
            },
          ],
        }
      case "fire":
        return {
          title: "Forest Fire Vulnerability",
          description: "Predicts areas at risk of forest fires based on temperature, humidity and vegetation dryness.",
          icon: <Flame className="h-5 w-5" />,
          color: "text-red-500",
          alerts: [
            {
              location: "Uttarakhand Hills",
              message: "High fire risk due to dry conditions. Fire watch initiated.",
            },
          ],
        }
      default:
        return {
          title: "Disaster Risk Assessment",
          description: "Comprehensive multi-hazard risk assessment across India.",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "text-yellow-500",
          alerts: [],
        }
    }
  }

  const info = getDisasterInfo()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className={info.color}>{info.icon}</span>
          {info.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={disasterType} onValueChange={setDisasterType} className="mb-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="flood" className="flex items-center gap-1">
              <Droplet className="h-4 w-4" />
              <span>Flood</span>
            </TabsTrigger>
            <TabsTrigger value="drought" className="flex items-center gap-1">
              <ThermometerSun className="h-4 w-4" />
              <span>Drought</span>
            </TabsTrigger>
            <TabsTrigger value="fire" className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              <span>Fire</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-4 text-sm text-muted-foreground">{info.description}</div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm font-medium">Prediction Timeframe</div>
          <div className="flex gap-2">
            <Button
              variant={timespan === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimespan("7days")}
            >
              7 Days
            </Button>
            <Button
              variant={timespan === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimespan("30days")}
            >
              30 Days
            </Button>
          </div>
        </div>

        <div className="relative h-[300px] border rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-sm text-muted-foreground">Loading risk map...</p>
              </div>
            </div>
          ) : (
            <>
              <canvas ref={canvasRef} width={400} height={400} className="w-full h-full" />
              <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-md text-xs">
                Risk level:
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Low</span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></span>
                  <span>Medium</span>
                  <span className="w-3 h-3 rounded-full bg-red-500 ml-2"></span>
                  <span>High</span>
                </div>
              </div>
            </>
          )}
        </div>

        {info.alerts.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-medium">Active Alerts</h4>
            {info.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2 border-l-2 border-destructive pl-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">{alert.location}</p>
                  <p className="text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            View Emergency Resources
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

