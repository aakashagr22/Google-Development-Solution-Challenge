"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Layers, Maximize2, Minimize2, Download, AlertTriangle } from "lucide-react"
import MapLegend from "./map-legend"
import { useToast } from "@/hooks/use-toast"
import SatelliteSearch, { type LocationResult } from "./satellite-search"
import SatelliteDataPanel from "./satellite-data-panel"
import {
  fetchSatelliteData,
  fetchTimeSeriesData,
  getSatelliteOverlay,
  type SatelliteDataParams,
  type SatelliteAnalysisData,
} from "./satellite-data-service"
import MapControls from "./map-controls"
import { useSearchParams, useRouter } from "next/navigation"
import ExportDialog from "../data-export/export-dialog"

declare global {
  interface Window {
    google: any
    initMap: () => void
    gm_authFailure: () => void
  }
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInitializedRef = useRef(false)
  const mapInstanceRef = useRef<any>(null)
  const currentOverlayRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeLayer, setActiveLayer] = useState<"deforestation" | "carbon" | "urban" | "water">("deforestation")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null)
  const [satelliteData, setSatelliteData] = useState<SatelliteAnalysisData[] | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [mapsApiKey, setMapsApiKey] = useState<string | null>(null)
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true)
  const startDateRef = useRef<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  const endDateRef = useRef<Date>(new Date())
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQuery = searchParams.get("search")
  const [searchText, setSearchText] = useState("")
  const [mapError, setMapError] = useState<string | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)

  // Track if we need to update the overlay
  const needsOverlayUpdateRef = useRef(false)

  // Add a reference for the current marker
  const currentMarkerRef = useRef<any>(null)

  // Add state for time series data
  const [timeSeriesData, setTimeSeriesData] = useState<any>(null)
  const [isLoadingTimeSeriesData, setIsLoadingTimeSeriesData] = useState(false)

  // Add state for filters
  const [filters, setFilters] = useState({
    deforestation: true,
    carbon: true,
    urban: true,
    water: false,
  })

  // Function to fetch the Maps API key from our server API route
  const fetchMapsApiKey = useCallback(async () => {
    try {
      setIsLoadingApiKey(true)
      const response = await fetch("/api/maps/key")
      const data = await response.json()

      if (data.apiKey) {
        setMapsApiKey(data.apiKey)
        return data.apiKey
      } else {
        console.warn("Maps API key not available")
        return null
      }
    } catch (error) {
      console.error("Error fetching Maps API key:", error)
      return null
    } finally {
      setIsLoadingApiKey(false)
    }
  }, [])

  // Function to handle location selection
  const handleLocationSelect = useCallback(
    (location: LocationResult) => {
      setSelectedLocation(location)

      // Update URL with search query
      router.push(`/map?search=${encodeURIComponent(location.name)}`)

      // Center map on selected location with appropriate zoom level based on location type
      if (mapInstanceRef.current) {
        // Try to use Google Maps functionality if available
        try {
          mapInstanceRef.current.setCenter({ lat: location.lat, lng: location.lng })

          // Set zoom level based on location type
          switch (location.type) {
            case "city":
              mapInstanceRef.current.setZoom(10)
              break
            case "state":
              mapInstanceRef.current.setZoom(7)
              break
            case "country":
              mapInstanceRef.current.setZoom(5)
              break
            case "region":
              mapInstanceRef.current.setZoom(8)
              break
            default:
              mapInstanceRef.current.setZoom(8)
          }

          // Remove previous marker if it exists
          if (currentMarkerRef.current) {
            try {
              currentMarkerRef.current.setMap(null)
            } catch (e) {
              console.warn("Error removing previous marker:", e)
            }
          }

          // Add a marker for the selected location if Google Maps is available
          if (window.google && window.google.maps) {
            currentMarkerRef.current = new window.google.maps.Marker({
              position: { lat: location.lat, lng: location.lng },
              map: mapInstanceRef.current,
              title: location.name,
              animation: window.google.maps.Animation.DROP,
            })
          }
        } catch (e) {
          console.warn("Error updating map with location:", e)
          // If Google Maps functionality fails, just update the UI
        }

        // Show a toast notification
        toast({
          title: "Location Selected",
          description: `Showing environmental data for ${location.name}`,
        })
      }
    },
    [router, toast],
  )

  // Define initializePlaceholderMap first, since it's used by initializeMap
  const initializePlaceholderMap = useCallback(() => {
    if (!mapRef.current || mapInitializedRef.current) return

    // Create a simple placeholder map using a canvas element
    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    canvas.style.width = "100%"
    canvas.style.height = "100%"

    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Draw a simple grid pattern as a placeholder map
      ctx.fillStyle = "#193341" // Ocean color
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "#2c5a71"
      ctx.lineWidth = 1

      // Draw latitude lines
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw longitude lines
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }

      // Add text to indicate it's a placeholder
      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Map visualization unavailable", canvas.width / 2, canvas.height / 2 - 10)
      ctx.fillText("Please check your API configuration", canvas.width / 2, canvas.height / 2 + 20)
    }

    // Mark the map as initialized to prevent further initialization attempts
    mapInitializedRef.current = true
    setIsMapLoaded(true)

    // Set up a mock map object with minimal functionality
    mapInstanceRef.current = {
      setCenter: () => {},
      setZoom: () => {},
      addListener: () => {},
    }
  }, [])

  // Then define initializeMap, which can now reference initializePlaceholderMap
  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInitializedRef.current) return

    try {
      // Check if Google Maps API is available
      if (!window.google || !window.google.maps) {
        throw new Error("Google Maps API not loaded")
      }

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: window.google.maps.MapTypeId.HYBRID,
        styles: [
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.country",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "administrative.province",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#004358" }],
          },
        ],
      })

      mapInstanceRef.current = map
      mapInitializedRef.current = true
      setIsMapLoaded(true)
      setMapError(null)

      // Add a listener for map clicks
      map.addListener("click", (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        // Get location name from coordinates (reverse geocoding)
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder()
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === "OK" && results[0]) {
              // Find the most appropriate address component
              const locationName = results[0].formatted_address
              let locationType: "city" | "state" | "country" | "region" = "region"

              // Try to determine the type of location
              const addressComponents = results[0].address_components
              let countryCode = ""

              for (const component of addressComponents) {
                if (component.types.includes("country")) {
                  countryCode = component.short_name
                  if (locationName === component.long_name) {
                    locationType = "country"
                  }
                } else if (component.types.includes("administrative_area_level_1")) {
                  if (locationName === component.long_name) {
                    locationType = "state"
                  }
                } else if (component.types.includes("locality")) {
                  if (locationName === component.long_name) {
                    locationType = "city"
                  }
                }
              }

              const location: LocationResult = {
                name: locationName,
                lat,
                lng,
                type: locationType,
                countryCode,
              }

              handleLocationSelect(location)
            }
          })
        }
      })
    } catch (error) {
      console.error("Error initializing Google Maps:", error)
      setMapError(error instanceof Error ? error.message : "Failed to initialize map")
      toast({
        title: "Map Initialization Error",
        description: "Failed to initialize Google Maps. Using simplified map view.",
        variant: "destructive",
      })
      initializePlaceholderMap()
    }
  }, [toast, initializePlaceholderMap, handleLocationSelect])

  // Fetch the Maps API key when the component mounts
  useEffect(() => {
    fetchMapsApiKey()
  }, [fetchMapsApiKey])

  // Update search text when URL parameter changes
  useEffect(() => {
    if (searchQuery) {
      setSearchText(searchQuery)
      // If we have a search query in the URL, try to find the location
      const mockLocation = getMockResults(searchQuery)[0]
      if (mockLocation) {
        handleLocationSelect(mockLocation)
      }
    }
  }, [searchQuery, handleLocationSelect])

  // Load Google Maps script once we have the API key
  useEffect(() => {
    if (typeof window === "undefined" || mapInitializedRef.current || isLoadingApiKey || !mapsApiKey) return

    // Set up error handling for Google Maps API errors
    const handleGoogleMapsError = () => {
      console.error("Google Maps API error occurred")
      setMapError("Google Maps API error occurred. Using simplified map view.")
      initializePlaceholderMap()
    }

    // Add global error handler for Google Maps
    window.gm_authFailure = handleGoogleMapsError

    window.initMap = initializeMap

    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    const script = document.createElement("script")
    // Use the API key we fetched from the server
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places,visualization&callback=initMap`
    script.async = true
    script.defer = true

    // Handle script loading errors
    script.onerror = () => {
      console.error("Error loading Google Maps script")
      setMapError("Failed to load Google Maps script")
      toast({
        title: "Map Loading Error",
        description: "Failed to load Google Maps. Using simplified map view.",
        variant: "destructive",
      })
      initializePlaceholderMap()
    }

    document.head.appendChild(script)

    // Set a timeout to ensure we don't wait forever for the script to load
    const timeoutId = setTimeout(() => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps script load timeout")
        setMapError("Google Maps script load timeout")
        initializePlaceholderMap()
      }
    }, 10000) // 10 second timeout

    return () => {
      clearTimeout(timeoutId)
      if (window.initMap) window.initMap = () => {}
      if (document.head.contains(script) && (!window.google || !window.google.maps)) {
        document.head.removeChild(script)
      }
    }
  }, [initializeMap, toast, initializePlaceholderMap, mapsApiKey, isLoadingApiKey])

  // Function to update the overlay (not directly called in useEffect)
  const updateOverlay = useCallback(() => {
    if (!mapInstanceRef.current || !selectedLocation) {
      // Skip overlay update if map isn't available
      needsOverlayUpdateRef.current = false
      return
    }

    // Check if Google Maps is available
    const isGoogleMapsAvailable = window.google && window.google.maps

    // Remove current overlay if it exists
    if (currentOverlayRef.current) {
      try {
        currentOverlayRef.current.setMap(null)
        currentOverlayRef.current = null
      } catch (error) {
        console.error("Error removing previous overlay:", error)
      }
    }

    // Create params for satellite data
    const params: SatelliteDataParams = {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      type: activeLayer,
      startDate: startDateRef.current.toISOString().split("T")[0],
      endDate: endDateRef.current.toISOString().split("T")[0],
    }

    // Only try to create and add overlay if Google Maps is available
    if (isGoogleMapsAvailable) {
      // Create and add new overlay
      const overlay = getSatelliteOverlay(mapInstanceRef.current, params)
      if (overlay) {
        try {
          overlay.setMap(mapInstanceRef.current)
          currentOverlayRef.current = overlay
        } catch (error) {
          console.error("Error setting overlay on map:", error)
        }
      }
    }

    // Reset the flag
    needsOverlayUpdateRef.current = false
  }, [selectedLocation, activeLayer])

  // Effect to fetch data when location or layer changes
  useEffect(() => {
    if (!selectedLocation) return

    // Mark that we need to update the overlay
    needsOverlayUpdateRef.current = true

    // Create params for satellite data
    const params: SatelliteDataParams = {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      type: activeLayer,
      startDate: startDateRef.current.toISOString().split("T")[0],
      endDate: endDateRef.current.toISOString().split("T")[0],
    }

    // Fetch satellite data
    setIsLoadingData(true)
    fetchSatelliteData(params)
      .then((data) => {
        setSatelliteData(data)
        setIsLoadingData(false)
      })
      .catch((error) => {
        console.error("Error fetching satellite data:", error)
        setIsLoadingData(false)
      })

    // Fetch time series data for charts
    setIsLoadingTimeSeriesData(true)
    fetchTimeSeriesData(params)
      .then((data) => {
        setTimeSeriesData(data)
        setIsLoadingTimeSeriesData(false)
      })
      .catch((error) => {
        console.error("Error fetching time series data:", error)
        setIsLoadingTimeSeriesData(false)
      })

    // Schedule overlay update after data is fetched
    const timeoutId = setTimeout(() => {
      if (needsOverlayUpdateRef.current) {
        updateOverlay()
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [selectedLocation, activeLayer, updateOverlay])

  // Handle UI interactions
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  const handleLayerChange = (value: string) => {
    setActiveLayer(value as "deforestation" | "carbon" | "urban" | "water")
  }

  const handleDateChange = (start: Date, end: Date) => {
    startDateRef.current = start
    endDateRef.current = end

    // Mark that we need to update the overlay
    needsOverlayUpdateRef.current = true

    // Schedule overlay update
    setTimeout(updateOverlay, 100)

    toast({
      title: "Date Range Updated",
      description: `Showing data from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
    })
  }

  const handleExportData = () => {
    setShowExportDialog(true)
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchText.trim()) {
      // Update URL with search query
      router.push(`/map?search=${encodeURIComponent(searchText)}`)

      // Try to find the location in our mock data
      const results = getMockResults(searchText)
      if (results.length > 0) {
        handleLocationSelect(results[0])
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find the specified location. Please try a different search term.",
          variant: "destructive",
        })
      }
    }
  }

  // Function to get mock results (same as in SatelliteSearch)
  function getMockResults(query: string): LocationResult[] {
    const lowercaseQuery = query.toLowerCase()

    // Enhanced location database with more entries and better categorization
    const allLocations: LocationResult[] = [
      // Major cities
      { name: "New York City", lat: 40.7128, lng: -74.006, type: "city", countryCode: "US" },
      { name: "Los Angeles", lat: 34.0522, lng: -118.2437, type: "city", countryCode: "US" },
      { name: "London", lat: 51.5074, lng: -0.1278, type: "city", countryCode: "UK" },
      { name: "Tokyo", lat: 35.6762, lng: 139.6503, type: "city", countryCode: "JP" },
      { name: "Paris", lat: 48.8566, lng: 2.3522, type: "city", countryCode: "FR" },
      { name: "Berlin", lat: 52.52, lng: 13.405, type: "city", countryCode: "DE" },
      { name: "São Paulo", lat: -23.5505, lng: -46.6333, type: "city", countryCode: "BR" },
      { name: "Mumbai", lat: 19.076, lng: 72.8777, type: "city", countryCode: "IN" },
      { name: "Sydney", lat: -33.8688, lng: 151.2093, type: "city", countryCode: "AU" },
      { name: "Cairo", lat: 30.0444, lng: 31.2357, type: "city", countryCode: "EG" },
      // States/Provinces
      { name: "New York", lat: 43.2994, lng: -74.2179, type: "state", countryCode: "US" },
      { name: "California", lat: 36.7783, lng: -119.4179, type: "state", countryCode: "US" },
      { name: "Texas", lat: 31.9686, lng: -99.9018, type: "state", countryCode: "US" },
      { name: "Florida", lat: 27.6648, lng: -81.5158, type: "state", countryCode: "US" },
      // Countries
      { name: "United States", lat: 37.0902, lng: -95.7129, type: "country", countryCode: "US" },
      { name: "United Kingdom", lat: 55.3781, lng: -3.436, type: "country", countryCode: "UK" },
      { name: "Japan", lat: 36.2048, lng: 138.2529, type: "country", countryCode: "JP" },
      { name: "France", lat: 46.2276, lng: 2.2137, type: "country", countryCode: "FR" },
      { name: "Germany", lat: 51.1657, lng: 10.4515, type: "country", countryCode: "DE" },
      // Environmental hotspots
      { name: "Amazon Rainforest", lat: -3.4653, lng: -62.2159, type: "region", countryCode: "BR" },
      { name: "Congo Basin", lat: 0.2, lng: 16.3, type: "region", countryCode: "CD" },
      { name: "Borneo", lat: 0.9619, lng: 114.5548, type: "region", countryCode: "ID" },
    ]

    // Improved search algorithm that prioritizes exact matches and beginning-of-word matches
    return allLocations
      .filter((location) => {
        const locationName = location.name.toLowerCase()
        // Prioritize exact matches or matches at the beginning of words
        if (locationName === lowercaseQuery || locationName.startsWith(lowercaseQuery)) {
          return true
        }
        // Also include partial matches
        return locationName.includes(lowercaseQuery)
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase()
        const bName = b.name.toLowerCase()

        // Exact matches first
        if (aName === lowercaseQuery && bName !== lowercaseQuery) return -1
        if (bName === lowercaseQuery && aName !== lowercaseQuery) return 1

        // Then matches at the beginning
        if (aName.startsWith(lowercaseQuery) && !bName.startsWith(lowercaseQuery)) return -1
        if (bName.startsWith(lowercaseQuery) && !aName.startsWith(lowercaseQuery)) return 1

        // Then alphabetical
        return aName.localeCompare(bName)
      })
      .slice(0, 5) // Return top 5 results
  }

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "h-full"}`}>
      <div className="absolute top-4 left-4 z-10 w-80">
        <div className="space-y-2">
          <Card className="p-2">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <SatelliteSearch onLocationSelect={handleLocationSelect} initialQuery={searchText} />
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>
          </Card>

          <Card className="p-2">
            <Tabs value={activeLayer} onValueChange={handleLayerChange}>
              <TabsList className="w-full">
                <TabsTrigger value="deforestation" className="flex-1">
                  Deforestation
                </TabsTrigger>
                <TabsTrigger value="carbon" className="flex-1">
                  Carbon
                </TabsTrigger>
                <TabsTrigger value="urban" className="flex-1">
                  Urban
                </TabsTrigger>
                <TabsTrigger value="water" className="flex-1">
                  Water
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>

          {selectedLocation && (
            <SatelliteDataPanel
              data={satelliteData}
              isLoading={isLoadingData}
              type={activeLayer}
              location={selectedLocation.name}
              onDateChange={handleDateChange}
              timeSeriesData={timeSeriesData}
              isLoadingTimeSeriesData={isLoadingTimeSeriesData}
            />
          )}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" className="bg-background" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" className="bg-background">
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="bg-background"
          onClick={handleExportData}
          disabled={!satelliteData}
        >
          <Download className="h-4 w-4" />
          <span className="sr-only">Export Data</span>
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <MapControls map={mapInstanceRef.current} />
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <MapLegend type={activeLayer} />
      </div>

      {(isLoadingApiKey || !isMapLoaded) && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-20">
          <Card className="max-w-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Map Error</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
            <p className="text-sm mb-4">
              This is likely due to an API key configuration issue. The application will continue to function with
              limited map capabilities.
            </p>
            <p className="text-xs text-muted-foreground">
              <a
                href="https://developers.google.com/maps/documentation/javascript/error-messages#api-project-map-error"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Learn more about Google Maps API errors
              </a>
            </p>
          </Card>
        </div>
      )}

      {showExportDialog && selectedLocation && (
        <ExportDialog
          data={satelliteData || []}
          location={selectedLocation.name}
          dataType={activeLayer}
          onClose={() => setShowExportDialog(false)}
        />
      )}

      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}

