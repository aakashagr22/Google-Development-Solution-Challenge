"use client"

import { createContext, useContext, useState } from "react"

const DashboardContext = createContext(undefined)

export function DashboardProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState("Global")
  const [selectedYear, setSelectedYear] = useState(2023)
  const [dataFilters, setDataFilters] = useState({
    showProjections: false,
    dataResolution: "monthly",
    dataSource: "all",
  })

  const value = {
    selectedLocation,
    setSelectedLocation,
    selectedYear,
    setSelectedYear,
    dataFilters,
    setDataFilters,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)

  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }

  return context
}

