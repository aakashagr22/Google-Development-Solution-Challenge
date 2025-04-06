export interface SatelliteDataParams {
  lat: number
  lng: number
  type: "deforestation" | "carbon" | "urban" | "water"
  startDate?: string
  endDate?: string
  resolution?: string
}

export interface SatelliteImageData {
  url: string
  date: string
  source: string
  resolution: string
  type: string
  metadata?: Record<string, any>
}

export interface SatelliteAnalysisData {
  type: string
  value: number
  unit: string
  change: number
  changeUnit: string
  period: string
  source: string
}

// NASA GIBS API for satellite imagery
const NASA_GIBS_API = "https://gibs.earthdata.nasa.gov/wmts"

// Function to get NASA GIBS layer ID based on data type
function getGIBSLayer(type: string): string {
  switch (type) {
    case "deforestation":
      return "MODIS_Terra_NDVI_8Day"
    case "carbon":
      return "OMI_NO2_Column_Density_TropClim"
    case "urban":
      return "VIIRS_SNPP_DayNightBand_ENCC"
    case "water":
      return "MODIS_Terra_Chlorophyll_A"
    default:
      return "MODIS_Terra_CorrectedReflectance_TrueColor"
  }
}

// Get satellite imagery URL from NASA GIBS
export function getSatelliteImageryUrl(params: SatelliteDataParams): string {
  const layer = getGIBSLayer(params.type)
  const date = params.endDate || new Date().toISOString().split("T")[0]

  // This is a simplified URL construction
  // In a real app, you would use the proper WMTS request format
  return `${NASA_GIBS_API}/getTileService?layer=${layer}&date=${date}&format=image/jpeg&tilematrixset=GoogleMapsCompatible_Level9`
}

// Fetch satellite data for a specific location and type
export async function fetchSatelliteData(params: SatelliteDataParams): Promise<SatelliteAnalysisData[]> {
  // In a real app, this would be an API call to a service like Google Earth Engine
  // For this demo, we'll return mock data based on the parameters

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate mock data based on location and type
  return generateMockSatelliteData(params)
}

// Enhance the satellite data service to provide more realistic and location-specific data

