import { Badge } from "./ui/badge.jsx"

export function MapLegend({ className, type = "emissions" }) {
  const legends = {
    emissions: [
      { color: "#fee2e2", label: "Very Low" },
      { color: "#fecaca", label: "Low" },
      { color: "#fca5a5", label: "Moderate" },
      { color: "#f87171", label: "High" },
      { color: "#ef4444", label: "Very High" },
      { color: "#dc2626", label: "Extreme" },
    ],
    deforestation: [
      { color: "#d9f99d", label: "Very Low" },
      { color: "#bef264", label: "Low" },
      { color: "#a3e635", label: "Moderate" },
      { color: "#84cc16", label: "High" },
      { color: "#65a30d", label: "Very High" },
      { color: "#4d7c0f", label: "Extreme" },
    ],
    temperature: [
      { color: "#bae6fd", label: "Below Average" },
      { color: "#e0f2fe", label: "Average" },
      { color: "#fef3c7", label: "Slightly Above" },
      { color: "#fde68a", label: "Above Average" },
      { color: "#fcd34d", label: "Well Above" },
      { color: "#f59e0b", label: "Extreme" },
    ],
    disasters: [
      { color: "#ffffff", label: "None" },
      { color: "#fecdd3", label: "Low Risk" },
      { color: "#fda4af", label: "Moderate Risk" },
      { color: "#fb7185", label: "High Risk" },
      { color: "#f43f5e", label: "Very High Risk" },
      { color: "#e11d48", label: "Extreme Risk" },
    ],
  }

  const currentLegend = legends[type] || legends.emissions

  return (
    <div className={`bg-background/80 backdrop-blur-sm p-3 rounded-lg border ${className}`}>
      <div className="flex items-center mb-2">
        <Badge variant="outline">{type.charAt(0).toUpperCase() + type.slice(1)} Legend</Badge>
      </div>
      <div className="flex flex-col gap-1">
        {currentLegend.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

