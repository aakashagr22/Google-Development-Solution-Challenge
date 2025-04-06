import { Button } from "@/components/ui/button"
import { Badge } from "./ui/badge.jsx"

// Sample data - in a real app, this would come from an API
const getNewsAlerts = (location) => {
  const globalAlerts = [
    {
      title: "Record-breaking heatwave continues across Southern Europe",
      date: "2023-07-15",
      type: "extreme-weather",
    },
    {
      title: "Amazon deforestation rate drops 33.6% in first half of 2023",
      date: "2023-07-08",
      type: "deforestation",
    },
    {
      title: "New study links air pollution to increased risk of dementia",
      date: "2023-06-22",
      type: "pollution",
    },
  ]

  const locationAlerts = {
    "North America": [
      {
        title: "California wildfire season begins early amid drought conditions",
        date: "2023-06-10",
        type: "wildfire",
      },
    ],
    Europe: [
      {
        title: "EU announces new carbon border tax implementation timeline",
        date: "2023-07-01",
        type: "policy",
      },
    ],
    Asia: [
      {
        title: "Monsoon flooding displaces thousands in Bangladesh",
        date: "2023-07-12",
        type: "flooding",
      },
    ],
    Africa: [
      {
        title: "Drought emergency declared across Horn of Africa",
        date: "2023-06-28",
        type: "drought",
      },
    ],
  }

  return location === "Global" ? globalAlerts : [...(locationAlerts[location] || []), ...globalAlerts].slice(0, 3)
}

export function NewsAlerts({ location = "Global" }) {
  const alerts = getNewsAlerts(location)

  const getAlertBadge = (type) => {
    const variants = {
      "extreme-weather": { variant: "destructive", label: "Extreme Weather" },
      deforestation: { variant: "default", label: "Deforestation" },
      pollution: { variant: "outline", label: "Pollution" },
      wildfire: { variant: "destructive", label: "Wildfire" },
      policy: { variant: "outline", label: "Policy" },
      flooding: { variant: "default", label: "Flooding" },
      drought: { variant: "destructive", label: "Drought" },
    }

    const alertInfo = variants[type] || { variant: "outline", label: type }

    return <Badge variant={alertInfo.variant}>{alertInfo.label}</Badge>
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{alert.date}</span>
            {getAlertBadge(alert.type)}
          </div>
          <p className="text-sm font-medium">{alert.title}</p>
        </div>
      ))}

      <Button variant="outline" className="w-full text-sm">
        View All News
      </Button>
    </div>
  )
}

