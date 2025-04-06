"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Collapsible } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Map } from "@/components/ui/map"
import { Layer } from "@/components/ui/layer"

interface MapViewProps {
  location: {
    lat: number
    lng: number
    name: string
  } | null
  year: number
  onLoadingChange?: (isLoading: boolean) => void
}

export function MapView({ location, year, onLoadingChange }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [mapType, setMapType] = useState("satellite")
  const [overlay, setOverlay] = useState("deforestation")
  const [center, setCenter] = useState({ lat: 0, lng: 0 })
  const [zoom, setZoom] = useState(2)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      })

      try {
        const google = await loader.load()
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 0, lng: 0 },
          zoom: 2,
          styles: [
            {
              featureType: "landscape.natural",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f2" }],
            },
          ],
        })
        setMap(map)
      } catch (error) {
        console.error("Error loading Google Maps:", error)
      } finally {
        setIsLoading(false)
        onLoadingChange?.(false)
      }
    }

    initMap()
  }, [onLoadingChange])

  useEffect(() => {
    if (!map || !location) return

    map.setCenter({ lat: location.lat, lng: location.lng })
    map.setZoom(8)

    // Add marker
    new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map,
      title: location.name,
    })
  }, [map, location])

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Map View</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-200 hover:bg-green-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 text-green-700" />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 text-green-700" />
              Show Filters
            </>
          )}
        </Button>
      </div>

      <Collapsible open={showFilters}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-green-700">Map Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mapType === "satellite" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  mapType === "satellite"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setMapType("satellite")}
              >
                Satellite
              </Button>
              <Button
                variant={mapType === "terrain" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  mapType === "terrain"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setMapType("terrain")}
              >
                Terrain
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-700">Overlay</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={overlay === "deforestation" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  overlay === "deforestation"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setOverlay("deforestation")}
              >
                Deforestation
              </Button>
              <Button
                variant={overlay === "carbon" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  overlay === "carbon"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setOverlay("carbon")}
              >
                Carbon
              </Button>
            </div>
          </div>
        </div>
      </Collapsible>

      <div className="h-[400px] rounded-lg border border-green-100">
        <Map
          center={center}
          zoom={zoom}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapType === "satellite" ? "satellite" : "terrain"}
        >
          {overlay === "deforestation" && (
            <Layer
              id="deforestation"
              type="fill"
              paint={{
                "fill-color": "#059669",
                "fill-opacity": 0.5,
              }}
            />
          )}
          {overlay === "carbon" && (
            <Layer
              id="carbon"
              type="fill"
              paint={{
                "fill-color": "#10b981",
                "fill-opacity": 0.5,
              }}
            />
          )}
        </Map>
      </div>
    </div>
  )
} 