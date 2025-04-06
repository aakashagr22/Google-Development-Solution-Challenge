"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, MapPin, X, Navigation } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"

interface SatelliteSearchProps {
  onLocationSelect: (location: LocationResult) => void
  initialQuery?: string
}

export interface LocationResult {
  name: string
  lat: number
  lng: number
  type: "city" | "state" | "country" | "region"
  countryCode?: string
  state?: string
}

export default function SatelliteSearch({ onLocationSelect, initialQuery = "" }: SatelliteSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const { toast } = useToast()
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Update search query when initialQuery changes
  useEffect(() => {
    if (initialQuery && initialQuery !== searchQuery) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery, searchQuery])

  // Memoize the search function to avoid recreating it on every render
  const searchLocations = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // In a real app, this would be an API call to a geocoding service
        // For now, we'll use our mock data function

        // Simulate network delay for realism
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Get mock results with improved algorithm
        const mockResults = getIndianLocations(query)

        // If we have no results, show a helpful message
        if (mockResults.length === 0) {
          toast({
            title: "No locations found",
            description: "Try a different search term or check spelling",
          })
        }

        setResults(mockResults)
      } catch (error) {
        console.error("Error fetching locations:", error)
        toast({
          title: "Search Error",
          description: "Failed to fetch location data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  // Effect to handle search query changes
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    searchLocations(debouncedSearch)
  }, [debouncedSearch, searchLocations])

  // Effect to handle opening the dropdown when results change
  useEffect(() => {
    if (results.length > 0 && debouncedSearch.length >= 2) {
      setIsOpen(true)
    } else if (results.length === 0 && debouncedSearch.length >= 2) {
      setIsOpen(false)
    }
  }, [results, debouncedSearch.length])

  const handleSelect = (location: LocationResult) => {
    onLocationSelect(location)
    setSearchQuery(location.name)
    setIsOpen(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
    setIsOpen(false)
  }

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          // In a real app, we would use a reverse geocoding service
          // For now, we'll simulate it
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Find the closest Indian city to the coordinates
          // This is a simplified approach - in a real app, you'd use a proper geocoding service
          const allLocations = getIndianLocations("")
          let closestLocation: LocationResult | null = null
          let minDistance = Number.MAX_VALUE

          allLocations.forEach((location) => {
            const distance = Math.sqrt(Math.pow(location.lat - latitude, 2) + Math.pow(location.lng - longitude, 2))

            if (distance < minDistance) {
              minDistance = distance
              closestLocation = location
            }
          })

          if (closestLocation) {
            onLocationSelect(closestLocation)
            setSearchQuery(closestLocation.name)
            toast({
              title: "Location detected",
              description: `Showing data for ${closestLocation.name}`,
            })
          } else {
            throw new Error("No nearby locations found")
          }
        } catch (error) {
          console.error("Error in reverse geocoding:", error)
          toast({
            title: "Location Error",
            description: "Could not determine your location. Please search manually.",
            variant: "destructive",
          })
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsLocating(false)
        toast({
          title: "Location Error",
          description: error.message || "Failed to get your current location",
          variant: "destructive",
        })
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="relative w-full">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Indian cities, states, or regions..."
            className="pl-8 pr-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
          />
          {searchQuery && (
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-9 w-9" onClick={clearSearch}>
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={getCurrentLocation}
          disabled={isLocating}
          title="Use current location"
        >
          <Navigation className={`h-4 w-4 ${isLocating ? "animate-pulse" : ""}`} />
          <span className="sr-only">Use current location</span>
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute z-10 w-full mt-1 shadow-md">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                <p className="mt-2 text-sm text-muted-foreground">Searching locations...</p>
              </div>
            ) : results.length > 0 ? (
              <ul className="py-2">
                {results.map((result, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 h-auto"
                      onClick={() => handleSelect(result)}
                    >
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <div className="flex flex-col items-start">
                        <span>{result.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {result.state ? `${result.state}, ` : ""}
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                          {result.countryCode ? ` • ${result.countryCode}` : ""}
                        </span>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found. Try a different search term.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Enhanced location search function with Indian cities and states
function getIndianLocations(query: string): LocationResult[] {
  const lowercaseQuery = query.toLowerCase()

  // Database of Indian locations
  const indianLocations: LocationResult[] = [
    // Major cities
    { name: "Mumbai", lat: 19.076, lng: 72.8777, type: "city", countryCode: "IN", state: "Maharashtra" },
    { name: "Delhi", lat: 28.6139, lng: 77.209, type: "city", countryCode: "IN", state: "Delhi" },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946, type: "city", countryCode: "IN", state: "Karnataka" },
    { name: "Hyderabad", lat: 17.385, lng: 78.4867, type: "city", countryCode: "IN", state: "Telangana" },
    { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "city", countryCode: "IN", state: "Tamil Nadu" },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639, type: "city", countryCode: "IN", state: "West Bengal" },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, type: "city", countryCode: "IN", state: "Gujarat" },
    { name: "Pune", lat: 18.5204, lng: 73.8567, type: "city", countryCode: "IN", state: "Maharashtra" },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873, type: "city", countryCode: "IN", state: "Rajasthan" },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462, type: "city", countryCode: "IN", state: "Uttar Pradesh" },
    { name: "Kanpur", lat: 26.4499, lng: 80.3319, type: "city", countryCode: "IN", state: "Uttar Pradesh" },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882, type: "city", countryCode: "IN", state: "Maharashtra" },
    { name: "Indore", lat: 22.7196, lng: 75.8577, type: "city", countryCode: "IN", state: "Madhya Pradesh" },
    { name: "Thane", lat: 19.2183, lng: 72.9781, type: "city", countryCode: "IN", state: "Maharashtra" },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126, type: "city", countryCode: "IN", state: "Madhya Pradesh" },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, type: "city", countryCode: "IN", state: "Andhra Pradesh" },
    { name: "Patna", lat: 25.5941, lng: 85.1376, type: "city", countryCode: "IN", state: "Bihar" },
    { name: "Vadodara", lat: 22.3072, lng: 73.1812, type: "city", countryCode: "IN", state: "Gujarat" },
    { name: "Ghaziabad", lat: 28.6692, lng: 77.4538, type: "city", countryCode: "IN", state: "Uttar Pradesh" },
    { name: "Ludhiana", lat: 30.901, lng: 75.8573, type: "city", countryCode: "IN", state: "Punjab" },

    // States
    { name: "Maharashtra", lat: 19.7515, lng: 75.7139, type: "state", countryCode: "IN" },
    { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, type: "state", countryCode: "IN" },
    { name: "Bihar", lat: 25.0961, lng: 85.3131, type: "state", countryCode: "IN" },
    { name: "West Bengal", lat: 22.9868, lng: 87.855, type: "state", countryCode: "IN" },
    { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, type: "state", countryCode: "IN" },
    { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, type: "state", countryCode: "IN" },
    { name: "Karnataka", lat: 15.3173, lng: 75.7139, type: "state", countryCode: "IN" },
    { name: "Gujarat", lat: 22.2587, lng: 71.1924, type: "state", countryCode: "IN" },
    { name: "Rajasthan", lat: 27.0238, lng: 74.2179, type: "state", countryCode: "IN" },
    { name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, type: "state", countryCode: "IN" },
    { name: "Odisha", lat: 20.9517, lng: 85.0985, type: "state", countryCode: "IN" },
    { name: "Telangana", lat: 18.1124, lng: 79.0193, type: "state", countryCode: "IN" },
    { name: "Kerala", lat: 10.8505, lng: 76.2711, type: "state", countryCode: "IN" },
    { name: "Jharkhand", lat: 23.6102, lng: 85.2799, type: "state", countryCode: "IN" },
    { name: "Assam", lat: 26.2006, lng: 92.9376, type: "state", countryCode: "IN" },
    { name: "Punjab", lat: 31.1471, lng: 75.3412, type: "state", countryCode: "IN" },
    { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, type: "state", countryCode: "IN" },
    { name: "Haryana", lat: 29.0588, lng: 76.0856, type: "state", countryCode: "IN" },
    { name: "Delhi", lat: 28.7041, lng: 77.1025, type: "state", countryCode: "IN" },
    { name: "Jammu and Kashmir", lat: 33.7782, lng: 76.5762, type: "state", countryCode: "IN" },

    // Environmental hotspots
    { name: "Western Ghats", lat: 13.05, lng: 75.75, type: "region", countryCode: "IN" },
    { name: "Sundarbans", lat: 21.9497, lng: 88.92, type: "region", countryCode: "IN" },
    { name: "Himalayan Foothills", lat: 30.0668, lng: 79.0193, type: "region", countryCode: "IN" },
    { name: "Thar Desert", lat: 27.0238, lng: 70.6673, type: "region", countryCode: "IN" },
    { name: "Ganges Delta", lat: 22.17, lng: 88.87, type: "region", countryCode: "IN" },
    { name: "Kaziranga National Park", lat: 26.58, lng: 93.17, type: "region", countryCode: "IN" },
    { name: "Rann of Kutch", lat: 23.85, lng: 69.87, type: "region", countryCode: "IN" },
    { name: "Chilika Lake", lat: 19.73, lng: 85.33, type: "region", countryCode: "IN" },
  ]

  // If no query, return all locations
  if (!query) return indianLocations

  // Improved search algorithm that prioritizes exact matches and beginning-of-word matches
  return indianLocations
    .filter((location) => {
      const locationName = location.name.toLowerCase()
      const locationState = location.state?.toLowerCase() || ""

      // Prioritize exact matches or matches at the beginning of words
      if (locationName === lowercaseQuery || locationName.startsWith(lowercaseQuery)) {
        return true
      }

      // Check if state matches
      if (locationState && (locationState === lowercaseQuery || locationState.startsWith(lowercaseQuery))) {
        return true
      }

      // Also include partial matches
      return locationName.includes(lowercaseQuery) || (locationState && locationState.includes(lowercaseQuery))
    })
    .sort((a, b) => {
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      const aState = a.state?.toLowerCase() || ""
      const bState = b.state?.toLowerCase() || ""

      // Exact matches first
      if (aName === lowercaseQuery && bName !== lowercaseQuery) return -1
      if (bName === lowercaseQuery && aName !== lowercaseQuery) return 1

      // Then matches at the beginning
      if (aName.startsWith(lowercaseQuery) && !bName.startsWith(lowercaseQuery)) return -1
      if (bName.startsWith(lowercaseQuery) && !aName.startsWith(lowercaseQuery)) return 1

      // Then state matches
      if (aState === lowercaseQuery && bState !== lowercaseQuery) return -1
      if (bState === lowercaseQuery && aState !== lowercaseQuery) return 1

      // Then alphabetical
      return aName.localeCompare(bName)
    })
    .slice(0, 8) // Return top 8 results
}

