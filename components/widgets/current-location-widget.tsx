"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wind, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CurrentLocationWidget() {
  const [locationName, setLocationName] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true)
      try {
        // Skip geolocation attempt and use default location directly
        await fetchLocationData(28.6139, 77.209) // Delhi coordinates
      } catch (error) {
        console.error("Error setting up location data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
    // Empty dependency array ensures this only runs once
  }, [])

  const fetchLocationData = async (latitude: number, longitude: number) => {
    // In a real app, this would call an API to get location data
    // For now, we'll simulate with mock data

    // Mock reverse geocoding
    let location = "Delhi, India"

    // For demo purposes, use different data based on latitude
    if (latitude > 27 && latitude < 29 && longitude > 76 && longitude < 78) {
      location = "Delhi, India"
    } else if (latitude > 18 && latitude < 20 && longitude > 72 && longitude < 73) {
      location = "Mumbai, India"
    } else if (latitude > 12 && latitude < 13 && longitude > 77 && longitude < 78) {
      location = "Bangalore, India"
    }

    setLocationName(location)

    // Mock environmental data
    const mockData = {
      "Delhi, India": {
        aqi: 327,
        temperature: 38,
        humidity: 65,
        windSpeed: 12,
        alerts: [{ type: "pollution", message: "Very Poor Air Quality - wear masks outdoors" }],
      },
      "Mumbai, India": {
        aqi: 153,
        temperature: 32,
        humidity: 80,
        windSpeed: 15,
        alerts: [{ type: "rainfall", message: "Heavy rainfall expected in the next 24 hours" }],
      },
      "Bangalore, India": {
        aqi: 95,
        temperature: 28,
        humidity: 68,
        windSpeed: 8,
        alerts: [],
      },
    }

    // Set location data or default to Delhi
    setLocationData(mockData[location as keyof typeof mockData] || mockData["Delhi, India"])
  }

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "bg-green-500 text-white"
    if (aqi <= 100) return "bg-yellow-500 text-black"
    if (aqi <= 200) return "bg-orange-500 text-white"
    if (aqi <= 300) return "bg-red-500 text-white"
    return "bg-purple-700 text-white"
  }

  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 200) return "Poor"
    if (aqi <= 300) return "Very Poor"
    return "Severe"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-16 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="rounded-full bg-muted h-10 w-10"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-muted rounded"></div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-2 bg-muted rounded col-span-1"></div>
                  <div className="h-2 bg-muted rounded col-span-1"></div>
                  <div className="h-2 bg-muted rounded col-span-1"></div>
                  <div className="h-2 bg-muted rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">{locationName || "Delhi, India"}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Default location</span>
                <select
                  className="text-xs bg-transparent border-none cursor-pointer text-primary hover:underline focus:outline-none focus:ring-0"
                  onChange={(e) => {
                    const [lat, lng] = e.target.value.split(",").map(Number)
                    fetchLocationData(lat, lng)
                  }}
                >
                  <option value="">Change location</option>
                  <option value="28.6139,77.209">Delhi</option>
                  <option value="19.076,72.8777">Mumbai</option>
                  <option value="12.9716,77.5946">Bangalore</option>
                  <option value="13.0827,80.2707">Chennai</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {locationData && (
              <>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${getAqiColor(locationData.aqi)}`}
                  >
                    {locationData.aqi}
                  </div>
                  <div>
                    <div className="text-sm font-medium">AQI</div>
                    <div className="text-xs text-muted-foreground">{getAqiCategory(locationData.aqi)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-sm font-medium">{locationData.temperature}°C</div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">{locationData.humidity}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-cyan-500" />
                  <div>
                    <div className="text-sm font-medium">{locationData.windSpeed} km/h</div>
                    <div className="text-xs text-muted-foreground">Wind</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {locationData && locationData.alerts && locationData.alerts.length > 0 && (
            <div className="w-full mt-2 flex gap-2 items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="text-sm">
                {locationData.alerts.map((alert: any, index: number) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {alert.message}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

