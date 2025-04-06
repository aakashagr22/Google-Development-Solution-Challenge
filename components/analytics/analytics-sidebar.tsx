"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DeforestationAnalytics from "./deforestation-analytics"
import CarbonEmissionsAnalytics from "./carbon-emissions-analytics"
import UrbanSprawlAnalytics from "./urban-sprawl-analytics"

export default function AnalyticsSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`border-l bg-background transition-all duration-300 flex flex-col ${isCollapsed ? "w-12" : "w-96"}`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h3 className="font-semibold">Analytics</h3>}
        <Button
          variant="ghost"
          size="icon"
          className={isCollapsed ? "mx-auto" : ""}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="deforestation">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="deforestation">Deforestation</TabsTrigger>
              <TabsTrigger value="carbon">Carbon</TabsTrigger>
              <TabsTrigger value="urban">Urban</TabsTrigger>
            </TabsList>

            <TabsContent value="deforestation" className="space-y-4">
              <DeforestationAnalytics />
            </TabsContent>

            <TabsContent value="carbon" className="space-y-4">
              <CarbonEmissionsAnalytics />
            </TabsContent>

            <TabsContent value="urban" className="space-y-4">
              <UrbanSprawlAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

