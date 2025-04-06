"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DataType } from "@/components/dashboard/dashboard-context"
import type { LocationResult } from "@/components/location-search"
import { getMonthlyData } from "./data-service"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart, ArrowUpRight, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DataChartProps {
  location: LocationResult
  year: number
  type: DataType
}

export default function DataChart({ location, year, type }: DataChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line")
  const [isHovering, setIsHovering] = useState(false)
  const [hoverData, setHoverData] = useState<{ x: number; y: number; value: number; month: string } | null>(null)

  // Get data once for the component
  const monthlyData = getMonthlyData(location, year, type)

  // Get color based on data type
  const getTypeColor = () => {
    const colors = {
      deforestation: "#16a34a", // green-600
      carbon: "#d97706", // amber-600
      urban: "#2563eb", // blue-600
      water: "#0891b2", // cyan-600
    }
    return colors[type] || "#16a34a"
  }

  const renderChart = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Chart dimensions
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values for scaling
    const values = monthlyData.map((item) => item.value)
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

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#eee"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight) / 5
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
    }

    // Vertical grid lines
    const xStep = chartWidth / (monthlyData.length - 1)
    for (let i = 0; i < monthlyData.length; i++) {
      const x = padding + i * xStep
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
    }

    ctx.stroke()

    // Get line color
    const lineColor = getTypeColor()

    if (chartType === "line") {
      // Draw data line
      ctx.beginPath()

      monthlyData.forEach((item, i) => {
        const x = padding + i * xStep
        const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Fill area under the line
      ctx.lineTo(padding + (monthlyData.length - 1) * xStep, height - padding)
      ctx.lineTo(padding, height - padding)
      ctx.closePath()
      ctx.fillStyle = `${lineColor}20` // 20% opacity
      ctx.fill()

      // Draw data points
      monthlyData.forEach((item, i) => {
        const x = padding + i * xStep
        const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight

        ctx.fillStyle = lineColor
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw white inner circle for better visibility
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    } else if (chartType === "bar") {
      // Draw bar chart
      const barWidth = (chartWidth / monthlyData.length) * 0.7

      monthlyData.forEach((item, i) => {
        const x = padding + i * (chartWidth / monthlyData.length) + (chartWidth / monthlyData.length - barWidth) / 2
        const barHeight = ((item.value - minValue) / valueRange) * chartHeight
        const y = height - padding - barHeight

        // Draw bar
        ctx.fillStyle = `${lineColor}80` // 50% opacity
        ctx.fillRect(x, y, barWidth, barHeight)

        // Draw bar border
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, barWidth, barHeight)
      })
    } else if (chartType === "pie") {
      // Draw pie chart
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(chartWidth, chartHeight) / 2

      const total = values.reduce((sum, value) => sum + value, 0)
      let startAngle = 0

      monthlyData.forEach((item, i) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        // Use different shades of the same color
        const shade = 0.5 + (i / monthlyData.length) * 0.5
        ctx.fillStyle = adjustColor(lineColor, shade)
        ctx.fill()

        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1
        ctx.stroke()

        startAngle += sliceAngle
      })
    }

    // Draw labels
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels (months)
    monthlyData.forEach((item, i) => {
      const x = padding + i * xStep
      ctx.fillText(item.month, x, height - padding + 20)
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
    ctx.fillText(getChartTitle(type, year), width / 2, padding - 15)

    // Draw hover tooltip if needed
    if (isHovering && hoverData) {
      const tooltipWidth = 120
      const tooltipHeight = 40
      let tooltipX = hoverData.x + 10
      let tooltipY = hoverData.y - tooltipHeight - 10

      // Ensure tooltip stays within canvas
      if (tooltipX + tooltipWidth > width) tooltipX = hoverData.x - tooltipWidth - 10
      if (tooltipY < 0) tooltipY = hoverData.y + 10

      // Draw tooltip background
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 4)
      ctx.fill()

      // Draw tooltip text
      ctx.fillStyle = "#fff"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.fillText(hoverData.month, tooltipX + 8, tooltipY + 16)
      ctx.fillText(`${hoverData.value.toFixed(1)} ${getUnitForType(type)}`, tooltipX + 8, tooltipY + 32)
    }
  }

  // Handle mouse move for tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Chart dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2

    // Find closest data point
    const xStep = chartWidth / (monthlyData.length - 1)
    let closestPoint = null
    let minDistance = Number.POSITIVE_INFINITY

    monthlyData.forEach((item, i) => {
      const pointX = padding + i * xStep
      const distance = Math.abs(x - pointX)

      if (distance < minDistance && distance < 20) {
        minDistance = distance
        closestPoint = {
          x: pointX,
          y:
            height -
            padding -
            ((item.value - Math.min(...monthlyData.map((d) => d.value)) * 0.9) /
              (Math.max(...monthlyData.map((d) => d.value)) * 1.1 -
                Math.min(...monthlyData.map((d) => d.value)) * 0.9)) *
              (height - padding * 2),
          value: item.value,
          month: item.month,
        }
      }
    })

    setHoverData(closestPoint)
    setIsHovering(closestPoint !== null)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setHoverData(null)
  }

  // Function to adjust color brightness
  function adjustColor(color: string, factor: number): string {
    // Convert hex to RGB
    const r = Number.parseInt(color.slice(1, 3), 16)
    const g = Number.parseInt(color.slice(3, 5), 16)
    const b = Number.parseInt(color.slice(5, 7), 16)

    // Adjust brightness
    const newR = Math.min(255, Math.round(r * factor))
    const newG = Math.min(255, Math.round(g * factor))
    const newB = Math.min(255, Math.round(b * factor))

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
  }

  // Export chart as image
  const exportChart = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `${type}-chart-${location.name}-${year}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  useEffect(() => {
    renderChart()
  }, [location, year, type, chartType, isHovering, hoverData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{getDataTypeTitle(type)} Trends</CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${chartType === "line" ? "bg-muted" : ""}`}
                    onClick={() => setChartType("line")}
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Line Chart</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${chartType === "bar" ? "bg-muted" : ""}`}
                    onClick={() => setChartType("bar")}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bar Chart</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${chartType === "pie" ? "bg-muted" : ""}`}
                    onClick={() => setChartType("pie")}
                  >
                    <PieChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pie Chart</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportChart}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export Chart</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            Monthly data for {location.name}, {year}
          </p>
          <Button variant="link" size="sm" className="text-xs flex items-center gap-1 p-0">
            View detailed analysis <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function getDataTypeTitle(type: string) {
  switch (type) {
    case "deforestation":
      return "Deforestation"
    case "carbon":
      return "Carbon Emissions"
    case "urban":
      return "Urban Sprawl"
    case "water":
      return "Water Quality"
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function getChartTitle(type: string, year: number) {
  switch (type) {
    case "deforestation":
      return `Monthly Deforestation Rate (${year})`
    case "carbon":
      return `Monthly Carbon Emissions (${year})`
    case "urban":
      return `Monthly Urban Growth (${year})`
    case "water":
      return `Monthly Water Quality Index (${year})`
    default:
      return `Monthly ${type.charAt(0).toUpperCase() + type.slice(1)} Data (${year})`
  }
}

function getUnitForType(type: string) {
  switch (type) {
    case "deforestation":
      return "% forest loss"
    case "carbon":
      return "tons CO₂/capita"
    case "urban":
      return "% urban area"
    case "water":
      return "quality index"
    default:
      return "units"
  }
}

