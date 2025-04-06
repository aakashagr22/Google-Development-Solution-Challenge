"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trophy, Users, Star, ArrowRight, MapPin, TreePine, Leaf, UserCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function CommunityScorecard() {
  const [activeTab, setActiveTab] = useState("cities")
  const { toast } = useToast()

  const cityData = [
    {
      name: "Mumbai",
      score: 78,
      rank: 1,
      badges: ["Water Conservation", "Beach Cleanup"],
      participants: 24580,
      trees: 15230,
      events: 32,
    },
    {
      name: "Bengaluru",
      score: 76,
      rank: 2,
      badges: ["Urban Greenery", "Waste Management"],
      participants: 22340,
      trees: 24600,
      events: 45,
    },
    {
      name: "Delhi",
      score: 65,
      rank: 3,
      badges: ["Air Quality"],
      participants: 32150,
      trees: 10850,
      events: 28,
    },
    {
      name: "Pune",
      score: 72,
      rank: 4,
      badges: ["Waste Recycling"],
      participants: 18900,
      trees: 12300,
      events: 23,
    },
  ]

  const userLeaderboard = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      points: 3250,
      rank: 1,
      badges: ["Nature Champion", "Community Leader"],
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Rahul Mehra",
      location: "Delhi",
      points: 3120,
      rank: 2,
      badges: ["Tree Planter"],
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Ananya Patel",
      location: "Bengaluru",
      points: 2980,
      rank: 3,
      badges: ["Volunteer Star"],
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      name: "Vijay Singh",
      location: "Chennai",
      points: 2840,
      rank: 4,
      badges: ["Water Guardian"],
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const initiatives = [
    {
      name: "Great Indian Tree Plantation",
      participants: 3250,
      impact: "10,000+ trees planted across 15 cities",
      date: "Ongoing (Apr-Aug 2025)",
    },
    {
      name: "River Cleanup Drive",
      participants: 1850,
      impact: "45 tons of waste collected from 12 rivers",
      date: "Last Sunday every month",
    },
    {
      name: "Air Quality Monitoring Network",
      participants: 1230,
      impact: "250 citizen-managed air quality sensors installed",
      date: "Ongoing project",
    },
  ]

  const handleJoinInitiative = () => {
    toast({
      title: "Success!",
      description: "You've successfully joined this initiative. Check your email for details.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Community Engagement
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="cities">City Rankings</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          </TabsList>

          <TabsContent value="cities" className="pt-4">
            <div className="space-y-5">
              {cityData.map((city, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {city.rank}
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {city.name}
                        {city.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {city.badges.map((badge, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Score: {city.score}</div>
                    <Progress value={city.score} className="w-24" />
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{city.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TreePine className="h-3 w-3" />
                      <span>{city.trees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <Button variant="link" size="sm" className="flex items-center gap-1 text-primary">
                View All Cities
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="pt-4">
            <div className="space-y-5">
              {userLeaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {user.rank}
                    </div>
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        {user.name}
                        {user.rank === 1 && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.badges.map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="font-medium">{user.points.toLocaleString()} points</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span>Join the Community</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="initiatives" className="pt-4">
            <div className="space-y-6">
              {initiatives.map((initiative, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-primary" />
                      {initiative.name}
                    </h4>
                    <Badge variant="outline">{initiative.date}</Badge>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">{initiative.impact}</div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{initiative.participants.toLocaleString()} participants</span>
                    </div>

                    <Button size="sm" onClick={handleJoinInitiative}>
                      Join Initiative
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

