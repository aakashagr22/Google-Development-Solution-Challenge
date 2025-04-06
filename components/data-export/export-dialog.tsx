"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FileJson, FileSpreadsheet, FileIcon as FilePdf } from "lucide-react"
import type { SatelliteAnalysisData } from "@/components/map/satellite-data-service"
import { exportSatelliteData, type ExportOptions } from "./export-service"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  data: SatelliteAnalysisData[]
  location: string
  dataType: string
  onClose: () => void
}

export default function ExportDialog({ data, location, dataType, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<"pdf" | "csv" | "json">("pdf")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Error",
        description: "No data available to export",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const options: ExportOptions = {
        format,
        includeCharts,
        includeMetadata,
      }

      const result = await exportSatelliteData(data, location, dataType, options)

      // Create file name with date
      const date = new Date().toISOString().split("T")[0]
      const fileName = `${dataType.toLowerCase()}-data-${location.toLowerCase().replace(/\s+/g, "-")}-${date}.${format}`

      // Create download link
      const blob = new Blob([result], {
        type: format === "pdf" ? "application/pdf" : format === "csv" ? "text/csv" : "application/json",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: `Data has been exported as ${format.toUpperCase()}`,
      })

      onClose()
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Environmental Data</DialogTitle>
          <DialogDescription>Choose your preferred format and options for exporting the data.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FilePdf className="h-4 w-4" />
                  PDF Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV Spreadsheet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />
                  JSON Data
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="charts"
                  checked={includeCharts}
                  onCheckedChange={(checked) => setIncludeCharts(checked === true)}
                  disabled={format === "csv"}
                />
                <Label htmlFor="charts" className="cursor-pointer">
                  Include charts and visualizations
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                />
                <Label htmlFor="metadata" className="cursor-pointer">
                  Include metadata and sources
                </Label>
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>This report will include:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Environmental data for {location}</li>
              <li>Analysis of {dataType} trends</li>
              <li>Historical comparison data</li>
              {includeMetadata && <li>Data sources and methodology</li>}
              {includeCharts && format !== "csv" && <li>Visual charts and graphs</li>}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

