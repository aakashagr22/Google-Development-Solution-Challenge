"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Newspaper, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNewsAndAlerts, getRecommendations } from "@/components/environmental-data/data-service"
import type { LocationResult } from "@/components/location-search"
import type { EnvironmentalData } from "@/components/environmental-data/data-service"
import { useDashboard } from "@/components/dashboard/dashboard-context"

interface NewsAndAlertsPanelProps {
  location: LocationResult
}

export default function NewsAndAlertsPanel({ location }: NewsAndAlertsPanelProps) {
  const [activeTab, setActiveTab] = useState("alerts")
  const [newsAndAlerts, setNewsAndAlerts] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const { selectedYear, activeFilters } = useDashboard()

  // Memoize activeDataTypes to prevent recreation on every render
  const activeDataTypes = useMemo(() => {
    return Object.entries(activeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([type]) => type as any)
  }, [activeFilters])

  useEffect(() => {
    if (location) {
      // Get news and alerts
      const data = getNewsAndAlerts(location)
      setNewsAndAlerts(data)

      // Get recommendations based on environmental data
      // First, get the environmental data
      const environmentalData: EnvironmentalData[] = activeDataTypes.map((type) => ({
        id: `${type}-${location.name}-${selectedYear}`,
        type,
        year: selectedYear,
        value: 0, // These will be filled by the function
        trend: "stable",
        percentChange: 0,
        unit: "",
        description: "",
      }))

      const recs = getRecommendations(location, environmentalData)
      setRecommendations(recs)
    }
  }, [location, activeDataTypes, selectedYear])

  if (!location || !newsAndAlerts) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Updates for {location.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="alerts" className="flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-1">
              <Newspaper className="h-3.5 w-3.5" />
              <span>News</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-1">
              <RecommendationIcon className="h-3.5 w-3.5" />
              <span>Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="space-y-4">
              {newsAndAlerts.alerts.length > 0 ? (
                newsAndAlerts.alerts.map((alert: any) => <AlertItem key={alert.id} alert={alert} />)
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No active alerts for {location.name}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="space-y-4">
              {newsAndAlerts.news.map((item: any) => (
                <NewsItem key={item.id} news={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-4">
              {recommendations.map((rec: any) => (
                <RecommendationItem key={rec.id} recommendation={rec} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AlertItem({ alert }: { alert: any }) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="warning">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="outline">Information</Badge>
    }
  }

  return (
    <div className="border-l-4 border-destructive p-4 rounded-md bg-destructive/5">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          {alert.title}
        </h3>
        {getSeverityBadge(alert.severity)}
      </div>
      <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
      <div className="flex items-center text-xs text-muted-foreground">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{alert.date}</span>
      </div>
    </div>
  )
}

function NewsItem({ news }: { news: any }) {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-2">{news.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{news.description}</p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{news.source}</span>
        <span>{news.date}</span>
      </div>
    </div>
  )
}

function RecommendationItem({ recommendation }: { recommendation: any }) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="warning">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge variant="outline">Information</Badge>
    }
  }

  return (
    <div className="border p-4 rounded-md">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{recommendation.title}</h3>
        {getPriorityBadge(recommendation.priority)}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">Expected Impact: {recommendation.impact}</span>
        <Button variant="link" size="sm" className="p-0 h-auto flex items-center gap-1">
          <span>Learn more</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

function RecommendationIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