// Improve the generateMockSatelliteData function to be more location-aware
function generateMockSatelliteData(params: SatelliteDataParams): SatelliteAnalysisData[] {
  const { lat, lng, type } = params

  // Use latitude to influence the data values (higher values near equator for deforestation)
  const latFactor = Math.abs(lat) < 23.5 ? 1.5 : Math.abs(lat) < 45 ? 1.0 : 0.5

  // Use longitude to add some variation
  const lngVariation = (((lng + 180) % 360) / 360) * 0.5 + 0.75

  // Location-specific factors based on known environmental hotspots
  let locationFactor = 1.0

  // Amazon rainforest region
  if (lat > -10 && lat < 5 && lng > -75 && lng < -45) {
    locationFactor = 2.0 // High deforestation
  }
  // Congo Basin
  else if (lat > -5 && lat < 5 && lng > 10 && lng < 30) {
    locationFactor = 1.8
  }
  // Southeast Asia (Indonesia, Malaysia)
  else if (lat > -10 && lat < 10 && lng > 95 && lng < 130) {
    locationFactor = 1.9
  }
  // North America
  else if (lat > 25 && lat < 50 && lng > -125 && lng < -65) {
    locationFactor = 0.7 // Lower deforestation, higher carbon emissions
  }
  // Europe
  else if (lat > 35 && lat < 70 && lng > -10 && lng < 40) {
    locationFactor = 0.5 // Lower deforestation, moderate carbon emissions
  }
  // China/India region
  else if (lat > 20 && lat < 40 && lng > 70 && lng < 130) {
    locationFactor = 1.3 // High carbon emissions, moderate deforestation
  }

  // Base data by type with enhanced location awareness
  switch (type) {
    case "deforestation":
      return [
        {
          type: "Forest Loss",
          value: Math.round(7.2 * latFactor * lngVariation * locationFactor * 10) / 10,
          unit: "% per year",
          change: Math.round(1.8 * latFactor * lngVariation * locationFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Global Forest Watch",
        },
        {
          type: "Tree Cover",
          value: Math.round(45 * (1 - (latFactor * lngVariation * locationFactor - 0.7) / 2)),
          unit: "%",
          change: Math.round(-3.5 * latFactor * lngVariation * locationFactor * 10) / 10,
          changeUnit: "% decrease",
          period: "2020-2023",
          source: "NASA MODIS",
        },
        {
          type: "Primary Forest Loss",
          value: Math.round(12000 * latFactor * lngVariation * locationFactor),
          unit: "hectares",
          change: Math.round(15 * latFactor * lngVariation * locationFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Hansen/UMD",
        },
        {
          type: "Biodiversity Impact",
          value: Math.round(65 * latFactor * lngVariation * locationFactor),
          unit: "species affected",
          change: Math.round(8.3 * latFactor * lngVariation * locationFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "IUCN Red List",
        },
      ]

    case "carbon":
      // Adjust carbon emissions based on location
      const industrialFactor = lat > 30 && lat < 60 ? 1.5 : 0.8 // Higher in industrial regions

      return [
        {
          type: "CO2 Emissions",
          value: Math.round(28.5 * latFactor * lngVariation * industrialFactor * 10) / 10,
          unit: "MtCO2e per year",
          change: Math.round(3.2 * latFactor * lngVariation * industrialFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Global Carbon Project",
        },
        {
          type: "Methane Concentration",
          value: Math.round(1850 + 120 * latFactor * lngVariation * industrialFactor),
          unit: "ppb",
          change: Math.round(2.1 * latFactor * lngVariation * industrialFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "NOAA",
        },
        {
          type: "NO2 Density",
          value: Math.round(15 * latFactor * lngVariation * industrialFactor * 100) / 100,
          unit: "1015 molecules/cm2",
          change: Math.round((latFactor > 1 ? -2.5 : 4.3) * lngVariation * industrialFactor * 10) / 10,
          changeUnit: `% ${latFactor > 1 ? "decrease" : "increase"}`,
          period: "2020-2023",
          source: "NASA OMI",
        },
        {
          type: "Carbon Intensity",
          value: Math.round(350 * latFactor * lngVariation * industrialFactor),
          unit: "gCO2/kWh",
          change: Math.round((industrialFactor > 1 ? -1.8 : 2.4) * lngVariation * 10) / 10,
          changeUnit: `% ${industrialFactor > 1 ? "decrease" : "increase"}`,
          period: "2020-2023",
          source: "IEA",
        },
      ]

    case "urban":
      // Adjust urban sprawl based on location
      const urbanFactor = Math.abs(lat) > 20 && Math.abs(lat) < 60 ? 1.4 : 0.9 // Higher in temperate regions

      return [
        {
          type: "Urban Expansion",
          value: Math.round(4.8 * latFactor * lngVariation * urbanFactor * 10) / 10,
          unit: "% per year",
          change: Math.round(0.7 * latFactor * lngVariation * urbanFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Global Human Settlement Layer",
        },
        {
          type: "Impervious Surface",
          value: Math.round(35 * latFactor * lngVariation * urbanFactor),
          unit: "%",
          change: Math.round(8.3 * latFactor * lngVariation * urbanFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Landsat Analysis",
        },
        {
          type: "Night Light Intensity",
          value: Math.round(65 * latFactor * lngVariation * urbanFactor),
          unit: "nW/cm2/sr",
          change: Math.round(12.5 * latFactor * lngVariation * urbanFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "VIIRS DNB",
        },
        {
          type: "Population Density",
          value: Math.round(2500 * latFactor * lngVariation * urbanFactor),
          unit: "people/km²",
          change: Math.round(3.2 * latFactor * lngVariation * urbanFactor * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "WorldPop",
        },
      ]

    case "water":
      // Add water quality data
      const waterFactor = Math.abs(lat) < 30 ? 0.7 : 1.2 // Lower quality in tropical regions

      return [
        {
          type: "Water Quality Index",
          value: Math.round(75 * waterFactor * lngVariation),
          unit: "WQI",
          change: Math.round(-2.8 * latFactor * lngVariation * 10) / 10,
          changeUnit: "% decrease",
          period: "2020-2023",
          source: "Global Water Quality Index",
        },
        {
          type: "Dissolved Oxygen",
          value: Math.round(8.2 * waterFactor * lngVariation * 10) / 10,
          unit: "mg/L",
          change: Math.round(-1.5 * latFactor * lngVariation * 10) / 10,
          changeUnit: "% decrease",
          period: "2020-2023",
          source: "Water Quality Monitoring Network",
        },
        {
          type: "pH Level",
          value: Math.round((7.2 + (waterFactor - 1) * 0.5) * 10) / 10,
          unit: "pH",
          change: Math.round(-0.3 * latFactor * lngVariation * 10) / 10,
          changeUnit: "% decrease",
          period: "2020-2023",
          source: "Environmental Protection Agency",
        },
        {
          type: "Turbidity",
          value: Math.round(12 * (2 - waterFactor) * lngVariation * 10) / 10,
          unit: "NTU",
          change: Math.round(4.7 * latFactor * lngVariation * 10) / 10,
          changeUnit: "% increase",
          period: "2020-2023",
          source: "Water Research Institute",
        },
      ]

    default:
      return []
  }
}

// Enhance the getSatelliteOverlay function to provide more realistic overlays
export function getSatelliteOverlay(map: any, params: SatelliteDataParams): any {
  if (!map || !window.google || !window.google.maps || !window.google.maps.Circle) {
    console.warn("Google Maps API not available for overlay creation")
    return null
  }

  try {
    const { lat, lng, type } = params

    // Create a more realistic overlay based on the data type
    // For a real app, this would use actual satellite imagery or data layers

    // Create a circle with gradient for better visualization
    const radius = 200000 // 200km radius

    let color, opacity
    switch (type) {
      case "deforestation":
        color = "#ff0000" // Red for deforestation
        opacity = 0.35
        break
      case "carbon":
        color = "#ffaa00" // Orange for carbon emissions
        opacity = 0.4
        break
      case "urban":
        color = "#0000ff" // Blue for urban sprawl
        opacity = 0.3
        break
      case "water":
        color = "#00aaff" // Light blue for water quality
        opacity = 0.45
        break
      default:
        color = "#00ff00" // Green default
        opacity = 0.3
    }

    // Create a circle overlay
    const circle = new window.google.maps.Circle({
      center: { lat, lng },
      radius: radius,
      fillColor: color,
      fillOpacity: opacity,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      map: map,
    })

    // Check if heatmap visualization is available
    if (window.google.maps.visualization && window.google.maps.visualization.HeatmapLayer) {
      // Add a heatmap layer for more detailed visualization
      const heatmapData = []

      // Generate some random points within the circle for the heatmap
      for (let i = 0; i < 100; i++) {
        // Random angle
        const angle = Math.random() * Math.PI * 2
        // Random radius (use square root to ensure even distribution)
        const randomRadius = Math.sqrt(Math.random()) * radius * 0.8

        // Convert to lat/lng
        const dlat = (randomRadius * Math.cos(angle)) / 111000 // 111km per degree of latitude
        const dlng = (randomRadius * Math.sin(angle)) / (111000 * Math.cos((lat * Math.PI) / 180))

        heatmapData.push({
          location: new window.google.maps.LatLng(lat + dlat, lng + dlng),
          weight: Math.random() * 5 + 5,
        })
      }

      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 30,
        opacity: 0.6,
      })

      // Return both overlays as a group
      return {
        circle,
        heatmap,
        // Method to remove both from the map
        setMap: function (map: any) {
          this.circle.setMap(map)
          this.heatmap.setMap(map)
        },
      }
    } else {
      // If heatmap visualization is not available, just return the circle
      return {
        circle,
        setMap: function (map: any) {
          this.circle.setMap(map)
        },
      }
    }
  } catch (error) {
    console.error("Error creating satellite overlay:", error)
    return null
  }
}

// Add a new function to get time-series data for charts
export async function fetchTimeSeriesData(params: SatelliteDataParams): Promise<any> {
  // In a real app, this would fetch from an API
  await new Promise((resolve) => setTimeout(resolve, 800))

  const { lat, lng, type } = params
  const years = [2018, 2019, 2020, 2021, 2022, 2023]

  // Location factors
  const latFactor = Math.abs(lat) < 23.5 ? 1.5 : Math.abs(lat) < 45 ? 1.0 : 0.5
  const lngVariation = (((lng + 180) % 360) / 360) * 0.5 + 0.75

  // Generate data based on type
  switch (type) {
    case "deforestation":
      return {
        title: "Forest Cover Change",
        unit: "% of land area",
        data: years.map((year, index) => ({
          year,
          value: Math.round((45 - index * 1.2 * latFactor * lngVariation) * 10) / 10,
        })),
      }

    case "carbon":
      return {
        title: "CO2 Emissions Trend",
        unit: "MtCO2e",
        data: years.map((year, index) => ({
          year,
          value: Math.round((20 + index * 1.8 * latFactor * lngVariation) * 10) / 10,
        })),
      }

    case "urban":
      return {
        title: "Urban Area Growth",
        unit: "km²",
        data: years.map((year, index) => ({
          year,
          value: Math.round(1200 + index * 85 * latFactor * lngVariation),
        })),
      }

    case "water":
      return {
        title: "Water Quality Index Trend",
        unit: "WQI",
        data: years.map((year, index) => ({
          year,
          value: Math.round((80 - index * 1.1 * latFactor * lngVariation) * 10) / 10,
        })),
      }

    default:
      return {
        title: "Environmental Change",
        unit: "index",
        data: [],
      }
  }
}

