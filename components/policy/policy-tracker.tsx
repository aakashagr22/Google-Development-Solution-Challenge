"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Check, Clock, AlertTriangle, FileText, ArrowUpRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function PolicyTracker() {
  const [selectedPolicy, setSelectedPolicy] = useState("all")

  const policyData = [
    {
      id: "ncap",
      name: "National Clean Air Programme",
      target: "Reduce PM2.5 and PM10 levels by 20-30% by 2025",
      progress: 45,
      status: "on-track",
      ministry: "Environment, Forest and Climate Change",
      launchDate: "2019",
      lastUpdate: "3 months ago",
      keyMetric: "PM2.5 Reduction",
      metricValue: "15% reduction since 2019",
      challenges: ["Limited funding for air quality monitoring stations", "Implementation gaps in smaller cities"],
      achievements: ["PM2.5 levels reduced by 15% in 42 cities", "132 new air quality monitoring stations established"],
    },
    {
      id: "namami",
      name: "Namami Gange Programme",
      target: "Rejuvenation of River Ganga and its tributaries",
      progress: 62,
      status: "on-track",
      ministry: "Jal Shakti",
      launchDate: "2014",
      lastUpdate: "1 month ago",
      keyMetric: "Sewage Treatment Capacity",
      metricValue: "62% of targeted capacity created",
      challenges: ["Continuous industrial effluent discharge", "Coordination between multiple states"],
      achievements: [
        "Reduced untreated sewage discharge by 48%",
        "Completed 164 of 315 planned sewage treatment projects",
      ],
    },
    {
      id: "kusum",
      name: "PM-KUSUM Solar Scheme",
      target: "Install 30.8 GW of solar capacity through farmers",
      progress: 28,
      status: "delayed",
      ministry: "New and Renewable Energy",
      launchDate: "2019",
      lastUpdate: "2 months ago",
      keyMetric: "Solar Capacity",
      metricValue: "8.6 GW installed against target of 30.8 GW",
      challenges: ["High initial investment cost for farmers", "Grid connectivity issues in rural areas"],
      achievements: ["Enabled 325,000 solar pumps installation", "Reduced agricultural diesel consumption by 18%"],
    },
    {
      id: "nfap",
      name: "National Forest Action Programme",
      target: "Increase forest and tree cover to 33% of India's geography",
      progress: 75,
      status: "on-track",
      ministry: "Environment, Forest and Climate Change",
      launchDate: "2018",
      lastUpdate: "5 months ago",
      keyMetric: "Forest Cover",
      metricValue: "Current coverage: 24.56% (80.9 million hectares)",
      challenges: ["Land availability for afforestation", "Balancing forest conservation with development needs"],
      achievements: [
        "2.1% increase in forest cover since programme inception",
        "Successful implementation of compensatory afforestation",
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <Check className="h-3 w-3" /> On Track
          </Badge>
        )
      case "delayed":
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Delayed
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Critical
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredPolicies =
    selectedPolicy === "all" ? policyData : policyData.filter((policy) => policy.id === selectedPolicy)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select policy to track" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environmental Policies</SelectItem>
            <SelectItem value="ncap">National Clean Air Programme</SelectItem>
            <SelectItem value="namami">Namami Gange Programme</SelectItem>
            <SelectItem value="kusum">PM-KUSUM Solar Scheme</SelectItem>
            <SelectItem value="nfap">National Forest Action Programme</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Policy Reports
        </Button>
      </div>

      <div className="space-y-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{policy.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{policy.target}</p>
                  </div>
                  {getStatusBadge(policy.status)}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Implementation Progress</span>
                    <span className="font-medium">{policy.progress}%</span>
                  </div>
                  <Progress value={policy.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Ministry</div>
                    <div>{policy.ministry}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last Update</div>
                    <div>{policy.lastUpdate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Key Metric</div>
                    <div>{policy.keyMetric}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Performance</div>
                    <div>{policy.metricValue}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Achievements</h4>
                    <ul className="text-sm space-y-1">
                      {policy.achievements.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Implementation Challenges</h4>
                    <ul className="text-sm space-y-1">
                      {policy.challenges.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-2 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Launched: {policy.launchDate}</span>
                <Button variant="link" size="sm" className="flex items-center gap-1 text-xs" asChild>
                  <Link href={`/policy/${policy.id}`}>
                    View Detailed Analysis
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className="text-center">
          Suggest Policy Improvements
        </Button>
      </div>
    </div>
  )
}

