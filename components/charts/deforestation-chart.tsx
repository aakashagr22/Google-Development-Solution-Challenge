"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LocationResult } from "@/components/location-search"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Collapsible } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { ResponsiveContainer } from "recharts"
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, BarChart, Bar } from "recharts"

interface DeforestationChartProps {
  location: LocationResult | null
  year: number
  isLoading?: boolean
}

export function DeforestationChart({ location, year, isLoading }: DeforestationChartProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg border-green-100 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-800">Deforestation Trends</h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-green-200 hover:bg-green-50"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4 text-green-700" />
              Hide Filters
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4 text-green-700" />
              Show Filters
            </>
          )}
        </Button>
      </div>

      <Collapsible open={showFilters}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-green-700">Chart Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  chartType === "line"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setChartType("line")}
              >
                Line
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  chartType === "bar"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setChartType("bar")}
              >
                Bar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-green-700">Data Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={dataType === "area" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  dataType === "area"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setDataType("area")}
              >
                Area
              </Button>
              <Button
                variant={dataType === "percentage" ? "default" : "outline"}
                size="sm"
                className={`h-8 ${
                  dataType === "percentage"
                    ? "bg-green-600 hover:bg-green-700"
                    : "border-green-200 hover:bg-green-50"
                }`}
                onClick={() => setDataType("percentage")}
              >
                Percentage
              </Button>
            </div>
          </div>
        </div>
      </Collapsible>

      <div className="h-[400px] rounded-lg border border-green-100">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#4b5563"
                tick={{ fill: "#4b5563" }}
              />
              <YAxis
                stroke="#4b5563"
                tick={{ fill: "#4b5563" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#1f2937" }}
                itemStyle={{ color: "#1f2937" }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: "#059669", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#059669" }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#4b5563"
                tick={{ fill: "#4b5563" }}
              />
              <YAxis
                stroke="#4b5563"
                tick={{ fill: "#4b5563" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelStyle={{ color: "#1f2937" }}
                itemStyle={{ color: "#1f2937" }}
              />
              <Bar
                dataKey="value"
                fill="#059669"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
} 