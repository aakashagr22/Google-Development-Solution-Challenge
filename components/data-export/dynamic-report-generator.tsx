"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, FileText, FileSpreadsheet, FileJson, Loader2, Filter, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { exportSatelliteData } from "@/components/data-export/export-service"
import type { ExportOptions } from "@/components/data-export/export-service"
import type { SatelliteAnalysisData } from "@/components/map/satellite-data-service"

export default function DynamicReportGenerator() {
  const { selectedLocation, selectedYear, activeFilters } = useDashboard()
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv" | "json">("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewData, setPreviewData] = useState<string | null>(null)
  const [reportData, setReportData] = useState<SatelliteAnalysisData[]>([])
  const [yearRange, setYearRange] = useState<{ start: number; end: number }>({
    start: selectedYear - 2,
    end: selectedYear,
  })
  const { toast } = useToast()

  // Generate years array for selection
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  // Update report data when location or filters change
  useEffect(() => {
    if (!selectedLocation) return

    // Generate mock data for the report
    const mockData: SatelliteAnalysisData[] = []

    // Add data for each active filter
    if (activeFilters.deforestation) {
      mockData.push({
        type: "Forest Loss",
        value: 7.2,
        unit: "% per year",
        change: 1.8,
        changeUnit: "% increase",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "Global Forest Watch",
      })
      mockData.push({
        type: "Tree Cover",
        value: 45,
        unit: "%",
        change: -3.5,
        changeUnit: "% decrease",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "NASA MODIS",
      })
    }

    if (activeFilters.carbon) {
      mockData.push({
        type: "CO2 Emissions",
        value: 28.5,
        unit: "MtCO2e per year",
        change: 3.2,
        changeUnit: "% increase",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "Global Carbon Project",
      })
      mockData.push({
        type: "Carbon Intensity",
        value: 350,
        unit: "gCO2/kWh",
        change: -1.8,
        changeUnit: "% decrease",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "IEA",
      })
    }

    if (activeFilters.urban) {
      mockData.push({
        type: "Urban Expansion",
        value: 4.8,
        unit: "% per year",
        change: 0.7,
        changeUnit: "% increase",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "Global Human Settlement Layer",
      })
      mockData.push({
        type: "Night Light Intensity",
        value: 65,
        unit: "nW/cm2/sr",
        change: 12.5,
        changeUnit: "% increase",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "VIIRS DNB",
      })
    }

    if (activeFilters.water) {
      mockData.push({
        type: "Water Quality Index",
        value: 75,
        unit: "WQI",
        change: -2.8,
        changeUnit: "% decrease",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "Global Water Quality Index",
      })
      mockData.push({
        type: "Turbidity",
        value: 12,
        unit: "NTU",
        change: 4.7,
        changeUnit: "% increase",
        period: `${yearRange.start}-${yearRange.end}`,
        source: "Water Research Institute",
      })
    }

    setReportData(mockData)
  }, [selectedLocation, activeFilters, yearRange, selectedYear])

  // Generate a preview of the report
  const generatePreview = async () => {
    if (!selectedLocation) {
      toast({
        title: "No location selected",
        description: "Please select a location to generate a report.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const options: ExportOptions = {
        format: exportFormat,
        includeCharts,
        includeMetadata,
      }

      const data = await exportSatelliteData(reportData, selectedLocation.name, getActiveDataTypes(), options)

      setPreviewData(data)
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error generating report",
        description: "An error occurred while generating the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Get active data types as a string
  const getActiveDataTypes = () => {
    const types = []
    if (activeFilters.deforestation) types.push("deforestation")
    if (activeFilters.carbon) types.push("carbon emissions")
    if (activeFilters.urban) types.push("urban sprawl")
    if (activeFilters.water) types.push("water quality")
    return types.join(", ")
  }

  // Download the report
  const downloadReport = () => {
    if (!previewData) {
      generatePreview()
      return
    }

    const blob = new Blob([previewData], { type: getMimeType() })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = getFileName()
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report downloaded",
      description: `Your ${exportFormat.toUpperCase()} report has been downloaded successfully.`,
    })
  }

  // Get the MIME type based on the export format
  const getMimeType = () => {
    switch (exportFormat) {
      case "pdf":
        return "application/pdf"
      case "csv":
        return "text/csv"
      case "json":
        return "application/json"
      default:
        return "text/plain"
    }
  }

  // Get the file name based on the export format
  const getFileName = () => {
    const locationName = selectedLocation?.name || "unknown-location"
    const dateStr = new Date().toISOString().split("T")[0]
    return `environmental-report-${locationName}-${dateStr}.${exportFormat}`
  }

  // Get the icon based on the export format
  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <FileText className="h-4 w-4" />
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />
      case "json":
        return <FileJson className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Environmental Data Reports</span>
          <Button variant="outline" size="sm" onClick={downloadReport} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardTitle>
        <CardDescription>
          Generate and download detailed environmental reports for your selected location and time period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="options" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="options">Report Options</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-4">
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Report Format</Label>
                  <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                    <SelectTrigger id="format" className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year-range">Time Period</Label>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={yearRange.start.toString()}
                      onValueChange={(value) => setYearRange({ ...yearRange, start: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="start-year" className="w-full">
                        <SelectValue placeholder="Start Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={`start-${year}`} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>to</span>
                    <Select
                      value={yearRange.end.toString()}
                      onValueChange={(value) => setYearRange({ ...yearRange, end: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="end-year" className="w-full">
                        <SelectValue placeholder="End Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={`end-${year}`} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Data Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="deforestation" checked={activeFilters.deforestation} disabled />
                    <label
                      htmlFor="deforestation"
                      className={`text-sm ${activeFilters.deforestation ? "" : "text-muted-foreground"}`}
                    >
                      Deforestation Data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="carbon" checked={activeFilters.carbon} disabled />
                    <label
                      htmlFor="carbon"
                      className={`text-sm ${activeFilters.carbon ? "" : "text-muted-foreground"}`}
                    >
                      Carbon Emissions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urban" checked={activeFilters.urban} disabled />
                    <label htmlFor="urban" className={`text-sm ${activeFilters.urban ? "" : "text-muted-foreground"}`}>
                      Urban Sprawl
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="water" checked={activeFilters.water} disabled />
                    <label htmlFor="water" className={`text-sm ${activeFilters.water ? "" : "text-muted-foreground"}`}>
                      Water Quality
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Data categories are based on your current dashboard filters. Change filters to include different data.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Report Content</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-charts"
                      checked={includeCharts}
                      onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                    />
                    <label htmlFor="include-charts" className="text-sm">
                      Include Charts and Visualizations
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-metadata"
                      checked={includeMetadata}
                      onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                    />
                    <label htmlFor="include-metadata" className="text-sm">
                      Include Metadata and Sources
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Generating report preview...</p>
              </div>
            ) : previewData ? (
              <div className="border rounded-md p-4 bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getFormatIcon(exportFormat)}
                    <span className="ml-2 font-medium">{getFileName()}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={generatePreview}>
                    <Filter className="mr-2 h-4 w-4" />
                    Refresh Preview
                  </Button>
                </div>
                <pre className="text-xs overflow-auto max-h-[400px] p-4 bg-background rounded border">
                  {previewData}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Preview Available</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Configure your report options and click the button below to generate a preview.
                </p>
                <Button className="mt-4" onClick={generatePreview}>
                  Generate Preview
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {selectedLocation ? (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {selectedLocation.name}, {selectedLocation.type}
            </span>
          ) : (
            "No location selected"
          )}
        </div>
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Report period: {yearRange.start} - {yearRange.end}
        </div>
      </CardFooter>
    </Card>
  )
}

