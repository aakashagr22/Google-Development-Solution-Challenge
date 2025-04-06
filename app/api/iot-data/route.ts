import { NextResponse } from "next/server"

// Simulated IoT sensor data API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sensorType = searchParams.get("type")
  const location = searchParams.get("location")
  const timespan = searchParams.get("timespan") || "24h"

  // Generate sensor data based on parameters
  const data = generateSensorData(sensorType, location, timespan)

  return NextResponse.json({
    success: true,
    data,
    metadata: {
      source: "IoT Sensor Network - GreenTrack India",
      sensorType,
      location,
      timespan,
      timestamp: new Date().toISOString(),
      sensors: getLocationSensors(location),
    },
  })
}

function generateSensorData(sensorType: string | null, location: string | null, timespan: string) {
  // Generate time points based on timespan
  const dataPoints = getDataPoints(timespan)
  const values = []

  // Generate realistic data patterns based on sensor type and location
  for (let i = 0; i < dataPoints; i++) {
    let value

    if (sensorType === "aqi") {
      // AQI values are generally higher for Delhi, moderate for Mumbai, lower for Bangalore
      if (location === "delhi") {
        value = 200 + Math.random() * 150 - 50
      } else if (location === "mumbai") {
        value = 100 + Math.random() * 100 - 20
      } else if (location === "bangalore") {
        value = 50 + Math.random() * 70 - 10
      } else {
        value = 100 + Math.random() * 150 - 50
      }
    } else if (sensorType === "water") {
      // Water quality (0-100 scale)
      if (location === "delhi") {
        value = 40 + Math.random() * 30 - 10
      } else if (location === "mumbai") {
        value = 50 + Math.random() * 30 - 10
      } else {
        value = 60 + Math.random() * 30 - 10
      }
    } else if (sensorType === "temperature") {
      // Temperature patterns
      if (location === "delhi") {
        value = 30 + Math.random() * 10 - 5
      } else if (location === "mumbai") {
        value = 28 + Math.random() * 6 - 2
      } else if (location === "bangalore") {
        value = 24 + Math.random() * 8 - 4
      } else {
        value = 28 + Math.random() * 8 - 4
      }
    } else {
      // Default case - generic environmental data
      value = 50 + Math.random() * 50 - 25
    }

    // Time-based patterns
    const timestamp = new Date()
    timestamp.setHours(timestamp.getHours() - (dataPoints - i))

    values.push({
      value: Math.round(value * 10) / 10,
      timestamp: timestamp.toISOString(),
    })
  }

  return values
}

function getDataPoints(timespan: string): number {
  switch (timespan) {
    case "1h":
      return 60
    case "6h":
      return 72
    case "24h":
      return 24
    case "7d":
      return 168
    case "30d":
      return 30
    default:
      return 24
  }
}

function getLocationSensors(location: string | null): any {
  // Return info about sensors deployed in location
  switch (location?.toLowerCase()) {
    case "delhi":
      return {
        count: 187,
        types: ["AQI", "PM2.5", "PM10", "Temperature", "Humidity", "Water", "Noise"],
        coverage: "92% of city area",
        lastUpdated: new Date().toISOString(),
      }
    case "mumbai":
      return {
        count: 163,
        types: ["AQI", "PM2.5", "Temperature", "Humidity", "Water", "Noise"],
        coverage: "88% of city area",
        lastUpdated: new Date().toISOString(),
      }
    case "bangalore":
      return {
        count: 142,
        types: ["AQI", "PM2.5", "Temperature", "Humidity", "Water"],
        coverage: "85% of city area",
        lastUpdated: new Date().toISOString(),
      }
    default:
      return {
        count: 120,
        types: ["AQI", "PM2.5", "Temperature", "Humidity", "Water"],
        coverage: "80% of city area",
        lastUpdated: new Date().toISOString(),
      }
  }
}

