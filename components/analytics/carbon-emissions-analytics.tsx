"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CarbonEmissionsAnalytics() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Emissions by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">Chart visualization will appear here</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Annual Emissions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">Chart visualization will appear here</p>
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
              <span>6.8% increase in global emissions since 2015</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>Energy production remains the largest contributor</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>Current trajectory exceeds 1.5°C warming target</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

