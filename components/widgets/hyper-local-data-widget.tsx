"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowUpRight, Info, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function HyperLocalDataWidget() {
  const [selectedLocation, setSelectedLocation] = useState("Delhi")
  const [selectedParameter, setSelectedParameter] = useState("aqi")
  const [selectedDataSource, setSelectedDataSource] = useState("government")
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setIsLoading(true)
    // In a real app, we would fetch data from APIs
    // For now, we'll simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
      renderChart()
    }, 800)

    return () => clearTimeout(timer)
  }, [selectedLocation, selectedParameter, selectedDataSource])

  const renderChart = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set chart dimensions
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Generate data based on selected parameters
    const mockData = generateMockData()
    const { dates, values } = mockData

    // Calculate scale
    const maxValue = Math.max(...values) * 1.1
    const minValue = Math.min(...values) * 0.9
    const valueRange = maxValue - minValue

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#888"
    ctx.stroke()

    // Draw line graph
    ctx.beginPath()
    const xStep = chartWidth / (dates.length - 1)

    // Get the primary color from CSS
    let primaryColor = "#16a34a" // Default color
    const computedStyle = getComputedStyle(document.documentElement)
    const primaryVar = computedStyle.getPropertyValue("--primary")
    if (primaryVar) {
      primaryColor = `hsl(${primaryVar})`
    }

    // Draw the data line
    dates.forEach((date, i) => {
      const x = padding + i * xStep
      const y = height - padding - ((values[i] - minValue) / valueRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw data point
      ctx.fillStyle = primaryColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels (dates)
    dates.forEach((date, i) => {
      const x = padding + i * xStep
      ctx.fillText(date, x, height - padding + 20)
    })

    // Y-axis labels
    ctx.textAlign = "right"
    const yStep = chartHeight / 5
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (valueRange * i) / 5
      const y = height - padding - i * yStep
      ctx.fillText(value.toFixed(1), padding - 10, y + 4)
    }

    // Chart title
    ctx.textAlign = "center"
    ctx.font = "14px Arial"
    ctx.fillText(getChartTitle(), width / 2, padding - 15)
  }

  const generateMockData = () => {
    // Generate realistic mock data based on selected parameters
    const dates = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

    let values: number[] = []

    // Different data patterns based on location and parameter
    if (selectedLocation === "Delhi") {
      if (selectedParameter === "aqi") {
        values = [180, 220, 300, 250, 190, 150, 210]
      } else if (selectedParameter === "water") {
        values = [45, 43, 40, 38, 35, 30, 33]
      } else if (selectedParameter === "forest") {
        values = [22.5, 22.3, 22.1, 21.9, 21.8, 21.7, 21.5]
      }
    } else if (selectedLocation === "Mumbai") {
      if (selectedParameter === "aqi") {
        values = [120, 140, 130, 150, 145, 130, 110]
      } else if (selectedParameter === "water") {
        values = [60, 58, 55, 54, 52, 48, 50]
      } else if (selectedParameter === "forest") {
        values = [18.5, 18.3, 18.2, 18.0, 17.8, 17.7, 17.6]
      }
    } else if (selectedLocation === "Bangalore") {
      if (selectedParameter === "aqi") {
        values = [90, 85, 95, 110, 100, 95, 90]
      } else if (selectedParameter === "water") {
        values = [75, 74, 72, 70, 68, 65, 68]
      } else if (selectedParameter === "forest") {
        values = [15.8, 15.7, 15.6, 15.4, 15.3, 15.1, 15.0]
      }
    }

    // Add variation based on data source
    if (selectedDataSource === "citizen") {
      values = values.map((value) => value * (Math.random() * 0.2 + 0.9)) // +/- 10%
    }

    return { dates, values }
  }

  const getChartTitle = () => {
    const parameterMap: Record<string, string> = {
      aqi: "Air Quality Index",
      water: "Water Quality Index",
      forest: "Forest Cover (sq km)",
    }

    return `${parameterMap[selectedParameter]} in ${selectedLocation}`
  }

  const getDataSourceName = (source: string) => {
    switch (source) {
      case "government":
        return "Government Sensors (CPCB/IMD)"
      case "satellite":
        return "Satellite Imagery (ISRO/NASA)"
      case "citizen":
        return "Citizen Reported Data"
      default:
        return "All Sources"
    }
  }

  const getParameterName = (param: string) => {
    switch (param) {
      case "aqi":
        return "Air Quality"
      case "water":
        return "Water Quality"
      case "forest":
        return "Forest Cover"
      default:
        return "All Parameters"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Hyper-Local Environmental Data</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Real-time data integrates government sensors, satellite imagery, and citizen reports for comprehensive
                  environmental monitoring across India.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Major Cities</SelectLabel>
                  <SelectItem value="Delhi">Delhi NCR</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={selectedParameter} onValueChange={setSelectedParameter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select parameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aqi">Air Quality</SelectItem>
                <SelectItem value="water">Water Quality</SelectItem>
                <SelectItem value="forest">Forest Cover</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="government">Government Sensors</SelectItem>
                <SelectItem value="satellite">Satellite Imagery</SelectItem>
                <SelectItem value="citizen">Citizen Reports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Last 7 Months</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading {getParameterName(selectedParameter)} data...</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto" />
            <div className="absolute bottom-0 right-0 bg-white/80 dark:bg-gray-800/80 p-2 rounded-tl-md text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-primary" />
                <span>Data source: {getDataSourceName(selectedDataSource)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="link" size="sm" className="text-primary">
            View Detailed Analysis
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

