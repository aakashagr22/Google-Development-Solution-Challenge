import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Badge } from "../ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const urbanizationData = [
  { year: 1950, urban: 30, rural: 70 },
  { year: 1960, urban: 34, rural: 66 },
  { year: 1970, urban: 37, rural: 63 },
  { year: 1980, urban: 40, rural: 60 },
  { year: 1990, urban: 43, rural: 57 },
  { year: 2000, urban: 47, rural: 53 },
  { year: 2010, urban: 52, rural: 48 },
  { year: 2020, urban: 56, rural: 44 },
  { year: 2023, urban: 58, rural: 42 },
]

const landUseData = [
  { year: 1990, urban: 0.5, agriculture: 38, forest: 32, other: 29.5 },
  { year: 2000, urban: 0.6, agriculture: 38.5, forest: 31, other: 29.9 },
  { year: 2010, urban: 0.7, agriculture: 39, forest: 30, other: 30.3 },
  { year: 2020, urban: 0.8, agriculture: 39.5, forest: 29, other: 30.7 },
  { year: 2023, urban: 0.9, agriculture: 40, forest: 28.5, other: 30.6 },
]

const regionUrbanizationData = [
  { name: "North America", value: 82 },
  { name: "Latin America", value: 81 },
  { name: "Europe", value: 75 },
  { name: "Asia", value: 51 },
  { name: "Africa", value: 44 },
  { name: "Oceania", value: 68 },
]

export function UrbanSprawlAnalytics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Global Urbanization Trend</CardTitle>
          <CardDescription>Percentage of population in urban vs. rural areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={urbanizationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRural" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value) => [`${value}%`, "Percentage"]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="urban"
                  name="Urban Population"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#colorUrban)"
                />
                <Area
                  type="monotone"
                  dataKey="rural"
                  name="Rural Population"
                  stroke="#84cc16"
                  fillOpacity={1}
                  fill="url(#colorRural)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Urban Growth</div>
              <div className="text-xl font-bold">+93.3%</div>
              <div className="text-xs text-muted-foreground">Since 1950</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Urban Population</div>
              <div className="text-xl font-bold">4.4B</div>
              <div className="text-xs text-muted-foreground">People in cities</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Megacities</div>
              <div className="text-xl font-bold">33</div>
              <div className="text-xs text-muted-foreground">10M+ population</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Projection</div>
              <div className="text-xl font-bold">68%</div>
              <div className="text-xs text-muted-foreground">Urban by 2050</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Land Use Changes</CardTitle>
            <CardDescription>Percentage of global land area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={landUseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [`${value}%`, "Percentage"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="urban"
                    name="Urban Areas"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                  />
                  <Area
                    type="monotone"
                    dataKey="agriculture"
                    name="Agriculture"
                    stackId="1"
                    stroke="#f97316"
                    fill="#f97316"
                  />
                  <Area type="monotone" dataKey="forest" name="Forests" stackId="1" stroke="#22c55e" fill="#22c55e" />
                  <Area type="monotone" dataKey="other" name="Other Land" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Urbanization by Region</CardTitle>
            <CardDescription>Percentage of population in urban areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionUrbanizationData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [`${value}%`, "Percentage"]}
                  />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Environmental Impact of Urban Sprawl</CardTitle>
          <CardDescription>Key metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Environmental Consequences</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-red-100 dark:bg-red-900 border-red-500">
                  Heat Islands
                </Badge>
                <span>
                  Urban areas are 1-7°C warmer than surrounding rural areas due to heat-absorbing surfaces and reduced
                  vegetation
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-yellow-100 dark:bg-yellow-900 border-yellow-500">
                  Water Systems
                </Badge>
                <span>
                  Impervious surfaces in cities increase runoff by 2-16x, reducing groundwater recharge and increasing
                  flood risks
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-blue-100 dark:bg-blue-900 border-blue-500">
                  Biodiversity
                </Badge>
                <span>
                  Urban expansion threatens 290,000 km² of natural habitat and is projected to impact 40% of protected
                  areas by 2030
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-green-100 dark:bg-green-900 border-green-500">
                  Solutions
                </Badge>
                <span>
                  Green infrastructure, compact development, and urban forests can mitigate impacts while improving
                  livability
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

