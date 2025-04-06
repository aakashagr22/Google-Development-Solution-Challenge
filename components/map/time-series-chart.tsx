"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSeriesChartProps {
  data: any
  isLoading: boolean
}

export default function TimeSeriesChart({ data, isLoading }: TimeSeriesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || isLoading) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

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

    // Draw data line
    if (data.data && data.data.length > 0) {
      const values = data.data.map((item: any) => item.value)
      const years = data.data.map((item: any) => item.year)

      const minValue = Math.min(...values) * 0.9
      const maxValue = Math.max(...values) * 1.1
      const valueRange = maxValue - minValue

      ctx.beginPath()
      const xStep = chartWidth / (data.data.length - 1)

      data.data.forEach((item: any, i: number) => {
        const x = padding + i * xStep
        const y = height - padding - ((item.value - minValue) / valueRange) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        // Draw data point
        ctx.fillStyle = "#4CAF50"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.strokeStyle = "#4CAF50"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw labels
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"

      // X-axis labels (years)
      years.forEach((year: number, i: number) => {
        const x = padding + i * xStep
        ctx.fillText(year.toString(), x, height - padding + 20)
      })

      // Y-axis labels
      ctx.textAlign = "right"
      const yStep = chartHeight / 5
      for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange * i) / 5
        const y = height - padding - i * yStep
        ctx.fillText(value.toFixed(1), padding - 10, y + 4)
      }

      // Title
      ctx.textAlign = "center"
      ctx.font = "14px Arial"
      ctx.fillText(`${data.title} (${data.unit})`, width / 2, padding - 15)
    }
  }, [data, isLoading])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historical Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Historical Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">No historical data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Historical Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
      </CardContent>
    </Card>
  )
}

