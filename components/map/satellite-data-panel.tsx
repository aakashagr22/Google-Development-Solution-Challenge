"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Calendar, Info } from "lucide-react"
import type { SatelliteAnalysisData } from "./satellite-data-service"
import { Skeleton } from "@/components/ui/skeleton"
import { DatePicker } from "@/components/ui/date-picker"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TimeSeriesChart from "./time-series-chart"

interface SatelliteDataPanelProps {
  data: SatelliteAnalysisData[] | null
  isLoading: boolean
  type: "deforestation" | "carbon" | "urban" | "water"
  location: string
  onDateChange: (startDate: Date, endDate: Date) => void
  timeSeriesData: any
  isLoadingTimeSeriesData: boolean
}

export default function SatelliteDataPanel({
  data,
  isLoading,
  type,
  location,
  onDateChange,
  timeSeriesData,
  isLoadingTimeSeriesData,
}: SatelliteDataPanelProps) {
  // Use refs to avoid state updates that might cause re-renders
  const startDateRef = useRef<Date | undefined>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
  const endDateRef = useRef<Date | undefined>(new Date())

  // Local state for UI display only
  const [startDateDisplay, setStartDateDisplay] = useState<Date | undefined>(startDateRef.current)
  const [endDateDisplay, setEndDateDisplay] = useState<Date | undefined>(endDateRef.current)

  const handleStartDateChange = (date?: Date) => {
    if (date) {
      startDateRef.current = date
      setStartDateDisplay(date)
    }
  }

  const handleEndDateChange = (date?: Date) => {
    if (date) {
      endDateRef.current = date
      setEndDateDisplay(date)
    }
  }

  const handleApplyDates = () => {
    if (startDateRef.current && endDateRef.current) {
      onDateChange(startDateRef.current, endDateRef.current)
    }
  }

  const getTypeTitle = () => {
    switch (type) {
      case "deforestation":
        return "Deforestation Analysis"
      case "carbon":
        return "Carbon Emissions Analysis"
      case "urban":
        return "Urban Sprawl Analysis"
      case "water":
        return "Water Quality Analysis"
      default:
        return "Environmental Analysis"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{getTypeTitle()}</CardTitle>
          <Badge variant="outline" className="font-normal">
            {location}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Time Range:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <DatePicker date={startDateDisplay} onSelect={handleStartDateChange} />
              <span className="self-center">to</span>
              <DatePicker date={endDateDisplay} onSelect={handleEndDateChange} />
              <Button size="sm" onClick={handleApplyDates}>
                Apply
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-6">
              {data.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-medium">{item.type}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                            <Info className="h-3.5 w-3.5" />
                            <span className="sr-only">Info</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Source: {item.source}</p>
                          <p className="text-xs">Period: {item.period}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold">
                      {item.value} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                    </div>
                    <Badge
                      variant={
                        (item.changeUnit.includes("increase") &&
                          (type === "deforestation" ||
                            type === "urban" ||
                            (type === "water" && item.type === "Turbidity"))) ||
                        (item.changeUnit.includes("decrease") && type === "carbon") ||
                        (item.changeUnit.includes("decrease") && type === "water" && item.type !== "Turbidity")
                          ? "destructive"
                          : "success"
                      }
                      className="flex items-center gap-1"
                    >
                      {item.changeUnit.includes("increase") ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {item.change} {item.changeUnit.split(" ")[1] || ""}
                    </Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        type === "deforestation"
                          ? "bg-destructive"
                          : type === "carbon"
                            ? "bg-amber-500"
                            : type === "urban"
                              ? "bg-blue-500"
                              : "bg-cyan-500"
                      }`}
                      style={{ width: `${Math.min(item.value * 2, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No data available for this location and time period.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your filters or selecting a different area.
              </p>
            </div>
          )}

          {/* Add the time series chart */}
          <div className="mt-6">
            <TimeSeriesChart data={timeSeriesData} isLoading={isLoadingTimeSeriesData} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

