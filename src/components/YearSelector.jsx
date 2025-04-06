"use client"
import { Button } from "./ui/button.jsx"
import { Slider } from "./ui/slider.jsx"

export function YearSelector({ year = 2023, onYearChange, minYear = 1990, maxYear = 2023 }) {
  return (
    <div className="space-y-2 min-w-[200px]">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Year: {year}</span>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onYearChange(Math.max(minYear, year - 1))}
            disabled={year <= minYear}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Previous year</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onYearChange(Math.min(maxYear, year + 1))}
            disabled={year >= maxYear}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">Next year</span>
          </Button>
        </div>
      </div>
      <Slider value={[year]} min={minYear} max={maxYear} step={1} onValueChange={(value) => onYearChange(value[0])} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  )
}

