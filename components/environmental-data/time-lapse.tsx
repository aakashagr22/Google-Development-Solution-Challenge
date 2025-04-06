"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/components/dashboard/dashboard-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Clock, Download, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export default function TimeLapse() {
  const { selectedLocation, availableYears } = useDashboard()
  const [currentYearIndex, setCurrentYearIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Get current year
  const currentYear = availableYears[currentYearIndex]

  // Generate mock data for visualization
  const generateMockData = (year: number, type: "deforestation" | "urban") => {
    const baseYear = 2015
    const yearDiff = year - baseYear

    if (type === "deforestation") {
      // Forest cover decreases over time
      return Math.max(30, 70 - yearDiff * 5 * Math.random())
    } else {
      // Urban area increases over time
      return Math.min(70, 30 + yearDiff * 5 * Math.random())
    }
  }

  // Draw visualization
  const drawVisualization = () => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Canvas dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height

    // Draw background (land)
    ctx.fillStyle = "#e5f5e0"
    ctx.fillRect(0, 0, width, height)

    // Get data for current year
    const forestCover = generateMockData(currentYear, "deforestation")
    const urbanArea = generateMockData(currentYear, "urban")

    // Draw urban areas (gray)
    const urbanSize = (urbanArea / 100) * width
    ctx.fillStyle = "#bdbdbd"

    // Draw urban areas as scattered blocks
    for (let i = 0; i < 20; i++) {
      const blockSize = (urbanSize / 10) * (0.5 + Math.random())
      const x = Math.random() * (width - blockSize)
      const y = Math.random() * (height - blockSize)

      ctx.fillRect(x, y, blockSize, blockSize)
    }

    // Draw forest (green)
    const forestSize = (forestCover / 100) * width
    ctx.fillStyle = "#31a354"

    // Draw forests as irregular shapes
    for (let i = 0; i < 15; i++) {
      const blockSize = (forestSize / 8) * (0.5 + Math.random())
      const x = Math.random() * (width - blockSize)
      const y = Math.random() * (height - blockSize)

      ctx.beginPath()
      ctx.arc(x + blockSize / 2, y + blockSize / 2, blockSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw water bodies (blue)
    ctx.fillStyle = "#9ecae1"
    ctx.beginPath()
    ctx.arc(width * 0.7, height * 0.3, width * 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Draw a river
    ctx.beginPath()
    ctx.moveTo(0, height * 0.6)
    ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.6, height * 0.7, width, height * 0.4)
    ctx.lineWidth = 10
    ctx.strokeStyle = "#9ecae1"
    ctx.stroke()

    // Add year text
    ctx.fillStyle = "#000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText(currentYear.toString(), width / 2, height - 20)

    // Add data text
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Forest cover: ${forestCover.toFixed(1)}%`, 10, 20)
    ctx.fillText(`Urban area: ${urbanArea.toFixed(1)}%`, 10, 40)
  }

  // Handle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Handle restart
  const handleRestart = () => {
    setCurrentYearIndex(0)
  }

  // Handle next frame
  const handleNext = () => {
    if (currentYearIndex < availableYears.length - 1) {
      setCurrentYearIndex(currentYearIndex + 1)
    } else {
      setIsPlaying(false)
    }
  }

  // Handle previous frame
  const handlePrevious = () => {
    if (currentYearIndex > 0) {
      setCurrentYearIndex(currentYearIndex - 1)
    }
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setCurrentYearIndex(value[0])
  }

  // Handle export
  const handleExport = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `time-lapse-${selectedLocation?.name || "location"}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Animation loop
  useEffect(() => {
    drawVisualization()

    if (isPlaying) {
      const interval = 1000 / playbackSpeed

      const animate = () => {
        if (currentYearIndex < availableYears.length - 1) {
          setCurrentYearIndex((prev) => prev + 1)
        } else {
          setIsPlaying(false)
        }
      }

      const timeoutId = setTimeout(animate, interval)
      return () => clearTimeout(timeoutId)
    }
  }, [currentYearIndex, isPlaying, playbackSpeed, availableYears])

  if (!selectedLocation) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Environmental Time-Lapse</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Select a location to view time-lapse visualization
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Environmental Time-Lapse</CardTitle>
            <Badge variant="outline" className="text-xs">
              {selectedLocation.name}
            </Badge>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  This visualization shows how deforestation and urbanization have changed over time. Use the controls
                  to play, pause, and navigate through different years.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="relative">
            <canvas ref={canvasRef} width={500} height={300} className="w-full h-auto border rounded-md" />
            <div className="absolute top-2 right-2">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80" onClick={handleExport}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRestart}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevious}
                  disabled={currentYearIndex === 0}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNext}
                  disabled={currentYearIndex === availableYears.length - 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <select
                  className="text-xs bg-transparent border rounded px-1 py-0.5"
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            </div>

            <div>
              <Slider
                value={[currentYearIndex]}
                min={0}
                max={availableYears.length - 1}
                step={1}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{availableYears[0]}</span>
                <span>{availableYears[Math.floor(availableYears.length / 2)]}</span>
                <span>{availableYears[availableYears.length - 1]}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              This visualization shows the changing landscape of {selectedLocation.name} over time, highlighting the
              relationship between deforestation and urban expansion.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

