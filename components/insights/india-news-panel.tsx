"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Lightbulb, Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function IndiaNewsPanel() {
  // Mock data for India-specific news and alerts
  const newsData = {
    alerts: [
      {
        id: 1,
        title: "Severe Deforestation in Western Ghats",
        description:
          "Satellite imagery shows a 28% increase in deforestation in the Western Ghats over the past 6 months.",
        location: "Western Ghats, Karnataka",
        date: "2 days ago",
        severity: "high",
        source: "Forest Survey of India",
        link: "#",
      },
      {
        id: 2,
        title: "Air Quality Alert in Delhi NCR",
        description:
          "AQI levels have reached 'severe' category in Delhi NCR. Citizens advised to limit outdoor activities.",
        location: "Delhi NCR",
        date: "Today",
        severity: "high",
        source: "Central Pollution Control Board",
        link: "#",
      },
      {
        id: 3,
        title: "Flood Risk in Coastal Tamil Nadu",
        description: "Heavy rainfall predicted in coastal Tamil Nadu with potential flooding in low-lying areas.",
        location: "Tamil Nadu",
        date: "1 day ago",
        severity: "medium",
        source: "Indian Meteorological Department",
        link: "#",
      },
    ],
    trends: [
      {
        id: 1,
        title: "Renewable Energy Adoption in Gujarat",
        description:
          "Gujarat has seen a 45% increase in solar energy capacity over the past year, leading India's renewable energy transition.",
        location: "Gujarat",
        date: "Quarterly trend",
        severity: "positive",
        source: "Ministry of New and Renewable Energy",
        link: "#",
      },
      {
        id: 2,
        title: "Decreasing Groundwater Levels",
        description:
          "Groundwater levels in Punjab and Haryana continue to decline at an alarming rate of 0.5m per year.",
        location: "Punjab, Haryana",
        date: "Annual trend",
        severity: "high",
        source: "Central Ground Water Board",
        link: "#",
      },
      {
        id: 3,
        title: "Urban Green Cover Improvement",
        description:
          "Bengaluru has increased its urban green cover by 5% through community-led tree plantation drives.",
        location: "Bengaluru, Karnataka",
        date: "Ongoing",
        severity: "positive",
        source: "Bruhat Bengaluru Mahanagara Palike",
        link: "#",
      },
    ],
    policies: [
      {
        id: 1,
        title: "New Plastic Waste Management Rules",
        description:
          "Government announces stricter regulations on single-use plastics, to be implemented nationwide by 2024.",
        location: "India",
        date: "1 week ago",
        severity: "action",
        source: "Ministry of Environment, Forest and Climate Change",
        link: "#",
      },
      {
        id: 2,
        title: "Electric Vehicle Subsidy Program",
        description: "New subsidy scheme launched to promote electric vehicle adoption with up to ₹1.5 lakh incentive.",
        location: "India",
        date: "2 weeks ago",
        severity: "action",
        source: "Ministry of Heavy Industries",
        link: "#",
      },
      {
        id: 3,
        title: "Water Conservation Initiative",
        description:
          "Jal Shakti Ministry launches nationwide water conservation campaign targeting 100 water-stressed districts.",
        location: "India",
        date: "3 weeks ago",
        severity: "action",
        source: "Ministry of Jal Shakti",
        link: "#",
      },
    ],
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="warning">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      case "positive":
        return <Badge variant="success">Positive Trend</Badge>
      case "action":
        return <Badge variant="outline">Policy Update</Badge>
      default:
        return <Badge variant="secondary">Information</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">India Environmental Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="alerts" className="text-xs">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="trends" className="text-xs">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="policies" className="text-xs">
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Policies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            {newsData.alerts.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  {getSeverityBadge(item.severity)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.date}
                  </span>
                </div>
                <div className="mt-2">
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                    <Link href={item.link}>
                      Read more <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {newsData.trends.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  {getSeverityBadge(item.severity)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.date}
                  </span>
                </div>
                <div className="mt-2">
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                    <Link href={item.link}>
                      Read more <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            {newsData.policies.map((item) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  {getSeverityBadge(item.severity)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.location}
                  </span>
                  <span className="flex items-center text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {item.date}
                  </span>
                </div>
                <div className="mt-2">
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                    <Link href={item.link}>
                      Read more <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MapPin(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

