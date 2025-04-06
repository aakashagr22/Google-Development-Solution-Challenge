import type { DataType } from "@/components/dashboard/dashboard-context"
import type { LocationResult } from "@/components/location-search"
import type { AQIData } from "@/components/dashboard/dashboard-context"

export interface EnvironmentalData {
  id: string
  type: DataType
  year: number
  value: number
  trend: "increasing" | "decreasing" | "stable"
  percentChange: number
  unit: string
  description: string
}

export interface LocationEnvironmentalData {
  location: LocationResult
  data: EnvironmentalData[]
}

// Generate mock data for a specific location and year
export function getEnvironmentalData(
  location: LocationResult,
  year: number,
  dataTypes: DataType[],
): EnvironmentalData[] {
  const result: EnvironmentalData[] = []

  // Generate data for each requested data type
  dataTypes.forEach((type) => {
    result.push(generateDataForType(location, type, year))
  })

  return result
}

// Calculate trees needed to offset carbon emissions
export function calculateTreesNeeded(location: LocationResult, year: number): number {
  // Get carbon emissions data
  const carbonData = generateDataForType(location, "carbon", year)

  // Base calculation: 1 mature tree absorbs about 22 kg of CO2 per year
  // Carbon emissions are in tons CO2/capita, so we need to convert

  // Get estimated population based on location type
  let population = 0
  if (location.type === "city") {
    // Estimate city population based on name
    switch (location.name) {
      case "Mumbai":
        population = 20000000
        break
      case "Delhi":
        population = 19000000
        break
      case "Bangalore":
        population = 12000000
        break
      case "Hyderabad":
        population = 10000000
        break
      case "Chennai":
        population = 9000000
        break
      case "Kolkata":
        population = 14500000
        break
      default:
        // Default population based on location type
        population = 1000000 // Default city population
    }
  } else if (location.type === "state") {
    // Estimate state population
    switch (location.name) {
      case "Uttar Pradesh":
        population = 200000000
        break
      case "Maharashtra":
        population = 120000000
        break
      case "Bihar":
        population = 100000000
        break
      case "West Bengal":
        population = 90000000
        break
      case "Tamil Nadu":
        population = 70000000
        break
      default:
        population = 50000000 // Default state population
    }
  } else if (location.type === "district") {
    population = 2000000 // Average district population
  } else {
    population = 500000 // Default for regions
  }

  // Total carbon emissions in tons
  const totalEmissions = carbonData.value * population

  // Convert tons to kg (1 ton = 1000 kg)
  const emissionsInKg = totalEmissions * 1000

  // Calculate trees needed (1 tree absorbs ~22kg CO2 per year)
  const treesNeeded = Math.round(emissionsInKg / 22)

  return treesNeeded
}

