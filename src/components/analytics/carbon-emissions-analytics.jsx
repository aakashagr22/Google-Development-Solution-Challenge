import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.jsx"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Badge } from "../ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const emissionsTrendData = [
  { year: 1990, emissions: 22.7 },
  { year: 1995, emissions: 23.5 },
  { year: 2000, emissions: 25.2 },
  { year: 2005, emissions: 28.3 },
  { year: 2010, emissions: 33.1 },
  { year: 2015, emissions: 35.5 },
  { year: 2020, emissions: 34.8 },
  { year: 2023, emissions: 36.8 },
]

const sectorData = [
  { name: "Energy", value: 73.2 },
  { name: "Agriculture", value: 18.4 },
  { name: "Industrial Processes", value: 5.2 },
  { name: "Waste", value: 3.2 },
]

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16"]

const countryData = [
  { name: "China", value: 27.3 },
  { name: "United States", value: 14.5 },
  { name: "EU", value: 9.6 },
  { name: "India", value: 7.3 },
  { name: "Russia", value: 4.7 },
  { name: "Japan", value: 3.0 },
  { name: "Other", value: 33.6 },
]

export function CarbonEmissionsAnalytics() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Global CO₂ Emissions Trend</CardTitle>
          <CardDescription>Billion metric tons per year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emissionsTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value) => [`${value} Gt`, "CO₂ Emissions"]}
                />
                <Line
                  type="monotone"
                  dataKey="emissions"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Total Increase</div>
              <div className="text-xl font-bold">+62.1%</div>
              <div className="text-xs text-muted-foreground">Since 1990</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Annual Growth</div>
              <div className="text-xl font-bold">+1.9%</div>
              <div className="text-xs text-muted-foreground">Last 5 years</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Per Capita</div>
              <div className="text-xl font-bold">4.7 tons</div>
              <div className="text-xs text-muted-foreground">Global average</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm text-muted-foreground">Carbon Budget</div>
              <div className="text-xl font-bold">67%</div>
              <div className="text-xs text-muted-foreground">Used (1.5°C goal)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Emissions by Sector</CardTitle>
            <CardDescription>Percentage of global emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--background)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [`${value}%`, "Percentage"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Top Emitting Countries</CardTitle>
            <CardDescription>Percentage of global emissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
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
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Emissions Reduction Scenarios</CardTitle>
          <CardDescription>Projected pathways to meet climate goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Key Insights</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-red-100 dark:bg-red-900 border-red-500">
                  Critical
                </Badge>
                <span>
                  Current emissions trajectory exceeds the carbon budget for limiting warming to 1.5°C by 2030
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-yellow-100 dark:bg-yellow-900 border-yellow-500">
                  Challenge
                </Badge>
                <span>
                  Energy sector transformation is essential, requiring 80% reduction in fossil fuel use by 2050
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-green-100 dark:bg-green-900 border-green-500">
                  Opportunity
                </Badge>
                <span>
                  Renewable energy costs have decreased by 85% since 2010, making transition economically viable
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-blue-100 dark:bg-blue-900 border-blue-500">
                  Action
                </Badge>
                <span>Emissions must peak before 2025 and decline 43% by 2030 to meet Paris Agreement goals</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

