"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, AlertTriangle, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AirQualityForecast() {
  const [forecastPeriod, setForecastPeriod] = useState("3days")

  // Mock forecast data for Delhi NCR
  const forecastData = {
    "3days": [
      { day: "Today", aqi: 285, probability: 95, trend: "rising", risk: "high", alert: true },
      { day: "Tomorrow", aqi: 320, probability: 90, trend: "rising", risk: "very-high", alert: true },
      { day: "Day 3", aqi: 310, probability: 85, trend: "stable", risk: "very-high", alert: true },
    ],
    "7days": [
      { day: "Today", aqi: 285, probability: 95, trend: "rising", risk: "high", alert: true },
      { day: "Tomorrow", aqi: 320, probability: 90, trend: "rising", risk: "very-high", alert: true },
      { day: "Day 3", aqi: 310, probability: 85, trend: "stable", risk: "very-high", alert: true },
      { day: "Day 4", aqi: 290, probability: 80, trend: "falling", risk: "high", alert: true },
      { day: "Day 5", aqi: 260, probability: 75, trend: "falling", risk: "high", alert: true },
      { day: "Day 6", aqi: 230, probability: 70, trend: "falling", risk: "high", alert: false },
      { day: "Day 7", aqi: 210, probability: 65, trend: "stable", risk: "high", alert: false },
    ],
    "14days": [
      { day: "Week 1 Avg", aqi: 290, probability: 85, trend: "rising", risk: "high", alert: true },
      { day: "Week 2 Avg", aqi: 240, probability: 70, trend: "falling", risk: "high", alert: false },
    ],
  }

  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return { label: "Good", color: "bg-green-500 text-white" }
    if (aqi <= 100) return { label: "Moderate", color: "bg-yellow-500 text-black" }
    if (aqi <= 200) return { label: "Poor", color: "bg-orange-500 text-white" }
    if (aqi <= 300) return { label: "Very Poor", color: "bg-red-500 text-white" }
    return { label: "Severe", color: "bg-purple-700 text-white" }
  }

  const getRecommendation = (risk: string) => {
    switch (risk) {
      case "very-high":
        return "Avoid outdoor activities. Use air purifiers at home. Wear N95 masks if going out is necessary."
      case "high":
        return "Limit outdoor physical exertion. Keep windows closed. Senior citizens and children should stay indoors."
      case "moderate":
        return "Consider reducing prolonged outdoor activities, especially if you experience symptoms."
      default:
        return "Air quality is acceptable, but unusually sensitive people should consider limiting prolonged outdoor exposure."
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">AQI Prediction for Delhi NCR</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Predictions utilize machine learning models trained on 5 years of historical data, combined with
                  weather forecasts and seasonal patterns.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={forecastPeriod} onValueChange={setForecastPeriod} className="mb-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="3days">3 Days</TabsTrigger>
            <TabsTrigger value="7days">7 Days</TabsTrigger>
            <TabsTrigger value="14days">14 Days</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {forecastData[forecastPeriod as keyof typeof forecastData].map((day, index) => {
            const aqiCategory = getAqiCategory(day.aqi)
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${aqiCategory.color}`}
                  >
                    {day.aqi}
                  </div>
                  <div>
                    <div className="font-medium">{day.day}</div>
                    <div className="text-sm text-muted-foreground">{aqiCategory.label}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Badge variant={day.alert ? "destructive" : "outline"} className="mr-2">
                    {day.probability}% Confidence
                  </Badge>
                  {day.alert && <AlertTriangle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 bg-muted/40 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Recommendation</h4>
          <p className="text-sm">
            {getRecommendation(forecastData[forecastPeriod as keyof typeof forecastData][0].risk)}
          </p>

          {forecastData[forecastPeriod as keyof typeof forecastData][0].alert && (
            <div className="mt-4 flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <p>AQI likely to cross unhealthy threshold. Vulnerable groups should take extra precautions.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <p>Last updated: Today, 10:30 AM</p>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            View Detailed Forecast
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

