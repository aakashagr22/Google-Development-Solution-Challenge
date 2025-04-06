"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data - in a real app, this would come from an API
const generateWaterData = (location, year) => {
  const sectors = ["Agriculture", "Industry", "Domestic"]

  // Base percentages for global 2023
  const basePercentages = {
    Agriculture: 70,
    Industry: 20,
    Domestic: 10,
  }

  // Adjust based on location
  const locationAdjustments = {
    Global: { Agriculture: 0, Industry: 0, Domestic: 0 },
    "North America": { Agriculture: -10, Industry: 5, Domestic: 5 },
    Europe: { Agriculture: -15, Industry: 10, Domestic: 5 },
    Asia: { Agriculture: 5, Industry: -5, Domestic: 0 },
    Africa: { Agriculture: 10, Industry: -8, Domestic: -2 },
    "South America": { Agriculture: 5, Industry: -3, Domestic: -2 },
    Australia: { Agriculture: 0, Industry: 0, Domestic: 0 },
  }

  // Adjust based on year (agriculture decreasing, industry and domestic increasing over time)
  const yearAdjustment = (2023 - year) / 33 // 33 years since 1990
  const yearAdjustments = {
    Agriculture: 10 * yearAdjustment,
    Industry: -5 * yearAdjustment,
    Domestic: -5 * yearAdjustment,
  }

  const locAdj = locationAdjustments[location] || locationAdjustments["Global"]

  return sectors.map((sector) => ({
    name: sector,
    percentage: Math.max(1, Math.min(100, basePercentages[sector] + locAdj[sector] + yearAdjustments[sector])),
  }))
}

export function WaterConsumption({ location = "Global", year = 2023 }) {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(generateWaterData(location, year))
  }, [location, year])

  return (
    <div className="space-y-4">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => [`${value.toFixed(1)}%`, "Percentage"]}
            />
            <Bar dataKey="percentage" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm">
        <p className="font-medium">Water Stress Level:</p>
        <p className="text-muted-foreground">
          {location === "Global"
            ? "Moderate"
            : location === "North America"
              ? "Low to Moderate"
              : location === "Europe"
                ? "Low to Moderate"
                : location === "Asia"
                  ? "High"
                  : location === "Africa"
                    ? "Extremely High"
                    : location === "South America"
                      ? "Low"
                      : location === "Australia"
                        ? "High"
                        : "Moderate"}
        </p>
      </div>
    </div>
  )
}

