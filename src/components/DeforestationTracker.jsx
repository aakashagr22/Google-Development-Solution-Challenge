"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "./ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const generateDeforestationData = (year, location) => {
  const baseData = [
    { month: "Jan", hectares: 18 },
    { month: "Feb", hectares: 22 },
    { month: "Mar", hectares: 25 },
    { month: "Apr", hectares: 29 },
    { month: "May", hectares: 32 },
    { month: "Jun", hectares: 35 },
    { month: "Jul", hectares: 38 },
    { month: "Aug", hectares: 36 },
    { month: "Sep", hectares: 32 },
    { month: "Oct", hectares: 28 },
    { month: "Nov", hectares: 24 },
    { month: "Dec", hectares: 20 },
  ]

  // Adjust data based on year and location
  const yearFactor = Math.max(0, (2023 - year) / 20) // More deforestation in the past
  const locationMultiplier =
    location === "Global"
      ? 1
      : location === "South America"
        ? 1.5
        : location === "Africa"
          ? 1.2
          : location === "Southeast Asia"
            ? 1.3
            : 0.7

  return baseData.map((item) => ({
    ...item,
    hectares: Math.round(item.hectares * (1 + yearFactor) * locationMultiplier),
  }))
}

export function DeforestationTracker({ year = 2023, location = "Global" }) {
  const [data, setData] = useState([])
  const [totalHectares, setTotalHectares] = useState(0)
  const [changePercent, setChangePercent] = useState(0)

  useEffect(() => {
    const deforestationData = generateDeforestationData(year, location)
    setData(deforestationData)

    // Calculate total hectares
    const total = deforestationData.reduce((sum, item) => sum + item.hectares, 0)
    setTotalHectares(total)

    // Calculate year-over-year change
    const lastYearData = generateDeforestationData(year - 1, location)
    const lastYearTotal = lastYearData.reduce((sum, item) => sum + item.hectares, 0)
    const percentChange = ((total - lastYearTotal) / lastYearTotal) * 100
    setChangePercent(percentChange)
  }, [year, location])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">{totalHectares.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Thousand hectares</div>
        </div>
        <Badge variant={changePercent < 0 ? "success" : "destructive"}>
          {changePercent > 0 ? "+" : ""}
          {changePercent.toFixed(1)}% from previous year
        </Badge>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="hectares"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