// Get AQI data for a location
export function getAQIData(location: LocationResult): AQIData {
  // Base AQI value depends on location type and name
  let baseAQI = 0

  // Set base AQI based on location
  if (location.type === "city") {
    switch (location.name) {
      case "Delhi":
        baseAQI = 250 + Math.random() * 100
        break
      case "Mumbai":
        baseAQI = 150 + Math.random() * 80
        break
      case "Kolkata":
        baseAQI = 180 + Math.random() * 70
        break
      case "Chennai":
        baseAQI = 100 + Math.random() * 50
        break
      case "Bangalore":
        baseAQI = 90 + Math.random() * 40
        break
      case "Hyderabad":
        baseAQI = 110 + Math.random() * 60
        break
      default:
        baseAQI = 120 + Math.random() * 80
    }
  } else if (location.type === "state") {
    switch (location.name) {
      case "Delhi":
        baseAQI = 220 + Math.random() * 80
        break
      case "Uttar Pradesh":
        baseAQI = 180 + Math.random() * 70
        break
      case "Maharashtra":
        baseAQI = 140 + Math.random() * 60
        break
      case "West Bengal":
        baseAQI = 160 + Math.random() * 50
        break
      case "Tamil Nadu":
        baseAQI = 100 + Math.random() * 40
        break
      case "Karnataka":
        baseAQI = 90 + Math.random() * 30
        break
      default:
        baseAQI = 110 + Math.random() * 50
    }
  } else {
    baseAQI = 80 + Math.random() * 40 // Lower for regions/districts
  }

  // Round to nearest integer
  const aqi = Math.round(baseAQI)

  // Determine AQI category, color, and health implications
  let category, color, healthImplications, cautionaryStatement

  if (aqi <= 50) {
    category = "Good"
    color = "bg-green-500 text-white"
    healthImplications = "Air quality is considered satisfactory, and air pollution poses little or no risk."
    cautionaryStatement = "None"
  } else if (aqi <= 100) {
    category = "Moderate"
    color = "bg-yellow-500 text-black"
    healthImplications =
      "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people."
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
  } else if (aqi <= 200) {
    category = "Poor"
    color = "bg-orange-500 text-white"
    healthImplications =
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion."
  } else if (aqi <= 300) {
    category = "Very Poor"
    color = "bg-red-500 text-white"
    healthImplications =
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    cautionaryStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion."
  } else {
    category = "Severe"
    color = "bg-purple-700 text-white"
    healthImplications = "Health warnings of emergency conditions. The entire population is more likely to be affected."
    cautionaryStatement = "Everyone should avoid all outdoor exertion."
  }

  // Generate pollutant data
  const pm25 = Math.round(aqi / 2 + Math.random() * 20)
  const pm10 = Math.round(pm25 * 1.5 + Math.random() * 30)
  const o3 = Math.round(30 + Math.random() * 50)
  const no2 = Math.round(20 + Math.random() * 40)
  const so2 = Math.round(10 + Math.random() * 30)
  const co = Math.round(0.5 + Math.random() * 1.5 * 10) / 10

  return {
    value: aqi,
    category,
    color,
    pollutants: {
      pm25,
      pm10,
      o3,
      no2,
      so2,
      co,
    },
    healthImplications,
    cautionaryStatement,
  }
}

// Generate data for a specific type, location, and year
function generateDataForType(location: LocationResult, type: DataType, year: number): EnvironmentalData {
  // Base values for different location types
  const baseValues = {
    deforestation: {
      city: 15 + Math.random() * 10,
      state: 25 + Math.random() * 15,
      district: 20 + Math.random() * 12,
      region: 35 + Math.random() * 20,
    },
    carbon: {
      city: 80 + Math.random() * 40,
      state: 60 + Math.random() * 30,
      district: 70 + Math.random() * 35,
      region: 40 + Math.random() * 20,
    },
    urban: {
      city: 65 + Math.random() * 25,
      state: 45 + Math.random() * 20,
      district: 55 + Math.random() * 22,
      region: 25 + Math.random() * 15,
    },
    water: {
      city: 50 + Math.random() * 30,
      state: 60 + Math.random() * 25,
      district: 55 + Math.random() * 28,
      region: 70 + Math.random() * 20,
    },
  }

  // Location-specific adjustments
  const locationFactors: Record<string, number> = {
    Delhi: type === "carbon" || type === "urban" ? 1.5 : 0.8,
    Mumbai: type === "urban" ? 1.4 : type === "water" ? 0.7 : 1.1,
    Bangalore: type === "urban" ? 1.3 : type === "deforestation" ? 0.6 : 1.0,
    Chennai: type === "water" ? 0.6 : 1.0,
    Kolkata: type === "water" ? 1.2 : type === "urban" ? 1.3 : 1.0,
    "Western Ghats": type === "deforestation" ? 1.8 : type === "water" ? 1.4 : 0.9,
    "Thar Desert": type === "water" ? 0.3 : type === "deforestation" ? 0.2 : 1.1,
    Sundarbans: type === "deforestation" ? 1.6 : type === "water" ? 1.5 : 0.8,
  }

  // Year factor (slight increase or decrease based on year)
  const yearFactor = 1 + (year - 2020) * 0.03

  // Get base value for location type
  let baseValue = baseValues[type][location.type]

  // Apply location-specific factor if available
  const locationFactor = locationFactors[location.name] || 1.0
  baseValue *= locationFactor

  // Apply year factor
  baseValue *= yearFactor

  // Determine trend
  const trendRandom = Math.random()
  let trend: "increasing" | "decreasing" | "stable"
  let percentChange: number

  if (trendRandom < 0.4) {
    trend = "increasing"
    percentChange = 2 + Math.random() * 8
  } else if (trendRandom < 0.8) {
    trend = "decreasing"
    percentChange = -(2 + Math.random() * 8)
  } else {
    trend = "stable"
    percentChange = Math.random() * 2 - 1
  }

  // Units and descriptions for each data type
  const units: Record<DataType, string> = {
    deforestation: "% forest loss",
    carbon: "tons CO₂/capita",
    urban: "% urban area",
    water: "quality index",
  }

  const descriptions: Record<DataType, string> = {
    deforestation: `Forest cover loss in ${location.name} for ${year}`,
    carbon: `Carbon emissions per capita in ${location.name} for ${year}`,
    urban: `Urban area percentage in ${location.name} for ${year}`,
    water: `Water quality index in ${location.name} for ${year} (higher is better)`,
  }

  return {
    id: `${type}-${location.name}-${year}`,
    type,
    year,
    value: Math.round(baseValue * 10) / 10,
    trend,
    percentChange: Math.round(percentChange * 10) / 10,
    unit: units[type],
    description: descriptions[type],
  }
}

