"use client"

import { useState } from "react"
import { useDashboard } from "./dashboard-context"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Collapsible } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"

interface YearSelectorProps {
  selectedYear: number
  onChange: (year: number) => void
  className?: string
}

export default function YearSelector({ selectedYear, onChange, className }: YearSelectorProps) {
  const { availableYears } = useDashboard()
  const [showYears, setShowYears] = useState(false)

  const handlePreviousYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex > 0) {
      onChange(availableYears[currentIndex - 1])
    }
  }

  const handleNextYear = () => {
    const currentIndex = availableYears.indexOf(selectedYear)
    if (currentIndex < availableYears.length - 1) {
      onChange(availableYears[currentIndex + 1])
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Year Selection</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-200 hover:bg-green-50"
          onClick={() => setShowYears(!showYears)}
        >
          {showYears ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 text-green-700" />
              Hide Years
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 text-green-700" />
              Show Years
            </>
          )}
        </Button>
      </div>

      <Collapsible open={showYears}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-green-700">Select Year</Label>
            <div className="grid grid-cols-3 gap-2">
              {availableYears.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  className={`h-8 ${
                    selectedYear === year
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-green-200 hover:bg-green-50"
                  }`}
                  onClick={() => onChange(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Collapsible>
    </div>
  )
}

