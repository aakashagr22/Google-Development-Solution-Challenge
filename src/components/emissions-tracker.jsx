"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "./ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const generateEmissionsData = (year, location) => {
  const baseData = [
    { month: "Jan", emissions: 32 },
    { month: "Feb", emissions: 30 },
    { month: "Mar", emissions: 35 },
    { month: "Apr", emissions: 37 },
    { month: "May", emissions: 39 },
    { month: "Jun", emissions: 42 },
    { month: "Jul", emissions: 45 },
    { month: "Aug", emissions: 43 },
    { month: "Sep", emissions: 40 },
    { month: "Oct", emissions: 38 },
    { month: "Nov", emissions: 36 },
    { month: "Dec", emissions: 34 },
  ]

  // Adjust data based on year and location
  const yearFactor = (year - 1990) / 30 // Normalize year effect
  const locationMultiplier =
    location === "Global"
      ? 1
      : location === "North America"
        ? 0.8
        : location === "Europe"
          ? 0.7
          : location === "Asia"
            ? 1.2
            : 0.9

  return baseData.map((item) => ({
    ...item,
    emissions: Math.round(item.emissions * (1 + yearFactor * 0.5) * locationMultiplier),
  }))
}

export function EmissionsTracker({ year = 2023, location = "Global" }) {
  const [data, setData] = useState([])
  const [totalEmissions, setTotalEmissions] = useState(0)
  const [changePercent, setChangePercent] = useState(0)

  useEffect(() => {
    const emissionsData = generateEmissionsData(year, location)
    setData(emissionsData)

    // Calculate total emissions
    const total = emissionsData.reduce((sum, item) => sum + item.emissions, 0)
    setTotalEmissions(total)

    // Calculate year-over-year change
    const lastYearData = generateEmissionsData(year - 1, location)
    const lastYearTotal = lastYearData.reduce((sum, item) => sum + item.emissions, 0)
    const percentChange = ((total - lastYearTotal) / lastYearTotal) * 100
    setChangePercent(percentChange)
  }, [year, location])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">{totalEmissions.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Million metric tons</div>
        </div>
        <Badge variant={changePercent > 0 ? "destructive" : "success"}>
          {changePercent > 0 ? "+" : ""}
          {changePercent.toFixed(1)}% from previous year
        </Badge>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area type="monotone" dataKey="emissions" stroke="#ef4444" fillOpacity={1} fill="url(#colorEmissions)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