// Get monthly data for a specific location, year and data type
export function getMonthlyData(location: LocationResult, year: number, type: DataType) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Base value from the annual data
  const annualData = generateDataForType(location, type, year)
  const baseValue = annualData.value

  // Generate monthly variations
  return months.map((month, index) => {
    // Add seasonal variations
    let seasonalFactor = 1.0

    if (type === "deforestation") {
      // Higher deforestation in dry months
      seasonalFactor = index >= 2 && index <= 5 ? 1.2 : 0.9
    } else if (type === "carbon") {
      // Higher emissions in winter months
      seasonalFactor = index <= 1 || index >= 10 ? 1.3 : 0.9
    } else if (type === "urban") {
      // Urban growth is more steady
      seasonalFactor = 1.0 + (Math.random() * 0.1 - 0.05)
    } else if (type === "water") {
      // Water quality worse in summer/monsoon
      seasonalFactor = index >= 5 && index <= 8 ? 0.8 : 1.1
    }

    const value = baseValue * seasonalFactor * (0.9 + Math.random() * 0.2)

    return {
      month,
      value: Math.round(value * 10) / 10,
    }
  })
}

// Get historical data for deforestation reports
export function getHistoricalDeforestationData(location: LocationResult, startYear: number, endYear: number) {
  const years = []
  const data = []

  for (let year = startYear; year <= endYear; year++) {
    years.push(year)
    const yearData = generateDataForType(location, "deforestation", year)
    data.push({
      year,
      value: yearData.value,
      trend: yearData.trend,
      percentChange: yearData.percentChange,
    })
  }

  return {
    location: location.name,
    state: location.state || "",
    type: location.type,
    years,
    data,
  }
}

