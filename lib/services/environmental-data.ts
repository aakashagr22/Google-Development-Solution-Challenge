import { LocationResult } from "@/components/location-search"

interface EnvironmentalData {
  year: number
  month: number
  value: number
  unit: string
}

interface CarbonEmissionsData extends EnvironmentalData {
  type: "carbon"
  source: "transport" | "industry" | "energy" | "agriculture" | "waste"
}

interface DeforestationData extends EnvironmentalData {
  type: "deforestation"
  cause: "agriculture" | "logging" | "urbanization" | "mining" | "wildfire"
}

// Mock data for Indian cities
const mockCarbonData: Record<string, CarbonEmissionsData[]> = {
  "Delhi": [
    { year: 2023, month: 1, value: 12.5, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 2, value: 13.2, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 1, value: 8.7, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
    { year: 2023, month: 2, value: 9.1, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
  ],
  "Mumbai": [
    { year: 2023, month: 1, value: 11.8, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 2, value: 12.5, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 1, value: 7.9, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
    { year: 2023, month: 2, value: 8.3, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
  ],
  "Bangalore": [
    { year: 2023, month: 1, value: 10.2, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 2, value: 10.8, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 1, value: 6.5, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
    { year: 2023, month: 2, value: 6.9, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
  ],
  "Kanpur": [
    { year: 2023, month: 1, value: 9.5, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 2, value: 10.1, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 1, value: 5.8, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
    { year: 2023, month: 2, value: 6.2, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
  ],
  "Lucknow": [
    { year: 2023, month: 1, value: 8.9, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 2, value: 9.4, unit: "tons CO₂/capita", type: "carbon", source: "transport" },
    { year: 2023, month: 1, value: 5.2, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
    { year: 2023, month: 2, value: 5.6, unit: "tons CO₂/capita", type: "carbon", source: "industry" },
  ]
}

const mockDeforestationData: Record<string, DeforestationData[]> = {
  "Delhi": [
    { year: 2023, month: 1, value: 0.8, unit: "hectares", type: "deforestation", cause: "urbanization" },
    { year: 2023, month: 2, value: 1.2, unit: "hectares", type: "deforestation", cause: "urbanization" },
  ],
  "Mumbai": [
    { year: 2023, month: 1, value: 0.6, unit: "hectares", type: "deforestation", cause: "urbanization" },
    { year: 2023, month: 2, value: 0.9, unit: "hectares", type: "deforestation", cause: "urbanization" },
  ],
  "Bangalore": [
    { year: 2023, month: 1, value: 0.7, unit: "hectares", type: "deforestation", cause: "urbanization" },
    { year: 2023, month: 2, value: 1.0, unit: "hectares", type: "deforestation", cause: "urbanization" },
  ],
  "Kanpur": [
    { year: 2023, month: 1, value: 0.5, unit: "hectares", type: "deforestation", cause: "urbanization" },
    { year: 2023, month: 2, value: 0.8, unit: "hectares", type: "deforestation", cause: "urbanization" },
  ],
  "Lucknow": [
    { year: 2023, month: 1, value: 0.4, unit: "hectares", type: "deforestation", cause: "urbanization" },
    { year: 2023, month: 2, value: 0.7, unit: "hectares", type: "deforestation", cause: "urbanization" },
  ]
}

export async function getCarbonEmissionsData(
  location: LocationResult,
  year: number
): Promise<CarbonEmissionsData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real application, replace this with an actual API call
  // Example: const response = await fetch(`/api/carbon-emissions?location=${location.name}&year=${year}`)
  // return response.json()
  
  return mockCarbonData[location.name]?.filter(data => data.year === year) || []
}

export async function getDeforestationData(
  location: LocationResult,
  year: number
): Promise<DeforestationData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real application, replace this with an actual API call
  // Example: const response = await fetch(`/api/deforestation?location=${location.name}&year=${year}`)
  // return response.json()
  
  return mockDeforestationData[location.name]?.filter(data => data.year === year) || []
}

export async function getEnvironmentalData(
  location: LocationResult,
  year: number,
  type: "carbon" | "deforestation"
): Promise<EnvironmentalData[]> {
  if (type === "carbon") {
    return getCarbonEmissionsData(location, year)
  } else {
    return getDeforestationData(location, year)
  }
} 