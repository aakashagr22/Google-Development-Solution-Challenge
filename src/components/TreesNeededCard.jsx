"use client"

import { useState, useEffect } from "react"

// Sample data - in a real app, this would come from an API
const calculateTreesNeeded = (location, year) => {
  // Base calculation for global 2023
  const baseTreesNeeded = 7500000000 // 7.5 billion trees

  // Adjust based on year (fewer trees needed in the past due to lower emissions)
  const yearFactor = (year - 1990) / (2023 - 1990)

  // Adjust based on location
  const locationFactor =
    location === "Global"
      ? 1
      : location === "North America"
        ? 0.2
        : location === "Europe"
          ? 0.15
          : location === "Asia"
            ? 0.4
            : location === "Africa"
              ? 0.1
              : location === "South America"
                ? 0.1
                : location === "Australia"
                  ? 0.05
                  : 1

  return Math.round(baseTreesNeeded * yearFactor * locationFactor)
}

export function TreesNeededCard({ location = "Global", year = 2023 }) {
  const [treesNeeded, setTreesNeeded] = useState(0)

  useEffect(() => {
    setTreesNeeded(calculateTreesNeeded(location, year))
  }, [location, year])

  // Format large numbers with abbreviations
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + "B"
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold">{formatNumber(treesNeeded)}</div>
        <div className="text-sm text-muted-foreground">Trees needed to offset carbon emissions</div>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Tree icon with dynamic size based on trees needed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-green-500"
          >
            <path d="M17 14v10" />
            <path d="M7 14v10" />
            <path d="M12 2v22" />
            <path d="M12 2a5 5 0 0 0-5 5c0 2 2 3 2 3l3-3 3 3s2-1 2-3a5 5 0 0 0-5-5Z" />
            <path d="M12 12a5 5 0 0 0-5 5c0 2 2 3 2 3l3-3 3 3s2-1 2-3a5 5 0 0 0-5-5Z" />
          </svg>
        </div>
      </div>

      <div className="text-sm text-center">
        <p>Each tree absorbs approximately 25kg of CO₂ per year</p>
      </div>
    </div>
  )
}

