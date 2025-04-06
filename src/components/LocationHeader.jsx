"use client"

import { useState } from "react"
import { Button } from "./ui/button.jsx"

export function LocationHeader({ location = "Global", onLocationChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const locations = ["Global", "North America", "Europe", "Asia", "Africa", "South America", "Australia"]

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Climate Dashboard</h2>
      <div className="relative">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            <path d="M12 21c-5 0-8-2.5-8-8 0-5 3-8 8-8s8 3 8 8c0 5.5-3 8-8 8z" />
          </svg>
          {location}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 h-4 w-4"
          >
            <path d={isOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
          </svg>
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full rounded-md border bg-background shadow-lg z-10">
            <div className="p-2">
              {locations.map((loc) => (
                <Button
                  key={loc}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onLocationChange(loc)
                    setIsOpen(false)
                  }}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

