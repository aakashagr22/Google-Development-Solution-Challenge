"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import type { EnvironmentalData } from "./data-service"

interface DataCardProps {
  data: EnvironmentalData
}

type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success" | "warning"

export default function DataCard({ data }: DataCardProps) {
  const { type, value, trend, percentChange, unit, description } = data

  // Get icon and color based on data type
  const { icon, color } = getDataTypeStyles(type)

  // Get trend icon and color
  const { trendIcon, trendColor } = getTrendStyles(trend, type)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className={color}>{icon}</span>
          {getDataTypeTitle(type)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant={trendColor} className="flex items-center gap-1">
              {trendIcon}
              {Math.abs(percentChange)}% {trend}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-3">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function getDataTypeTitle(type: string) {
  switch (type) {
    case "deforestation":
      return "Deforestation Rate"
    case "carbon":
      return "Carbon Emissions"
    case "urban":
      return "Urban Sprawl"
    case "water":
      return "Water Quality"
    default:
      return type.charAt(0).toUpperCase() + type.slice(1)
  }
}

function getDataTypeStyles(type: string) {
  switch (type) {
    case "deforestation":
      return {
        icon: <TreeIcon className="h-5 w-5" />,
        color: "text-green-600",
      }
    case "carbon":
      return {
        icon: <FactoryIcon className="h-5 w-5" />,
        color: "text-amber-600",
      }
    case "urban":
      return {
        icon: <BuildingIcon className="h-5 w-5" />,
        color: "text-blue-600",
      }
    case "water":
      return {
        icon: <DropletIcon className="h-5 w-5" />,
        color: "text-cyan-600",
      }
    default:
      return {
        icon: null,
        color: "text-primary",
      }
  }
}

function getTrendStyles(trend: string, type: string): { trendIcon: React.ReactNode; trendColor: BadgeVariant } {
  // For most metrics, increasing is bad (except water quality where higher is better)
  const isIncreasingBad = type !== "water"

  if (trend === "increasing") {
    return {
      trendIcon: <ArrowUp className="h-3 w-3" />,
      trendColor: isIncreasingBad ? "destructive" : "success",
    }
  } else if (trend === "decreasing") {
    return {
      trendIcon: <ArrowDown className="h-3 w-3" />,
      trendColor: isIncreasingBad ? "success" : "destructive",
    }
  } else {
    return {
      trendIcon: <Minus className="h-3 w-3" />,
      trendColor: "secondary",
    }
  }
}

// Icons
function TreeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-7l-2-2" />
      <path d="M17 8v4h4" />
      <path d="M17 8a5 5 0 0 0-10 0" />
      <path d="M7 8h4v4" />
      <path d="M7 8a5 5 0 0 1 10 0" />
    </svg>
  )
}

function FactoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
    </svg>
  )
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

function DropletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  )
}

