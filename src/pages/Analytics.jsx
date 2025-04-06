"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import { DeforestationAnalytics } from "../components/analytics/deforestation-analytics.jsx"
import { CarbonEmissionsAnalytics } from "../components/analytics/carbon-emissions-analytics.jsx"
import { UrbanSprawlAnalytics } from "../components/analytics/urban-sprawl-analytics.jsx"
import { AnalyticsSidebar } from "../components/analytics/analytics-sidebar.jsx"
import { InsightPanel } from "../components/insights/insight-panel.jsx"

export function Analytics() {
  const [analysisType, setAnalysisType] = useState("carbon")

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Advanced Analytics</h2>
        <Tabs value={analysisType} onValueChange={setAnalysisType} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="carbon">Carbon</TabsTrigger>
            <TabsTrigger value="deforestation">Deforestation</TabsTrigger>
            <TabsTrigger value="urban">Urban Sprawl</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <TabsContent value="carbon" className="mt-0">
            <CarbonEmissionsAnalytics />
          </TabsContent>
          <TabsContent value="deforestation" className="mt-0">
            <DeforestationAnalytics />
          </TabsContent>
          <TabsContent value="urban" className="mt-0">
            <UrbanSprawlAnalytics />
          </TabsContent>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>AI-generated analysis of climate data</CardDescription>
            </CardHeader>
            <CardContent>
              <InsightPanel type={analysisType} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <AnalyticsSidebar activeAnalysis={analysisType} />
        </div>
      </div>
    </div>
  )
}

