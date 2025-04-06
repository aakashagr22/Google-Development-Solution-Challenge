"use client"

import { useState, useEffect } from "react"
import { Bell, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  location: string
  timestamp: Date
}

export default function AlertNotification() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null)

  // Simulate fetching alerts
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: "alert-1",
        title: "Rapid Deforestation Detected",
        description:
          "Satellite imagery shows a 43% increase in deforestation in the Amazon basin over the past 3 months.",
        severity: "high",
        location: "Amazon Basin, Brazil",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "alert-2",
        title: "Industrial Emissions Spike",
        description:
          "Carbon emissions from industrial facilities in Eastern Europe have increased by 28% compared to last quarter.",
        severity: "medium",
        location: "Eastern Europe",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      },
      {
        id: "alert-3",
        title: "Urban Expansion into Protected Areas",
        description: "Urban development detected encroaching on protected wetlands near coastal regions.",
        severity: "high",
        location: "Southeast Asia",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      },
    ]

    setAlerts(mockAlerts)

    // Show the first alert after a delay
    const timer = setTimeout(() => {
      setCurrentAlert(mockAlerts[0])
      setShowAlert(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const dismissAlert = () => {
    setShowAlert(false)

    // After animation completes, set up the next alert
    setTimeout(() => {
      if (alerts.length > 0) {
        // Remove the current alert from the list
        const newAlerts = alerts.filter((alert) => alert.id !== currentAlert?.id)
        setAlerts(newAlerts)

        // Show the next alert after a delay if there are more
        if (newAlerts.length > 0) {
          const timer = setTimeout(() => {
            setCurrentAlert(newAlerts[0])
            setShowAlert(true)
          }, 5000)

          return () => clearTimeout(timer)
        }
      }
    }, 300)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    let interval = seconds / 3600
    if (interval > 1) {
      return Math.floor(interval) + " hours ago"
    }

    interval = seconds / 60
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago"
    }

    return Math.floor(seconds) + " seconds ago"
  }

  if (!showAlert || !currentAlert) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300 ease-in-out animate-in slide-in-from-right-10">
      <Card className="border-l-4" style={{ borderLeftColor: `var(--${getSeverityColor(currentAlert.severity)})` }}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">{currentAlert.title}</h4>
                <p className="text-sm text-muted-foreground">{currentAlert.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={dismissAlert} className="h-8 w-8">
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <Badge variant={getSeverityColor(currentAlert.severity) as any}>
              {currentAlert.severity.toUpperCase()} PRIORITY
            </Badge>
            <span className="text-muted-foreground">{formatTimeAgo(currentAlert.timestamp)}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Location: {currentAlert.location}</div>
        </CardContent>
      </Card>
    </div>
  )
}

