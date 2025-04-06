"use client"

import { useState } from "react"
import { Button } from "./ui/button.jsx"

export function SatelliteSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search location..."
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button size="sm">
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </Button>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Recent Searches</div>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Amazon Rainforest
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Arctic Ice Sheet
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
            Great Barrier Reef
          </Button>
        </div>
      </div>
    </div>
  )
}

