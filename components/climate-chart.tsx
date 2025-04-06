"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClimateChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [timeRange, setTimeRange] = useState<"50years" | "100years" | "150years">("150years")

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Sample data: Global temperature anomalies (°C) based on selected time range
    let years: number[] = []
    let temperatures: number[] = []

    if (timeRange === "50years") {
      // Last 50 years (1970-2020)
      years = Array.from({ length: 11 }, (_, i) => 1970 + i * 5)
      temperatures = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.9, 1.1, 1.4]
    } else if (timeRange === "100years") {
      // Last 100 years (1920-2020)
      years = Array.from({ length: 11 }, (_, i) => 1920 + i * 10)
      temperatures = [-0.1, -0.05, 0.0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.4]
    } else {
      // Last 150 years (1870-2020)
      years = Array.from({ length: 16 }, (_, i) => 1870 + i * 10)
      temperatures = [-0.3, -0.25, -0.2, -0.15, -0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6]
    }

    // Chart dimensions
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.strokeStyle = "#888"
    ctx.stroke()

    // Draw temperature line
    ctx.beginPath()
    const xStep = chartWidth / (years.length - 1)
    const yScale = chartHeight / 2.5 // Scale factor for temperature values

    years.forEach((year, i) => {
      const x = padding + i * xStep
      const y = height - padding - (temperatures[i] + 0.5) * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw data point
      ctx.fillStyle = temperatures[i] <= 0 ? "#3b82f6" : "#ef4444"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw labels
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"

    // X-axis labels (years)
    years.forEach((year, i) => {
      const x = padding + i * xStep
      ctx.fillText(year.toString(), x, height - padding + 20)
    })

    // Y-axis labels (temperature anomalies)
    ctx.textAlign = "right"
    for (let temp = -0.5; temp <= 2.0; temp += 0.5) {
      const y = height - padding - (temp + 0.5) * yScale
      ctx.fillText(`${temp.toFixed(1)}°C`, padding - 10, y + 4)
    }

    // Title
    ctx.textAlign = "center"
    ctx.font = "14px Arial"
    ctx.fillText(`Global Temperature Anomalies (${years[0]}-${years[years.length - 1]})`, width / 2, padding - 15)

    // Draw reference line at 0°C
    ctx.beginPath()
    ctx.moveTo(padding, height - padding - 0.5 * yScale)
    ctx.lineTo(width - padding, height - padding - 0.5 * yScale)
    ctx.strokeStyle = "#aaa"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.setLineDash([])
  }, [timeRange])

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Global Temperature Trends</h3>
        <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
          <TabsList>
            <TabsTrigger value="50years">50 Years</TabsTrigger>
            <TabsTrigger value="100years">100 Years</TabsTrigger>
            <TabsTrigger value="150years">150 Years</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-auto" />
      <p className="text-xs text-center text-muted-foreground mt-2">
        Data source: NASA GISS Surface Temperature Analysis (GISTEMP v4)
      </p>
    </Card>
  )
}