// Get news and alerts for a location
export function getNewsAndAlerts(location: LocationResult) {
  // Generate location-specific news and alerts
  const alerts = []
  const news = []

  // Generate alerts based on location
  if (location.name === "Delhi" || location.name === "NCR") {
    alerts.push({
      id: "a1",
      title: "Severe Air Pollution Alert",
      description:
        "AQI levels have reached 'severe' category. Avoid outdoor activities and wear masks when going outside.",
      severity: "high",
      date: "Today",
    })
  }

  if (location.name === "Mumbai" || location.state === "Maharashtra") {
    alerts.push({
      id: "a2",
      title: "Heavy Rainfall Warning",
      description: "IMD has issued heavy rainfall warning for coastal Maharashtra. Prepare for potential flooding.",
      severity: "medium",
      date: "Tomorrow",
    })
  }

  if (location.name === "Western Ghats" || location.name.includes("Ghats")) {
    alerts.push({
      id: "a3",
      title: "Landslide Risk Alert",
      description:
        "Recent deforestation has increased landslide risk in several areas. Avoid travel on mountain roads during heavy rain.",
      severity: "high",
      date: "Ongoing",
    })
  }

  // Generate news based on location
  if (location.type === "city") {
    news.push({
      id: "n1",
      title: `New Urban Forest Initiative in ${location.name}`,
      description: `Local government announces plan to plant 10,000 trees across ${location.name} to combat urban heat island effect.`,
      source: "Urban Development Authority",
      date: "2 days ago",
    })
  }

  if (location.type === "state") {
    news.push({
      id: "n2",
      title: `${location.name} Implements New Emission Standards`,
      description: `State government of ${location.name} has implemented stricter emission standards for industries to improve air quality.`,
      source: "State Pollution Control Board",
      date: "1 week ago",
    })
  }

  // Add some generic news and alerts
  news.push({
    id: "n3",
    title: "India Commits to Net Zero Emissions by 2070",
    description:
      "Prime Minister announces ambitious climate goals at international summit, including increasing non-fossil fuel energy capacity to 500 GW by 2030.",
    source: "Ministry of Environment",
    date: "3 weeks ago",
  })

  alerts.push({
    id: "a4",
    title: "Heat Wave Advisory",
    description:
      "Temperatures expected to rise 4-5°C above normal in the coming week. Stay hydrated and avoid outdoor activities during peak hours.",
    severity: "medium",
    date: "This week",
  })

  return {
    alerts,
    news,
  }
}

// Get recommendations based on environmental data
export function getRecommendations(location: LocationResult, environmentalData: EnvironmentalData[]) {
  const recommendations = []

  // Check deforestation data
  const deforestationData = environmentalData.find((data) => data.type === "deforestation")
  if (deforestationData && deforestationData.trend === "increasing") {
    recommendations.push({
      id: "r1",
      title: "Increase Afforestation Efforts",
      description: `${location.name} is experiencing increasing deforestation rates. Implement community tree planting programs and stricter logging regulations.`,
      priority: "high",
      impact: "Reduce forest loss by up to 30% within 2 years",
    })
  }

  // Check carbon emissions data
  const carbonData = environmentalData.find((data) => data.type === "carbon")
  if (carbonData && carbonData.value > 50) {
    recommendations.push({
      id: "r2",
      title: "Reduce Carbon Footprint",
      description: `High carbon emissions detected in ${location.name}. Promote public transportation, renewable energy adoption, and energy-efficient buildings.`,
      priority: "high",
      impact: "Potential 20% reduction in emissions within 5 years",
    })
  }

  // Check urban sprawl data
  const urbanData = environmentalData.find((data) => data.type === "urban")
  if (urbanData && urbanData.trend === "increasing" && urbanData.percentChange > 5) {
    recommendations.push({
      id: "r3",
      title: "Sustainable Urban Planning",
      description: `Rapid urban expansion detected in ${location.name}. Implement green building codes, develop urban forests, and create more pedestrian-friendly infrastructure.`,
      priority: "medium",
      impact: "Improve urban livability index by 15 points",
    })
  }

  // Check water quality data
  const waterData = environmentalData.find((data) => data.type === "water")
  if (waterData && waterData.value < 60) {
    recommendations.push({
      id: "r4",
      title: "Water Quality Improvement",
      description: `Poor water quality detected in ${location.name}. Strengthen industrial effluent regulations, upgrade sewage treatment facilities, and implement rainwater harvesting.`,
      priority: "high",
      impact: "Improve water quality index by 25% within 3 years",
    })
  }

  // Add general recommendation
  recommendations.push({
    id: "r5",
    title: "Environmental Education Programs",
    description: `Implement comprehensive environmental education programs in schools and communities across ${location.name} to raise awareness about local environmental challenges.`,
    priority: "medium",
    impact: "Long-term behavioral change and community engagement",
  })

  return recommendations
}

