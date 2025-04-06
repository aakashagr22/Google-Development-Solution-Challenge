"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Bell, Mail, User, Lock } from "lucide-react"

export default function UserProfile() {
  const [savedLocations, setSavedLocations] = useState([
    { id: 1, name: "New York City", type: "city" },
    { id: 2, name: "Amazon Rainforest", type: "region" },
    { id: 3, name: "California", type: "state" },
  ])

  const [notificationSettings, setNotificationSettings] = useState({
    deforestation: true,
    carbon: true,
    urban: false,
    water: true,
    email: true,
    push: true,
    weekly: false,
  })

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const { toast } = useToast()

  const handleRemoveLocation = (id: number) => {
    setSavedLocations(savedLocations.filter((location) => location.id !== id))
    toast({
      title: "Location Removed",
      description: "The location has been removed from your saved locations.",
    })
  }

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      title: "Notification Settings Updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${notificationSettings[key] ? "disabled" : "enabled"}.`,
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    })

    setProfileData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="locations">My Locations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="flex">
                      <User className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex">
                      <Mail className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password here.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="flex">
                      <Lock className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="current-password"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="flex">
                      <Lock className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="new-password"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="flex">
                      <Lock className="mr-2 h-4 w-4 opacity-50 self-center" />
                      <Input
                        id="confirm-password"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Locations</CardTitle>
              <CardDescription>Manage your saved locations for monitoring.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedLocations.length > 0 ? (
                <div className="space-y-4">
                  {savedLocations.map((location) => (
                    <div key={location.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{location.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Viewing Location",
                              description: `Showing data for ${location.name}`,
                            })
                          }}
                        >
                          View
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveLocation(location.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No saved locations yet.</p>
                  <p className="text-sm text-muted-foreground">
                    Search for locations on the map and save them for monitoring.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Add Location",
                    description: "Please use the map search to add new locations.",
                  })
                }}
              >
                Add New Location
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what environmental changes you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Environmental Categories</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="deforestation" className="flex items-center gap-2">
                        <span>Deforestation Alerts</span>
                      </Label>
                      <Switch
                        id="deforestation"
                        checked={notificationSettings.deforestation}
                        onCheckedChange={() => handleNotificationChange("deforestation")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="carbon" className="flex items-center gap-2">
                        <span>Carbon Emissions Updates</span>
                      </Label>
                      <Switch
                        id="carbon"
                        checked={notificationSettings.carbon}
                        onCheckedChange={() => handleNotificationChange("carbon")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="urban" className="flex items-center gap-2">
                        <span>Urban Sprawl Notifications</span>
                      </Label>
                      <Switch
                        id="urban"
                        checked={notificationSettings.urban}
                        onCheckedChange={() => handleNotificationChange("urban")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="water" className="flex items-center gap-2">
                        <span>Water Quality Alerts</span>
                      </Label>
                      <Switch
                        id="water"
                        checked={notificationSettings.water}
                        onCheckedChange={() => handleNotificationChange("water")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Notification Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notif" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Email Notifications</span>
                      </Label>
                      <Switch
                        id="email-notif"
                        checked={notificationSettings.email}
                        onCheckedChange={() => handleNotificationChange("email")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notif" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Push Notifications</span>
                      </Label>
                      <Switch
                        id="push-notif"
                        checked={notificationSettings.push}
                        onCheckedChange={() => handleNotificationChange("push")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Frequency</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weekly-digest" className="flex items-center gap-2">
                        <span>Weekly Summary Digest</span>
                      </Label>
                      <Switch
                        id="weekly-digest"
                        checked={notificationSettings.weekly}
                        onCheckedChange={() => handleNotificationChange("weekly")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Settings Saved",
                    description: "Your notification preferences have been updated.",
                  })
                }}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

