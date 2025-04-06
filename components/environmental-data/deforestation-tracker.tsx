"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { AlertTriangle, Calendar, Info, TreeDeciduous, Axe, TrendingDown, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DeforestationData {
  daily: {
    date: string
    treesCut: number
    area: number
    hotspots: number
    trend: "increasing" | "decreasing" | "stable"
  }
  monthly: {
    month: string
    treesCut: number
    area: number
    percentChange: number
    trend: "increasing" | "decreasing" | "stable"
  }[]
  yearly: {
    year: number
    treesCut: number
    area: number
    percentChange: number
  }[]
  projections: {
    nextMonth: number
    nextYear: number
    fiveYears: number
  }
}

export default function DeforestationTracker() {
  const { selectedLocation, selectedYear } = useDashboard()
  const [deforestationData, setDeforestationData] = useState<DeforestationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!selectedLocation) return

    setIsLoading(true)

    // Simulate API call to get deforestation data
    setTimeout(() => {
      // Generate mock data based on location and year
      const mockData = generateMockDeforestationData(selectedLocation.name, selectedYear)
      setDeforestationData(mockData)
      setIsLoading(false)
    }, 1000)
  }, [selectedLocation, selectedYear])

  // Generate mock deforestation data
  const generateMockDeforestationData = (locationName: string, year: number): DeforestationData => {
    // Base values that will be adjusted based on location and year
    let baseTreesPerDay = 0
    let baseAreaPerDay = 0
    let baseHotspotsPerDay = 0
    let baseTrend: "increasing" | "decreasing" | "stable" = "stable"

    // Adjust base values based on location
    if (locationName.includes("Amazon") || locationName.includes("Forest") || locationName.includes("Ghats")) {
      baseTreesPerDay = 5000 + Math.floor(Math.random() * 2000)
      baseAreaPerDay = 20 + Math.floor(Math.random() * 10)
      baseHotspotsPerDay = 8 + Math.floor(Math.random() * 5)
      baseTrend = "increasing"
    } else if (locationName.includes("Delhi") || locationName.includes("Mumbai") || locationName.includes("Urban")) {
      baseTreesPerDay = 200 + Math.floor(Math.random() * 100)
      baseAreaPerDay = 1 + Math.floor(Math.random() * 2)
      baseHotspotsPerDay = 2 + Math.floor(Math.random() * 2)
      baseTrend = "decreasing"
    } else {
      baseTreesPerDay = 1000 + Math.floor(Math.random() * 500)
      baseAreaPerDay = 5 + Math.floor(Math.random() * 3)
      baseHotspotsPerDay = 3 + Math.floor(Math.random() * 3)
      baseTrend = Math.random() > 0.5 ? "increasing" : "decreasing"
    }

    // Adjust base values based on year (more recent years have higher deforestation)
    const yearFactor = 1 + (year - 2018) * 0.05
    baseTreesPerDay *= yearFactor
    baseAreaPerDay *= yearFactor

    // Generate daily data
    const today = new Date()
    const dailyData = {
      date: today.toLocaleDateString(),
      treesCut: Math.round(baseTreesPerDay * (0.9 + Math.random() * 0.2)),
      area: Math.round(baseAreaPerDay * (0.9 + Math.random() * 0.2) * 10) / 10,
      hotspots: baseHotspotsPerDay,
      trend: baseTrend,
    }

    // Generate monthly data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const monthlyData: { month: string; treesCut: number; area: number; percentChange: number; trend: "increasing" | "decreasing" | "stable" }[] = months.map((month, index) => {
      // Seasonal variations
      let seasonalFactor = 1.0
      if (index >= 2 && index <= 4) {
        // Spring - higher deforestation
        seasonalFactor = 1.2
      } else if (index >= 5 && index <= 7) {
        // Summer - highest deforestation
        seasonalFactor = 1.4
      } else if (index >= 8 && index <= 10) {
        // Fall - moderate deforestation
        seasonalFactor = 1.1
      } else {
        // Winter - lower deforestation
        seasonalFactor = 0.8
      }

      const monthlyTrees = Math.round(baseTreesPerDay * 30 * seasonalFactor)
      const monthlyArea = Math.round(baseAreaPerDay * 30 * seasonalFactor * 10) / 10

      // Calculate percent change from previous month
      let percentChange = 0
      if (index > 0) {
        const prevMonthFactor =
          index === 0
            ? 0.8
            : index >= 3 && index <= 5
              ? 1.2
              : index >= 6 && index <= 8
                ? 1.4
                : index >= 9 && index <= 11
                  ? 1.1
                  : 0.8
        const prevMonthTrees = baseTreesPerDay * 30 * prevMonthFactor
        percentChange = Math.round(((monthlyTrees - prevMonthTrees) / prevMonthTrees) * 100 * 10) / 10
      }

      return {
        month,
        treesCut: monthlyTrees,
        area: monthlyArea,
        percentChange,
        trend: (percentChange > 1 ? "increasing" : percentChange < -1 ? "decreasing" : "stable") as "increasing" | "decreasing" | "stable",
      }
    })

    // Generate yearly data
    const yearlyData = []
    for (let i = 0; i < 5; i++) {
      const yearOffset = i
      const yearValue = year - yearOffset
      const yearlyFactor = 1 + (yearValue - 2018) * 0.05
      const yearlyTrees = Math.round(baseTreesPerDay * 365 * yearlyFactor)
      const yearlyArea = Math.round(baseAreaPerDay * 365 * yearlyFactor)

      // Calculate percent change from previous year
      let percentChange = 0
      if (i > 0) {
        const prevYearFactor = 1 + (yearValue + 1 - 2018) * 0.05
        const prevYearTrees = baseTreesPerDay * 365 * prevYearFactor
        percentChange = Math.round(((yearlyTrees - prevYearTrees) / prevYearTrees) * 100 * 10) / 10
      }

      yearlyData.push({
        year: yearValue,
        treesCut: yearlyTrees,
        area: yearlyArea,
        percentChange,
      })
    }

    // Generate projections
    const projections = {
      nextMonth: Math.round(baseTreesPerDay * 30 * (1 + (baseTrend === "increasing" ? 0.05 : -0.03))),
      nextYear: Math.round(baseTreesPerDay * 365 * (1 + (baseTrend === "increasing" ? 0.1 : -0.05))),
      fiveYears: Math.round(baseTreesPerDay * 365 * 5 * (1 + (baseTrend === "increasing" ? 0.3 : -0.15))),
    }

    return {
      daily: dailyData,
      monthly: monthlyData,
      yearly: yearlyData,
      projections,
    }
  }

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Get trend icon based on trend
  const getTrendIcon = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-destructive" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      case "stable":
        return <span className="h-4 w-4 inline-block">→</span>
    }
  }

  // Get trend color based on trend (for deforestation, increasing is bad)
  const getTrendColor = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return "text-destructive"
      case "decreasing":
        return "text-green-500"
      case "stable":
        return "text-muted-foreground"
    }
  }

  // Get percent change display with color
  const getPercentChangeDisplay = (percentChange: number) => {
    const color =
      percentChange > 0 ? "text-destructive" : percentChange < 0 ? "text-green-500" : "text-muted-foreground"
    const prefix = percentChange > 0 ? "+" : ""
    return (
      <span className={color}>
        {prefix}
        {percentChange}%
      </span>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deforestation Tracker</CardTitle>
          <CardDescription>Loading deforestation data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Fetching satellite data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!deforestationData || !selectedLocation) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Deforestation Tracker</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <TreeDeciduous className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a location to view deforestation data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Deforestation Tracker</CardTitle>
            <CardDescription>Real-time satellite monitoring of forest loss</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Data is sourced from satellite imagery and updated daily. Tree cutting estimates are based on canopy
                  loss detected by comparing sequential satellite images.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Today's Deforestation</h3>
            <span className="text-xs text-muted-foreground">{deforestationData.daily.date}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background p-3 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Axe className="h-5 w-5 text-destructive mr-2" />
                  <span className="text-sm font-medium">Trees Cut</span>
                </div>
                <span className="text-lg font-bold">{formatNumber(deforestationData.daily.treesCut)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Today's estimate</span>
                <span className={getTrendColor(deforestationData.daily.trend)}>
                  {getTrendIcon(deforestationData.daily.trend)}
                </span>
              </div>
            </div>

            <div className="bg-background p-3 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TreeDeciduous className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">Area Affected</span>
                </div>
                <span className="text-lg font-bold">{deforestationData.daily.area} hectares</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Forest coverage lost</span>
                <span className={getTrendColor(deforestationData.daily.trend)}>
                  {getTrendIcon(deforestationData.daily.trend)}
                </span>
              </div>
            </div>

            <div className="bg-background p-3 rounded-md border">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium">Deforestation Hotspots</span>
                </div>
                <span className="text-lg font-bold">{deforestationData.daily.hotspots}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Active clearing sites</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  View on map
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Data</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Monthly Tree Loss (This Year)</h3>
                  <div className="space-y-2">
                    {deforestationData.monthly.map((month, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-8 text-xs">{month.month}</span>
                        <div className="flex-1 mx-2">
                          <Progress value={(month.treesCut / 200000) * 100} className="h-2" />
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs font-medium">{formatNumber(month.treesCut)}</span>
                          <span className="text-xs ml-2">{getPercentChangeDisplay(month.percentChange)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Monthly Area Affected (hectares)</h3>
                  <div className="space-y-2">
                    {deforestationData.monthly.map((month, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-8 text-xs">{month.month}</span>
                        <div className="flex-1 mx-2">
                          <Progress value={(month.area / 1000) * 100} className="h-2" />
                        </div>
                        <span className="text-xs font-medium">{month.area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Projected Deforestation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Next Month</div>
                    <div className="text-lg font-bold">
                      {formatNumber(deforestationData.projections.nextMonth)} trees
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Next Year</div>
                    <div className="text-lg font-bold">
                      {formatNumber(deforestationData.projections.nextYear)} trees
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">Next 5 Years</div>
                    <div className="text-lg font-bold">
                      {formatNumber(deforestationData.projections.fiveYears)} trees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Yearly Deforestation Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Year</th>
                        <th className="text-right py-2 px-2">Trees Cut</th>
                        <th className="text-right py-2 px-2">Area (hectares)</th>
                        <th className="text-right py-2 px-2">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deforestationData.yearly.map((yearData, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-2">{yearData.year}</td>
                          <td className="text-right py-2 px-2">{formatNumber(yearData.treesCut)}</td>
                          <td className="text-right py-2 px-2">{formatNumber(yearData.area)}</td>
                          <td className="text-right py-2 px-2">{getPercentChangeDisplay(yearData.percentChange)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-2">Cumulative Impact</h3>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Trees Lost (5 Years)</div>
                      <div className="text-2xl font-bold">
                        {formatNumber(deforestationData.yearly.reduce((sum, year) => sum + year.treesCut, 0))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Equivalent to{" "}
                        {Math.round(deforestationData.yearly.reduce((sum, year) => sum + year.treesCut, 0) / 500)}{" "}
                        football fields of forest
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Area Affected (5 Years)</div>
                      <div className="text-2xl font-bold">
                        {formatNumber(deforestationData.yearly.reduce((sum, year) => sum + year.area, 0))} hectares
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(deforestationData.yearly.reduce((sum, year) => sum + year.area, 0) / 100)} km² of
                        forest coverage lost
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Last updated: {new Date().toLocaleString()}
          </span>
        </div>
        <Button variant="outline" size="sm">
          View Detailed Report
        </Button>
      </CardFooter>
    </Card>
  )
}

