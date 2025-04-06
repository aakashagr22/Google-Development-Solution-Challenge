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
const deforestationData = [
  { year: "2010", primary: 12, secondary: 8, plantation: 5 },
  { year: "2011", primary: 11, secondary: 7.8, plantation: 5.5 },
  { year: "2012", primary: 10.5, secondary: 7.5, plantation: 6 },
  { year: "2013", primary: 9.8, secondary: 7.2, plantation: 6.5 },
  { year: "2014", primary: 9.2, secondary: 7, plantation: 7 },
  { year: "2015", primary: 8.7, secondary: 6.8, plantation: 7.5 },
  { year: "2016", primary: 8.2, secondary: 6.5, plantation: 8 },
  { year: "2017", primary: 7.8, secondary: 6.3, plantation: 8.5 },
  { year: "2018", primary: 7.5, secondary: 6, plantation: 9 },
  { year: "2019", primary: 7.2, secondary: 5.8, plantation: 9.5 },
  { year: "2020", primary: 7, secondary: 5.5, plantation: 10 },
  { year: "2021", primary: 6.8, secondary: 5.3, plantation: 10.5 },
  { year: "2022", primary: 6.5, secondary: 5, plantation: 11 },
  { year: "2023", primary: 6.3, secondary: 4.8, plantation: 11.5 },
]

const regionData = [
  { name: "Amazon", value: 35 },
  { name: "Congo Basin", value: 18 },
  { name: "Southeast Asia", value: 25 },
  { name: "Central America", value: 12 },
  { name: "Other", value: 10 },
]

const driversData = [
  { year: "2010", agriculture: 40, logging: 25, infrastructure: 15, urbanization: 10, other: 10 },
  { year: "2015", agriculture: 45, logging: 22, infrastructure: 17, urbanization: 12, other: 4 },
  { year: "2020", agriculture: 50, logging: 20, infrastructure: 18, urbanization: 15, other: 2 },
  { year: "2023", agriculture: 55, logging: 18, infrastructure: 15, urbanization: 18, other: 4 },
]

export function DeforestationAnalytics() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Global Forest Cover Change</CardTitle>
            <CardDescription>Million hectares by forest type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deforestationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPlantation" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
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
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="primary"
                    name="Primary Forest"
                    stroke="#22c55e"
                    fillOpacity={1}
                    fill="url(#colorPrimary)"
                  />
                  <Area
                    type="monotone"
                    dataKey="secondary"
                    name="Secondary Forest"
                    stroke="#84cc16"
                    fillOpacity={1}
                    fill="url(#colorSecondary)"
                  />
                  <Area
                    type="monotone"
                    dataKey="plantation"
                    name="Plantation"
                    stroke="#14b8a6"
                    fillOpacity={1}
                    fill="url(#colorPlantation)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Deforestation by Region</CardTitle>
            <CardDescription>Percentage of global forest loss</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
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
                  <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Drivers of Deforestation</CardTitle>
          <CardDescription>Percentage contribution by sector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={driversData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                <Bar dataKey="agriculture" name="Agriculture" stackId="a" fill="#22c55e" />
                <Bar dataKey="logging" name="Logging" stackId="a" fill="#84cc16" />
                <Bar dataKey="infrastructure" name="Infrastructure" stackId="a" fill="#14b8a6" />
                <Bar dataKey="urbanization" name="Urbanization" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="other" name="Other" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">Key Findings</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-green-100 dark:bg-green-900 border-green-500">
                  Trend
                </Badge>
                <span>
                  Primary forest loss has decreased by 47.5% since 2010, but plantation forests have increased by 130%
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-yellow-100 dark:bg-yellow-900 border-yellow-500">
                  Concern
                </Badge>
                <span>
                  Agricultural expansion remains the dominant driver of deforestation, increasing from 40% to 55% of all
                  causes
                </span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 bg-blue-100 dark:bg-blue-900 border-blue-500">
                  Action
                </Badge>
                <span>
                  Sustainable agriculture practices and stronger forest protection policies are needed to reverse these
                  trends
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

