"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - in a real app, this would come from your API/Firebase
const hotspotData = [
  { name: "Amazon Basin", percentage: 35 },
  { name: "Congo Basin", percentage: 22 },
  { name: "Southeast Asia", percentage: 18 },
  { name: "Central America", percentage: 12 },
  { name: "Madagascar", percentage: 8 },
  { name: "Others", percentage: 5 },
]

export default function DeforestationAnalytics() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Annual Deforestation Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">Chart visualization will appear here</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Deforestation Hotspots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hotspotData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>93% increase in deforestation since 2015</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>Primary drivers: agriculture expansion and logging</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>Projected loss of 20M hectares by 2030 without intervention</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

