"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronUp, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function InsightPanel() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-t bg-background">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-t-none rounded-b-xl h-6 -mt-6 px-4 border border-b-0 bg-background"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronUp className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            <span className="ml-2 text-xs">{isExpanded ? "Hide Insights" : "Show Insights"}</span>
          </Button>
        </div>

        {isExpanded && (
          <div className="p-4">
            <Tabs defaultValue="alerts">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="alerts" className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Alerts</span>
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Trends</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    <span>Recommendations</span>
                  </TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  Export Report
                </Button>
              </div>

              <TabsContent value="alerts">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InsightCard
                    title="Rapid Deforestation Detected"
                    description="Satellite imagery shows a 43% increase in deforestation in the Amazon basin over the past 3 months."
                    location="Amazonas, Brazil"
                    severity="high"
                    date="2 days ago"
                  />
                  <InsightCard
                    title="Industrial Emissions Spike"
                    description="Carbon emissions from industrial facilities in Eastern Europe have increased by 28% compared to last quarter."
                    location="Multiple Regions"
                    severity="medium"
                    date="1 week ago"
                  />
                  <InsightCard
                    title="Urban Expansion into Protected Areas"
                    description="Urban development detected encroaching on protected wetlands near coastal regions."
                    location="Southeast Asia"
                    severity="high"
                    date="3 days ago"
                  />
                </div>
              </TabsContent>

              <TabsContent value="trends">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InsightCard
                    title="Reforestation Efforts Showing Results"
                    description="Satellite imagery confirms a 12% increase in forest cover in previously degraded areas following restoration projects."
                    location="Central Africa"
                    severity="positive"
                    date="Ongoing"
                  />
                  <InsightCard
                    title="Renewable Energy Adoption"
                    description="Solar and wind infrastructure deployment has increased by 37% year-over-year in developing regions."
                    location="Global"
                    severity="positive"
                    date="Annual trend"
                  />
                  <InsightCard
                    title="Agricultural Land Use Efficiency"
                    description="Precision agriculture adoption has improved land use efficiency by 23% while reducing water consumption."
                    location="North America"
                    severity="positive"
                    date="Quarterly trend"
                  />
                </div>
              </TabsContent>

              <TabsContent value="recommendations">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InsightCard
                    title="Implement Protected Corridors"
                    description="Establish wildlife corridors between fragmented forest areas to maintain biodiversity and ecosystem resilience."
                    location="Amazon Basin"
                    severity="action"
                    date="High priority"
                  />
                  <InsightCard
                    title="Enhance Urban Planning Policies"
                    description="Develop stricter zoning regulations to prevent urban sprawl into critical ecosystems and agricultural lands."
                    location="Rapidly Growing Cities"
                    severity="action"
                    date="Medium priority"
                  />
                  <InsightCard
                    title="Expand Carbon Monitoring"
                    description="Deploy additional monitoring stations in industrial zones to improve emissions tracking and enforcement."
                    location="Industrial Regions"
                    severity="action"
                    date="Medium priority"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

interface InsightCardProps {
  title: string
  description: string
  location: string
  severity: "high" | "medium" | "low" | "positive" | "action"
  date: string
}

function InsightCard({ title, description, location, severity, date }: InsightCardProps) {
  const getBadgeVariant = () => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      case "positive":
        return "success"
      case "action":
        return "outline"
    }
  }

  const getBadgeText = () => {
    switch (severity) {
      case "high":
        return "High Priority"
      case "medium":
        return "Medium Priority"
      case "low":
        return "Low Priority"
      case "positive":
        return "Positive Trend"
      case "action":
        return "Recommended Action"
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant={getBadgeVariant()}>{getBadgeText()}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">{location}</span>
          <span className="text-muted-foreground">{date}</span>
        </div>
      </CardContent>
    </Card>
  )
}

