"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import LocationSearch from "@/components/location-search"
import FilterControls from "@/components/dashboard/filter-controls"
import YearSelector from "@/components/dashboard/year-selector"
import LocationHeader from "@/components/dashboard/location-header"
import DataCard from "@/components/environmental-data/data-card"
import DataChart from "@/components/environmental-data/data-chart"
import TreesNeededCard from "@/components/environmental-data/trees-needed-card"
import AQIDisplay from "@/components/environmental-data/aqi-display"
import NewsAndAlertsPanel from "@/components/environmental-data/news-alerts-panel"
import DeforestationTracker from "@/components/environmental-data/deforestation-tracker"
import DynamicReportGenerator from "@/components/data-export/dynamic-report-generator"
import NotificationSystem from "@/components/notifications/notification-system"
import { getEnvironmentalData, calculateTreesNeeded, getAQIData } from "@/components/environmental-data/data-service"
import type { DataType } from "@/components/dashboard/dashboard-context"

export default function DashboardView() {
  const {
    selectedLocation,
    setSelectedLocation,
    activeFilters,
    selectedYear,
    setSelectedYear,
    setTreesNeeded,
    setAQIData,
  } = useDashboard()

  const [showAlerts, setShowAlerts] = useState(false)
  const [alerts, setAlerts] = useState([])

  // Update data when location, filters, or year changes
  useEffect(() => {
    if (!selectedLocation) return

    // Get active data types
    const dataTypes = Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type as DataType)

    // Calculate trees needed to offset carbon emissions
    const treesNeeded = calculateTreesNeeded(selectedLocation, selectedYear)
    setTreesNeeded(treesNeeded)

    // Get AQI data
    const aqiData = getAQIData(selectedLocation)
    setAQIData(aqiData)
  }, [selectedLocation, activeFilters, selectedYear, setTreesNeeded, setAQIData])

  // Get environmental data for the selected location, year, and active filters
  const getFilteredData = () => {
    if (!selectedLocation) return []

    // Get active data types
    const dataTypes = Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type as DataType)

    // Get environmental data
    return getEnvironmentalData(selectedLocation, selectedYear, dataTypes)
  }

  return (
    <div className="container mx-auto py-8 space-y-8 px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Environmental Dashboard</CardTitle>
              <CardDescription className="text-base">
                Monitor environmental changes and track deforestation, carbon emissions, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <LocationSearch onLocationSelect={setSelectedLocation} initialQuery={selectedLocation?.name || ""} />
                </div>
                <div className="flex flex-col gap-4">
                  <YearSelector selectedYear={selectedYear} onChange={setSelectedYear} className="w-full" />
                  <FilterControls />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <AQIDisplay />
        </div>
      </div>

      {selectedLocation && (
        <>
          <LocationHeader location={selectedLocation} showAlerts={false} alerts={[]} setShowAlerts={() => {}} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFilteredData().map((data) => (
                  <DataCard key={data.id} data={data} />
                ))}
              </div>

              <Card className="shadow-md">
                <Tabs defaultValue="deforestation" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="deforestation" disabled={!activeFilters.deforestation}>
                      Deforestation
                    </TabsTrigger>
                    <TabsTrigger value="carbon" disabled={!activeFilters.carbon}>
                      Carbon
                    </TabsTrigger>
                    <TabsTrigger value="urban" disabled={!activeFilters.urban}>
                      Urban
                    </TabsTrigger>
                    <TabsTrigger value="water" disabled={!activeFilters.water}>
                      Water
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="deforestation" className="p-4">
                    <DataChart location={selectedLocation} year={selectedYear} type="deforestation" />
                  </TabsContent>
                  <TabsContent value="carbon" className="p-4">
                    <DataChart location={selectedLocation} year={selectedYear} type="carbon" />
                  </TabsContent>
                  <TabsContent value="urban" className="p-4">
                    <DataChart location={selectedLocation} year={selectedYear} type="urban" />
                  </TabsContent>
                  <TabsContent value="water" className="p-4">
                    <DataChart location={selectedLocation} year={selectedYear} type="water" />
                  </TabsContent>
                </Tabs>
              </Card>

              <DeforestationTracker />

              <DynamicReportGenerator />
            </div>

            <div className="space-y-8">
              <TreesNeededCard />
              <NewsAndAlertsPanel location={selectedLocation} />
              <NotificationSystem />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

