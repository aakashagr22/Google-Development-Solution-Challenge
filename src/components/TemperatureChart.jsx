"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "./ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const generateTemperatureData = (year, location) => {
  // Base temperature anomalies for 2023
  const baseData = [
    { year: 1880, anomaly: -0.16 },
    { year: 1900, anomaly: -0.08 },
    { year: 1920, anomaly: -0.05 },
    { year: 1940, anomaly: 0.12 },
    { year: 1960, anomaly: 0.03 },
    { year: 1980, anomaly: 0.28 },
    { year: 2000, anomaly: 0.51 },
    { year: 2020, anomaly: 0.98 },
    { year: 2023, anomaly: 1.18 },
  ]

  // Filter data up to the selected year
  const filteredData = baseData.filter((item) => item.year <= year)

  // Adjust based on location
  const locationFactor =
    location === "Global"
      ? 1
      : location === "Arctic"
        ? 2.5
        : location === "Europe"
          ? 1.5
          : location === "North America"
            ? 1.3
            : 0.9

  return filteredData.map((item) => ({
    ...item,
    anomaly: Number.parseFloat((item.anomaly * locationFactor).toFixed(2)),
  }))
}

export function TemperatureChart({ year = 2023, location = "Global" }) {
  const [data, setData] = useState([])
  const [currentAnomaly, setCurrentAnomaly] = useState(0)

  useEffect(() => {
    const temperatureData = generateTemperatureData(year, location)
    setData(temperatureData)

    // Get the most recent anomaly
    if (temperatureData.length > 0) {
      setCurrentAnomaly(temperatureData[temperatureData.length - 1].anomaly)
    }
  }, [year, location])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">
            {currentAnomaly > 0 ? "+" : ""}
            {currentAnomaly.toFixed(2)}°C
          </div>
          <div className="text-sm text-muted-foreground">Temperature anomaly from pre-industrial levels</div>
        </div>
        <Badge
          variant={
            currentAnomaly < 0.5
              ? "outline"
              : currentAnomaly < 1.0
                ? "default"
                : currentAnomaly < 1.5
                  ? "destructive"
                  : "destructive"
          }
        >
          {currentAnomaly < 0.5
            ? "Low Impact"
            : currentAnomaly < 1.0
              ? "Moderate Impact"
              : currentAnomaly < 1.5
                ? "High Impact"
                : "Severe Impact"}
        </Badge>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAnomaly" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="year" />
            <YAxis domain={[-0.5, 2]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                borderColor: "var(--border)",
                borderRadius: "0.5rem",
              }}
              formatter={(value) => [`${value > 0 ? "+" : ""}${value}°C`, "Temperature Anomaly"]}
            />
            <Area type="monotone" dataKey="anomaly" stroke="#ef4444" fillOpacity={1} fill="url(#colorAnomaly)" />
            {/* Paris Agreement target line */}
            <Area
              type="monotone"
              dataKey="parisTarget"
              stroke="#0ea5e9"
              strokeDasharray="5 5"
              strokeWidth={2}
              fillOpacity={0}
              data={[
                { year: 1880, parisTarget: 1.5 },
                { year: 2023, parisTarget: 1.5 },
              ]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 border rounded-lg bg-muted/50">
        <h4 className="font-semibold mb-2">Temperature Thresholds</h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm">1.5°C - Paris Agreement target threshold</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-sm">2.0°C - Severe climate impacts threshold</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">3.0°C - Catastrophic and irreversible changes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

