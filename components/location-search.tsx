"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, MapPin, X, Navigation, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"

export interface LocationResult {
  name: string
  lat: number
  lng: number
  type: "city" | "state" | "district" | "region"
  state?: string
  countryCode?: string
}

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void
  initialQuery?: string
  className?: string
}

export default function LocationSearch({ onLocationSelect, initialQuery = "", className }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [results, setResults] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(true)
  const { toast } = useToast()
  const debouncedSearch = useDebounce(searchQuery, 300)
  const searchRef = useRef<HTMLDivElement>(null)
  const defaultLocationSetRef = useRef(false)
  const previousQueryRef = useRef(initialQuery)
  const geolocationErrorRef = useRef(false)
  const defaultLocationErrorMessageRef = useRef<string | null>(null)
  const geolocationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set default location for preview environments or when geolocation is unavailable
  useEffect(() => {
    // Only set default location once
    if (defaultLocationSetRef.current) return

    const isPreviewEnvironment =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("vercel.app") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("127.0.0.1"))

    // Set default location if in preview environment or if initialQuery is empty
    if ((isPreviewEnvironment || !initialQuery) && !defaultLocationSetRef.current) {
      defaultLocationSetRef.current = true
      const defaultLocation = getIndianLocations("Delhi")[0]
      if (defaultLocation) {
        toast({
          title: "Using Default Location",
          description: "Showing data for Delhi as a fallback.",
        })
        onLocationSelect(defaultLocation)
        setSearchQuery(defaultLocation.name)
      }
    }
  }, [initialQuery, onLocationSelect, toast])

  // Update search query when initialQuery changes, but prevent infinite loops
  useEffect(() => {
    if (initialQuery !== previousQueryRef.current) {
      previousQueryRef.current = initialQuery
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  // Handle clicks outside the search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Effect to handle search query changes
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)

    // Simulate API call with timeout
    const timeoutId = setTimeout(() => {
      const filteredResults = getIndianLocations(debouncedSearch)
      setResults(filteredResults)
      setIsLoading(false)
      setIsOpen(filteredResults.length > 0)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [debouncedSearch])

  const handleSelect = (location: LocationResult) => {
    // Prevent unnecessary updates if the same location is selected
    if (searchQuery === location.name) {
      setIsOpen(false)
      return
    }

    onLocationSelect(location)
    setSearchQuery(location.name)
    setIsOpen(false)

    // Show a success toast
    toast({
      title: "Location Selected",
      description: `Now showing environmental data for ${location.name}.`,
    })
  }

  const clearSearch = () => {
    setSearchQuery("")
    setResults([])
    setIsOpen(false)
  }

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setIsOpen(results.length > 0)
    }
  }

  const getCurrentLocation = () => {
    // If we've already encountered a geolocation error, use the default location
    if (geolocationErrorRef.current) {
      setDefaultLocationErrorMessage("Geolocation is not available. Using default location.")
      return
    }

    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      setIsGeolocationAvailable(false)
      geolocationErrorRef.current = true
      setDefaultLocationErrorMessage("Geolocation is not supported by your browser.")
      return
    }

    setIsLocating(true)

    try {
      // Clear any existing timeout
      if (geolocationTimeoutRef.current) {
        clearTimeout(geolocationTimeoutRef.current)
      }

      // Set a new timeout to handle cases where geolocation might hang
      geolocationTimeoutRef.current = setTimeout(() => {
        if (isLocating) {
          setIsLocating(false)
          geolocationErrorRef.current = true
          setDefaultLocationErrorMessage("Geolocation request timed out. Using default location.")
        }
      }, 10000)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Clear the timeout since we got a response
          if (geolocationTimeoutRef.current) {
            clearTimeout(geolocationTimeoutRef.current)
            geolocationTimeoutRef.current = null
          }
          handleGeolocationSuccess(position)
        },
        (error) => {
          // Clear the timeout since we got a response
          if (geolocationTimeoutRef.current) {
            clearTimeout(geolocationTimeoutRef.current)
            geolocationTimeoutRef.current = null
          }
          handleGeolocationError(error)
        },
        {
          enableHighAccuracy: true, // Try to get the most accurate position
          timeout: 8000, // Time to wait before error callback is invoked
          maximumAge: 60000, // Allow cached positions up to 1 minute old
        },
      )
    } catch (e) {
      console.error("Geolocation execution error:", e)
      setIsLocating(false)
      geolocationErrorRef.current = true
      setDefaultLocationErrorMessage("An error occurred while trying to access your location.")
    }
  }

  const handleGeolocationSuccess = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords

    try {
      // In a real app, we would use a reverse geocoding service
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find the closest Indian city to the coordinates
      const allLocations = getIndianLocations("")
      let closestLocation = null as LocationResult | null
      let minDistance = Number.MAX_VALUE

      allLocations.forEach((location) => {
        const distance = Math.sqrt(Math.pow(location.lat - latitude, 2) + Math.pow(location.lng - longitude, 2))

        if (distance < minDistance) {
          minDistance = distance
          closestLocation = location as LocationResult
        }
      })

      if (closestLocation && searchQuery !== closestLocation.name) {
        onLocationSelect(closestLocation)
        setSearchQuery(closestLocation.name)
        toast({
          title: "Location detected",
          description: `Showing data for ${closestLocation.name}`,
        })
      } else if (!closestLocation) {
        throw new Error("No nearby locations found")
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error)
      setDefaultLocationErrorMessage("Could not determine your location. Using default location.")
    } finally {
      setIsLocating(false)
    }
  }

  const handleGeolocationError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error)
    setIsLocating(false)
    geolocationErrorRef.current = true

    // Handle specific permission policy error
    if (
      error.code === error.PERMISSION_DENIED ||
      (error.message &&
        (error.message.includes("permissions policy") ||
          error.message.includes("Permission denied") ||
          error.message.includes("denied")))
    ) {
      setDefaultLocationErrorMessage(
        "Geolocation access was denied. This may be due to browser settings or permissions policy.",
      )
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      setDefaultLocationErrorMessage("Location information is unavailable. Using default location.")
    } else if (error.code === error.TIMEOUT) {
      setDefaultLocationErrorMessage("The request to get your location timed out. Using default location.")
    } else {
      setDefaultLocationErrorMessage("An unknown error occurred while trying to access your location.")
    }
  }

  const setDefaultLocationErrorMessage = useCallback((errorMessage: string) => {
    defaultLocationErrorMessageRef.current = errorMessage
  }, [])

  useEffect(() => {
    if (defaultLocationErrorMessageRef.current) {
      // Set geolocation as unavailable to prevent further attempts
      setIsGeolocationAvailable(false)

      toast({
        title: "Location Error",
        description: defaultLocationErrorMessageRef.current,
        variant: "destructive",
      })

      // Provide a default location as fallback
      const defaultLocation = getIndianLocations("Delhi")[0]
      if (defaultLocation && searchQuery !== defaultLocation.name) {
        toast({
          title: "Using Default Location",
          description: "Showing data for Delhi as a fallback.",
        })
        onLocationSelect(defaultLocation)
        setSearchQuery(defaultLocation.name)
      }
      defaultLocationErrorMessageRef.current = null
    }
  }, [onLocationSelect, searchQuery, toast, setIsGeolocationAvailable])

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Indian cities, states, or districts..."
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
          disabled={isLocating || geolocationErrorRef.current}
          title={isGeolocationAvailable ? "Use current location" : "Geolocation not available in this environment"}
        >
          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
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

