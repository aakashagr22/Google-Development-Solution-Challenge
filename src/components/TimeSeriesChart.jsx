"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Sample data - in a real app, this would come from an API
const generateTimeSeriesData = (type, year) => {
  // Generate 10 years of data up to the selected year
  const startYear = Math.max(1990, year - 9)
  const years = Array.from({ length: year - startYear + 1 }, (_, i) => startYear + i)

  if (type === "emissions") {
    // CO2 emissions in gigatons
    const baseValue = 25
    const yearlyIncrease = 0.5
    return years.map((y) => ({
      year: y,
      value: Number.parseFloat((baseValue + (y - 1990) * yearlyIncrease).toFixed(1)),
    }))
  } else if (type === "deforestation") {
    // Deforestation in million hectares
    const baseValue = 16
    const yearlyDecrease = 0.2
    return years.map((y) => ({
      year: y,
      value: Number.parseFloat(Math.max(5, baseValue - (y - 1990) * yearlyDecrease).toFixed(1)),
    }))
  } else if (type === "temperature") {
    // Temperature anomaly in degrees C
    const baseValue = 0.3
    const yearlyIncrease = 0.02
    return years.map((y) => ({
      year: y,
      value: Number.parseFloat((baseValue + (y - 1990) * yearlyIncrease).toFixed(2)),
    }))
  } else if (type === "disasters") {
    // Number of climate-related disasters
    const baseValue = 400
    const yearlyIncrease = 5
    return years.map((y) => ({
      year: y,
      value: Math.round(baseValue + (y - 1990) * yearlyIncrease),
    }))
  }

  return []
}

export function TimeSeriesChart({ type = "emissions", year = 2023 }) {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateTimeSeriesData(type, year))
  }, [type, year])

  const getChartConfig = () => {
    const configs = {
      emissions: {
        label: "CO₂ Emissions",
        unit: "Gt",
        color: "#ef4444",
        description: "Annual global carbon dioxide emissions in gigatons",
      },
      deforestation: {
        label: "Forest Loss",
        unit: "Mha",
        color: "#22c55e",
        description: "Annual global forest area loss in million hectares",
      },
      temperature: {
        label: "Temperature Anomaly",
        unit: "°C",
        color: "#f59e0b",
        description: "Global temperature anomaly relative to pre-industrial levels",
      },
      disasters: {
        label: "Climate Disasters",
        unit: "events",
        color: "#8b5cf6",
        description: "Number of recorded climate-related disaster events globally",
      },
    }

    return configs[type] || configs.emissions
  }

  const config = getChartConfig()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">{config.label} Trend</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => [`${value} ${config.unit}`, config.label]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={config.label}
              stroke={config.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

