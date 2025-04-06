"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { useToast } from "@/hooks/use-toast"
import { Bell, Settings, Trash2, Check, X, AlertTriangle, Info, MapPin, Calendar } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "alert" | "update" | "info"
  location: string
  timestamp: Date
  read: boolean
}

interface NotificationPreferences {
  deforestation: boolean
  carbonEmissions: boolean
  urbanSprawl: boolean
  waterQuality: boolean
  email: boolean
  push: boolean
  dailyDigest: boolean
  weeklyReport: boolean
}

export default function NotificationSystem() {
  const { selectedLocation } = useDashboard()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    deforestation: true,
    carbonEmissions: true,
    urbanSprawl: false,
    waterQuality: true,
    email: true,
    push: true,
    dailyDigest: false,
    weeklyReport: true,
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  // Generate mock notifications when location changes
  useEffect(() => {
    if (!selectedLocation) return

    // Generate mock notifications based on location
    const mockNotifications = generateMockNotifications(selectedLocation.name)
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [selectedLocation])

  // Generate mock notifications
  const generateMockNotifications = (locationName: string): Notification[] => {
    const now = new Date()
    const notifications: Notification[] = []

    // Add location-specific notifications
    if (locationName.includes("Delhi") || locationName.includes("Mumbai") || locationName.includes("Urban")) {
      notifications.push({
        id: "n1",
        title: "High Air Pollution Alert",
        message: `Air quality in ${locationName} has reached hazardous levels. AQI is currently above 300. Limit outdoor activities.`,
        type: "alert",
        location: locationName,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
      })

      notifications.push({
        id: "n2",
        title: "Urban Sprawl Update",
        message: `Satellite imagery shows ${locationName} urban area has expanded by 3.2% in the last quarter, affecting nearby green zones.`,
        type: "update",
        location: locationName,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
      })
    }

    if (locationName.includes("Forest") || locationName.includes("Ghats") || locationName.includes("Park")) {
      notifications.push({
        id: "n3",
        title: "Deforestation Alert",
        message: `Significant tree cutting detected in ${locationName}. Approximately 500 trees cut in the last 24 hours.`,
        type: "alert",
        location: locationName,
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
      })

      notifications.push({
        id: "n4",
        title: "Biodiversity Impact Report",
        message: `New report shows deforestation in ${locationName} has affected habitat for 15 endangered species.`,
        type: "info",
        location: locationName,
        timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        read: true,
      })
    }

    // Add general notifications
    notifications.push({
      id: "n5",
      title: "Weekly Environmental Report",
      message: "Your weekly environmental report for your monitored locations is now available.",
      type: "info",
      location: "All Locations",
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false,
    })

    notifications.push({
      id: "n6",
      title: "Carbon Emissions Update",
      message: `Carbon emissions in ${locationName} region have increased by 2.5% compared to last month.`,
      type: "update",
      location: locationName,
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
    })

    return notifications
  }

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)

    toast({
      title: "All notifications marked as read",
      description: "You have no unread notifications.",
    })
  }

  // Delete notification
  const deleteNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))

    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)

    toast({
      title: "All notifications cleared",
      description: "Your notification list has been cleared.",
    })
  }

  // Toggle notification preference
  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      title: "Preference updated",
      description: `${key} notifications ${preferences[key] ? "disabled" : "enabled"}.`,
    })
  }

  // Save notification preferences
  const savePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    })
  }

  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "update":
        return <Info className="h-5 w-5 text-blue-500" />
      case "info":
        return <Info className="h-5 w-5 text-muted-foreground" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  // Get notification badge based on type
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "alert":
        return <Badge variant="destructive">Alert</Badge>
      case "update":
        return <Badge variant="default">Update</Badge>
      case "info":
        return <Badge variant="secondary">Info</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full px-2 py-0 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="mr-1 h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              <Trash2 className="mr-1 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>
        <CardDescription>Environmental alerts and updates for your monitored locations</CardDescription>
      </CardHeader>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <CardContent className="p-0">
            {notifications.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 ${notification.read ? "" : "bg-muted/30"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{notification.title}</h4>
                          <div className="flex items-center gap-2">
                            {getNotificationBadge(notification.type)}
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm mt-1">{notification.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {notification.location}
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                <span className="text-xs">Mark read</span>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-destructive hover:text-destructive"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3 mr-1" />
                              <span className="text-xs">Dismiss</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-2">You don't have any notifications at the moment.</p>
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="preferences">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                Notification Categories
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="deforestation" className="flex items-center gap-2">
                    <span>Deforestation Alerts</span>
                  </Label>
                  <Switch
                    id="deforestation"
                    checked={preferences.deforestation}
                    onCheckedChange={() => togglePreference("deforestation")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="carbonEmissions" className="flex items-center gap-2">
                    <span>Carbon Emissions Updates</span>
                  </Label>
                  <Switch
                    id="carbonEmissions"
                    checked={preferences.carbonEmissions}
                    onCheckedChange={() => togglePreference("carbonEmissions")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="urbanSprawl" className="flex items-center gap-2">
                    <span>Urban Sprawl Notifications</span>
                  </Label>
                  <Switch
                    id="urbanSprawl"
                    checked={preferences.urbanSprawl}
                    onCheckedChange={() => togglePreference("urbanSprawl")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="waterQuality" className="flex items-center gap-2">
                    <span>Water Quality Alerts</span>
                  </Label>
                  <Switch
                    id="waterQuality"
                    checked={preferences.waterQuality}
                    onCheckedChange={() => togglePreference("waterQuality")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Delivery Methods
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <span>Email Notifications</span>
                  </Label>
                  <Switch id="email" checked={preferences.email} onCheckedChange={() => togglePreference("email")} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push" className="flex items-center gap-2">
                    <span>Push Notifications</span>
                  </Label>
                  <Switch id="push" checked={preferences.push} onCheckedChange={() => togglePreference("push")} />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Frequency
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dailyDigest" className="flex items-center gap-2">
                    <span>Daily Digest</span>
                  </Label>
                  <Switch
                    id="dailyDigest"
                    checked={preferences.dailyDigest}
                    onCheckedChange={() => togglePreference("dailyDigest")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weeklyReport" className="flex items-center gap-2">
                    <span>Weekly Summary Report</span>
                  </Label>
                  <Switch
                    id="weeklyReport"
                    checked={preferences.weeklyReport}
                    onCheckedChange={() => togglePreference("weeklyReport")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={savePreferences}>
              Save Notification Preferences
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

