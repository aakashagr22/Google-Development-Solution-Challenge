import { Card, CardContent } from "@/components/ui/card"

interface MapLegendProps {
  type: string
}

export default function MapLegend({ type }: MapLegendProps) {
  const getLegendItems = () => {
    switch (type) {
      case "deforestation":
        return [
          { color: "#00ff00", label: "🌲 Intact Forest" },
          { color: "#ffff00", label: "🌿 Moderate Loss" },
          { color: "#ffa500", label: "🍂 Significant Loss" },
          { color: "#ff0000", label: "🔥 Severe Deforestation" },
        ]
      case "carbon":
        return [
          { color: "#0000ff", label: "Low Emissions" },
          { color: "#00ffff", label: "Moderate Emissions" },
          { color: "#ffff00", label: "High Emissions" },
          { color: "#ff0000", label: "Extreme Emissions" },
        ]
      case "urban":
        return [
          { color: "#f8f9fa", label: "Rural Areas" },
          { color: "#adb5bd", label: "Suburban" },
          { color: "#495057", label: "Urban" },
          { color: "#212529", label: "Dense Urban" },
        ]
      case "water":
        return [
          { color: "#0000ff", label: "Excellent Quality" },
          { color: "#00ffff", label: "Good Quality" },
          { color: "#ffff00", label: "Fair Quality" },
          { color: "#ff0000", label: "Poor Quality" },
        ]
      default:
        return []
    }
  }

  const legendItems = getLegendItems()

  return (
    <Card className="w-48">
      <CardContent className="p-3">
        <h4 className="text-sm font-medium mb-2 capitalize">{type} Legend</h4>
        <div className="space-y-1.5">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

