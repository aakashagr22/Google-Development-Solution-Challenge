"use client"

import { useState, useEffect } from "react"
import { Badge } from "./ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const getAQIData = (location) => {
  const baseAQI = 65
  const locationAdjustment = {
    Global: 0,
    "North America": -15,
    Europe: -10,
    Asia: 30,
    Africa: 20,
    "South America": 5,
    Australia: -20,
  }

  const adjustment = locationAdjustment[location] || 0
  const aqi = baseAQI + adjustment

  let category, color
  if (aqi <= 50) {
    category = "Good"
    color = "bg-green-500"
  } else if (aqi <= 100) {
    category = "Moderate"
    color = "bg-yellow-500"
  } else if (aqi <= 150) {
    category = "Unhealthy for Sensitive Groups"
    color = "bg-orange-500"
  } else if (aqi <= 200) {
    category = "Unhealthy"
    color = "bg-red-500"
  } else if (aqi <= 300) {
    category = "Very Unhealthy"
    color = "bg-purple-500"
  } else {
    category = "Hazardous"
    color = "bg-rose-900"
  }

  return { aqi, category, color }
}

export function AQIDisplay({ location = "Global" }) {
  const [aqiData, setAqiData] = useState({ aqi: 0, category: "", color: "" })

  useEffect(() => {
    setAqiData(getAQIData(location))
  }, [location])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-2xl font-bold">{aqiData.aqi}</div>
          <div className="text-sm text-muted-foreground">AQI Value</div>
        </div>
        <Badge variant="outline" className={`${aqiData.color.replace("bg-", "border-")} bg-opacity-20`}>
          {aqiData.category}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>0</span>
          <span>500</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 via-red-500 via-purple-500 to-rose-900">
          <div
            className="h-4 w-1 bg-foreground rounded-full relative -top-0.5"
            style={{ marginLeft: `${Math.min(100, (aqiData.aqi / 500) * 100)}%` }}
          />
        </div>
        <div className="grid grid-cols-6 text-xs text-muted-foreground">
          <div>Good</div>
          <div>Moderate</div>
          <div className="text-center">Unhealthy for Sensitive</div>
          <div className="text-center">Unhealthy</div>
          <div className="text-center">Very Unhealthy</div>
          <div className="text-right">Hazardous</div>
        </div>
      </div>

      <div className="text-sm">
        <p className="font-medium">Health Implications:</p>
        {aqiData.aqi <= 50 && (
          <p className="text-muted-foreground">
            Air quality is considered satisfactory, and air pollution poses little or no risk.
          </p>
        )}
        {aqiData.aqi > 50 && aqiData.aqi <= 100 && (
          <p className="text-muted-foreground">
            Air quality is acceptable; however, there may be a moderate health concern for a very small number of
            people.
          </p>
        )}
        {aqiData.aqi > 100 && aqiData.aqi <= 150 && (
          <p className="text-muted-foreground">
            Members of sensitive groups may experience health effects. The general public is not likely to be affected.
          </p>
        )}
        {aqiData.aqi > 150 && aqiData.aqi <= 200 && (
          <p className="text-muted-foreground">
            Everyone may begin to experience health effects; members of sensitive groups may experience more serious
            health effects.
          </p>
        )}
        {aqiData.aqi > 200 && aqiData.aqi <= 300 && (
          <p className="text-muted-foreground">
            Health warnings of emergency conditions. The entire population is more likely to be affected.
          </p>
        )}
        {aqiData.aqi > 300 && (
          <p className="text-muted-foreground">Health alert: everyone may experience more serious health effects.</p>
        )}
      </div>
    </div>
  )
}

