"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { LocationResult } from "@/components/location-search"

export type DataType = "deforestation" | "carbon" | "urban" | "water"

interface DashboardContextType {
  selectedLocation: LocationResult | null
  setSelectedLocation: (location: LocationResult | null) => void
  activeFilters: Record<DataType, boolean>
  toggleFilter: (filter: DataType) => void
  enableAllFilters: () => void
  disableAllFilters: () => void
  selectedYear: number
  setSelectedYear: (year: number) => void
  availableYears: number[]
  treesNeeded: number | null
  setTreesNeeded: (trees: number | null) => void
  aqiData: AQIData | null
  setAQIData: (data: AQIData | null) => void
  notificationPreferences: NotificationPreferences
  setNotificationPreferences: (preferences: NotificationPreferences) => void
  unreadNotifications: number
  setUnreadNotifications: (count: number) => void
}

export interface NotificationPreferences {
  deforestation: boolean
  carbonEmissions: boolean
  urbanSprawl: boolean
  waterQuality: boolean
  email: boolean
  push: boolean
  dailyDigest: boolean
  weeklyReport: boolean
}

export interface AQIData {
  value: number
  category: string
  color: string
  pollutants: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  healthImplications: string
  cautionaryStatement: string
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<DataType, boolean>>({
    deforestation: true,
    carbon: true,
    urban: true,
    water: true,
  })
  const [treesNeeded, setTreesNeeded] = useState<number | null>(null)
  const [aqiData, setAQIData] = useState<AQIData | null>(null)
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    deforestation: true,
    carbonEmissions: true,
    urbanSprawl: false,
    waterQuality: true,
    email: true,
    push: true,
    dailyDigest: false,
    weeklyReport: true,
  })
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)

  // Use a fixed year range to prevent hydration mismatches
  const currentYear = 2024
  const [availableYears] = useState<number[]>([2020, 2021, 2022, 2023, 2024])
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  // Toggle a specific filter
  const toggleFilter = (filter: DataType) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  // Enable all filters
  const enableAllFilters = () => {
    setActiveFilters({
      deforestation: true,
      carbon: true,
      urban: true,
      water: true,
    })
  }

  // Disable all filters
  const disableAllFilters = () => {
    setActiveFilters({
      deforestation: false,
      carbon: false,
      urban: false,
      water: false,
    })
  }

  return (
    <DashboardContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        activeFilters,
        toggleFilter,
        enableAllFilters,
        disableAllFilters,
        selectedYear,
        setSelectedYear,
        availableYears,
        treesNeeded,
        setTreesNeeded,
        aqiData,
        setAQIData,
        notificationPreferences,
        setNotificationPreferences,
        unreadNotifications,
        setUnreadNotifications,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

