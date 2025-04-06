"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cityRankingData = [
  { city: "Shanghai", growth: 78 },
  { city: "Lagos", growth: 63 },
  { city: "Delhi", growth: 57 },
  { city: "Jakarta", growth: 42 },
  { city: "Mexico City", growth: 38 },
]

export default function UrbanSprawlAnalytics() {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Urban Area Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">Chart visualization will appear here</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Fastest Growing Urban Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cityRankingData.map((item) => (
              <div key={item.city} className="flex items-center justify-between">
                <span className="text-sm">{item.city}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(item.growth / 80) * 100}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">+{item.growth}%</span>
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
              <span>110% increase in global urban area since 2000</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>Urban sprawl accelerating in developing regions</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="rounded-full w-1.5 h-1.5 bg-destructive mt-1.5" />
              <span>68% of world population projected to live in urban areas by 2050</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </>
  )
}

