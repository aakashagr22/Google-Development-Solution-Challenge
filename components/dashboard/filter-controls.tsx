"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard, type DataType } from "./dashboard-context"
import { TreePine, Factory, Building2, Droplet, Filter, FilterX } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

export default function FilterControls() {
  const { activeFilters, toggleFilter, enableAllFilters, disableAllFilters } = useDashboard()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCount, setActiveCount] = useState<number>(Object.values(activeFilters).filter(Boolean).length)

  // Update active count when filters change
  React.useEffect(() => {
    setActiveCount(Object.values(activeFilters).filter(Boolean).length)
  }, [activeFilters])

  const filters: { id: DataType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      id: "deforestation",
      label: "Deforestation",
      icon: <TreePine className="h-4 w-4 text-green-600" />,
      description: "Track forest cover loss and reforestation efforts",
    },
    {
      id: "carbon",
      label: "Carbon Emissions",
      icon: <Factory className="h-4 w-4 text-amber-600" />,
      description: "Monitor greenhouse gas emissions and air quality",
    },
    {
      id: "urban",
      label: "Urban Sprawl",
      icon: <Building2 className="h-4 w-4 text-blue-600" />,
      description: "Analyze urban growth and land use changes",
    },
    {
      id: "water",
      label: "Water Quality",
      icon: <Droplet className="h-4 w-4 text-cyan-600" />,
      description: "Assess water quality and availability metrics",
    },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Data Filters</CardTitle>
            <Badge variant="outline" className="text-xs">
              {activeCount} active
            </Badge>
          </div>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
            <TabsList className="h-8">
              <TabsTrigger value="grid" className="px-2 h-6">
                Grid
              </TabsTrigger>
              <TabsTrigger value="list" className="px-2 h-6">
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={enableAllFilters} className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Select All</span>
            </Button>
            <Button variant="outline" size="sm" onClick={disableAllFilters} className="flex items-center gap-1">
              <FilterX className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${
                  activeFilters[filter.id]
                    ? "bg-primary/10 border-primary/30"
                    : "bg-background border-muted hover:bg-muted/30"
                }`}
                onClick={() => toggleFilter(filter.id)}
              >
                <Checkbox
                  id={`grid-${filter.id}`}
                  checked={activeFilters[filter.id]}
                  onCheckedChange={() => toggleFilter(filter.id)}
                />
                <Label
                  htmlFor={`grid-${filter.id}`}
                  className="flex items-center gap-2 font-normal cursor-pointer text-sm flex-1"
                >
                  {filter.icon}
                  {filter.label}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filters.map((filter) => (
              <div
                key={filter.id}
                className={`flex items-start gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                  activeFilters[filter.id]
                    ? "bg-primary/10 border-primary/30"
                    : "bg-background border-muted hover:bg-muted/30"
                }`}
                onClick={() => toggleFilter(filter.id)}
              >
                <Checkbox
                  id={`list-${filter.id}`}
                  checked={activeFilters[filter.id]}
                  onCheckedChange={() => toggleFilter(filter.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`list-${filter.id}`}
                    className="flex items-center gap-2 font-medium cursor-pointer text-sm"
                  >
                    {filter.icon}
                    {filter.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">{filter.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