// Enhanced location search function with Indian cities, states, and districts
function getIndianLocations(query: string): LocationResult[] {
  const lowercaseQuery = query.toLowerCase()

  // Database of Indian locations
  const indianLocations: LocationResult[] = [
    // Major cities
    { name: "Mumbai", lat: 19.076, lng: 72.8777, type: "city", state: "Maharashtra" },
    { name: "Delhi", lat: 28.6139, lng: 77.209, type: "city", state: "Delhi" },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946, type: "city", state: "Karnataka" },
    { name: "Hyderabad", lat: 17.385, lng: 78.4867, type: "city", state: "Telangana" },
    { name: "Chennai", lat: 13.0827, lng: 80.2707, type: "city", state: "Tamil Nadu" },
    { name: "Kolkata", lat: 22.5726, lng: 88.3639, type: "city", state: "West Bengal" },
    { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, type: "city", state: "Gujarat" },
    { name: "Pune", lat: 18.5204, lng: 73.8567, type: "city", state: "Maharashtra" },
    { name: "Jaipur", lat: 26.9124, lng: 75.7873, type: "city", state: "Rajasthan" },
    { name: "Lucknow", lat: 26.8467, lng: 80.9462, type: "city", state: "Uttar Pradesh" },
    { name: "Kanpur", lat: 26.4499, lng: 80.3319, type: "city", state: "Uttar Pradesh" },
    { name: "Nagpur", lat: 21.1458, lng: 79.0882, type: "city", state: "Maharashtra" },
    { name: "Indore", lat: 22.7196, lng: 75.8577, type: "city", state: "Madhya Pradesh" },
    { name: "Thane", lat: 19.2183, lng: 72.9781, type: "city", state: "Maharashtra" },
    { name: "Bhopal", lat: 23.2599, lng: 77.4126, type: "city", state: "Madhya Pradesh" },
    { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185, type: "city", state: "Andhra Pradesh" },
    { name: "Patna", lat: 25.5941, lng: 85.1376, type: "city", state: "Bihar" },
    { name: "Vadodara", lat: 22.3072, lng: 73.1812, type: "city", state: "Gujarat" },
    { name: "Ghaziabad", lat: 28.6692, lng: 77.4538, type: "city", state: "Uttar Pradesh" },
    { name: "Ludhiana", lat: 30.901, lng: 75.8573, type: "city", state: "Punjab" },
    { name: "Agra", lat: 27.1767, lng: 78.0081, type: "city", state: "Uttar Pradesh" },
    { name: "Nashik", lat: 19.9975, lng: 73.7898, type: "city", state: "Maharashtra" },
    { name: "Faridabad", lat: 28.4089, lng: 77.3178, type: "city", state: "Haryana" },
    { name: "Meerut", lat: 28.9845, lng: 77.7064, type: "city", state: "Uttar Pradesh" },
    { name: "Rajkot", lat: 22.3039, lng: 70.8022, type: "city", state: "Gujarat" },
    { name: "Varanasi", lat: 25.3176, lng: 82.9739, type: "city", state: "Uttar Pradesh" },
    { name: "Srinagar", lat: 34.0837, lng: 74.7973, type: "city", state: "Jammu and Kashmir" },
    { name: "Aurangabad", lat: 19.8762, lng: 75.3433, type: "city", state: "Maharashtra" },
    { name: "Dhanbad", lat: 23.7957, lng: 86.4304, type: "city", state: "Jharkhand" },
    { name: "Amritsar", lat: 31.634, lng: 74.8723, type: "city", state: "Punjab" },
    { name: "Allahabad", lat: 25.4358, lng: 81.8463, type: "city", state: "Uttar Pradesh" },
    { name: "Ranchi", lat: 23.3441, lng: 85.3096, type: "city", state: "Jharkhand" },
    { name: "Howrah", lat: 22.5958, lng: 88.2636, type: "city", state: "West Bengal" },
    { name: "Coimbatore", lat: 11.0168, lng: 76.9558, type: "city", state: "Tamil Nadu" },
    { name: "Jabalpur", lat: 23.1815, lng: 79.9864, type: "city", state: "Madhya Pradesh" },

    // States
    { name: "Maharashtra", lat: 19.7515, lng: 75.7139, type: "state" },
    { name: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, type: "state" },
    { name: "Bihar", lat: 25.0961, lng: 85.3131, type: "state" },
    { name: "West Bengal", lat: 22.9868, lng: 87.855, type: "state" },
    { name: "Tamil Nadu", lat: 11.1271, lng: 78.6569, type: "state" },
    { name: "Madhya Pradesh", lat: 22.9734, lng: 78.6569, type: "state" },
    { name: "Karnataka", lat: 15.3173, lng: 75.7139, type: "state" },
    { name: "Gujarat", lat: 22.2587, lng: 71.1924, type: "state" },
    { name: "Rajasthan", lat: 27.0238, lng: 74.2179, type: "state" },
    { name: "Andhra Pradesh", lat: 15.9129, lng: 79.74, type: "state" },
    { name: "Odisha", lat: 20.9517, lng: 85.0985, type: "state" },
    { name: "Telangana", lat: 18.1124, lng: 79.0193, type: "state" },
    { name: "Kerala", lat: 10.8505, lng: 76.2711, type: "state" },
    { name: "Jharkhand", lat: 23.6102, lng: 85.2799, type: "state" },
    { name: "Assam", lat: 26.2006, lng: 92.9376, type: "state" },
    { name: "Punjab", lat: 31.1471, lng: 75.3412, type: "state" },
    { name: "Chhattisgarh", lat: 21.2787, lng: 81.8661, type: "state" },
    { name: "Haryana", lat: 29.0588, lng: 76.0856, type: "state" },
    { name: "Delhi", lat: 28.7041, lng: 77.1025, type: "state" },
    { name: "Jammu and Kashmir", lat: 33.7782, lng: 76.5762, type: "state" },
    { name: "Uttarakhand", lat: 30.0668, lng: 79.0193, type: "state" },
    { name: "Himachal Pradesh", lat: 31.1048, lng: 77.1734, type: "state" },
    { name: "Tripura", lat: 23.9408, lng: 91.9882, type: "state" },
    { name: "Meghalaya", lat: 25.467, lng: 91.3662, type: "state" },
    { name: "Manipur", lat: 24.6637, lng: 93.9063, type: "state" },
    { name: "Nagaland", lat: 26.1584, lng: 94.5624, type: "state" },
    { name: "Goa", lat: 15.2993, lng: 74.124, type: "state" },
    { name: "Arunachal Pradesh", lat: 28.218, lng: 94.7278, type: "state" },
    { name: "Mizoram", lat: 23.1645, lng: 92.9376, type: "state" },
    { name: "Sikkim", lat: 27.533, lng: 88.5122, type: "state" },

    // Environmental hotspots
    { name: "Western Ghats", lat: 13.05, lng: 75.75, type: "region", state: "Multiple States" },
    { name: "Sundarbans", lat: 21.9497, lng: 88.92, type: "region", state: "West Bengal" },
    { name: "Himalayan Foothills", lat: 30.0668, lng: 79.0193, type: "region", state: "Multiple States" },
    { name: "Thar Desert", lat: 27.0238, lng: 70.6673, type: "region", state: "Rajasthan" },
    { name: "Ganges Delta", lat: 22.17, lng: 88.87, type: "region", state: "West Bengal" },
    { name: "Kaziranga National Park", lat: 26.58, lng: 93.17, type: "region", state: "Assam" },
    { name: "Rann of Kutch", lat: 23.85, lng: 69.87, type: "region", state: "Gujarat" },
    { name: "Chilika Lake", lat: 19.73, lng: 85.33, type: "region", state: "Odisha" },
    { name: "Gir Forest", lat: 21.1239, lng: 70.8167, type: "region", state: "Gujarat" },
    { name: "Nanda Devi Biosphere", lat: 30.4167, lng: 79.9167, type: "region", state: "Uttarakhand" },
    { name: "Silent Valley", lat: 11.0833, lng: 76.4167, type: "region", state: "Kerala" },
    { name: "Kanha National Park", lat: 22.3345, lng: 80.6115, type: "region", state: "Madhya Pradesh" },
    { name: "Bandipur National Park", lat: 11.6717, lng: 76.6344, type: "region", state: "Karnataka" },
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

