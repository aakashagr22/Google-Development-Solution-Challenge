import { Card, CardContent } from "../ui/card.jsx"
import { Badge } from "../ui/badge.jsx"

export function InsightPanel({ type = "carbon" }) {
  // In a real app, these insights would be generated by AI or retrieved from an API
  const insights = {
    carbon: [
      {
        title: "Emissions Trajectory",
        content:
          "Current global emissions are not on track to meet Paris Agreement targets. A 45% reduction from 2010 levels is needed by 2030 to limit warming to 1.5°C.",
        severity: "critical",
        source: "IPCC AR6 Report",
      },
      {
        title: "Sectoral Analysis",
        content:
          "The energy sector remains the largest contributor to global emissions at 73.2%. Transitioning to renewable energy could reduce emissions by up to 70% in this sector.",
        severity: "warning",
        source: "IEA World Energy Outlook",
      },
      {
        title: "Regional Disparities",
        content:
          "While developed nations have stabilized emissions, developing economies show continued growth. Equitable climate finance is essential for global emissions reduction.",
        severity: "info",
        source: "UN Emissions Gap Report",
      },
      {
        title: "Carbon Budget",
        content:
          "At current emission rates, the remaining carbon budget for a 66% chance of limiting warming to 1.5°C will be depleted within 7 years.",
        severity: "critical",
        source: "Global Carbon Project",
      },
    ],
    deforestation: [
      {
        title: "Forest Loss Trends",
        content:
          "Primary forest loss has decreased by 6.3% annually since 2020, but remains 43% above pre-2000 levels. The Amazon and Congo Basin account for 53% of recent losses.",
        severity: "warning",
        source: "Global Forest Watch",
      },
      {
        title: "Agricultural Expansion",
        content:
          "Commercial agriculture drives 73% of tropical deforestation, with beef, soy, palm oil, and timber being the primary commodities associated with forest clearing.",
        severity: "critical",
        source: "FAO State of the World's Forests",
      },
      {
        title: "Carbon Impact",
        content:
          "Deforestation and forest degradation account for approximately 11% of global greenhouse gas emissions, equivalent to the emissions from all passenger vehicles globally.",
        severity: "warning",
        source: "WRI Climate Analysis",
      },
      {
        title: "Restoration Potential",
        content:
          "Global reforestation could capture up to 205 gigatons of carbon, equivalent to 20 years of current emissions, while restoring ecosystem services and biodiversity.",
        severity: "success",
        source: "Nature Climate Change Study",
      },
    ],
    urban: [
      {
        title: "Urbanization Rate",
        content:
          "The global urban population is increasing by 1.4 million people per week. By 2050, 68% of the world's population will live in urban areas, up from 58% today.",
        severity: "info",
        source: "UN World Urbanization Prospects",
      },
      {
        title: "Land Consumption",
        content:
          "Urban land area is expanding 1.5-2x faster than urban population growth, leading to decreased density and increased environmental footprint per capita.",
        severity: "warning",
        source: "World Resources Institute",
      },
      {
        title: "Infrastructure Emissions",
        content:
          "Urban infrastructure and buildings account for 70% of global energy use and 40% of energy-related carbon emissions. Sustainable urban planning could reduce this by 60%.",
        severity: "critical",
        source: "C40 Cities Climate Leadership Group",
      },
      {
        title: "Green Cities Potential",
        content:
          "Compact, connected, and clean urban development could generate $24 trillion in economic benefits by 2050 while reducing emissions by 90% compared to business-as-usual.",
        severity: "success",
        source: "New Climate Economy Report",
      },
    ],
  }

  const currentInsights = insights[type] || insights.carbon

  return (
    <div className="space-y-4">
      {currentInsights.map((insight, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{insight.title}</h3>
                <Badge
                  variant={
                    insight.severity === "critical"
                      ? "destructive"
                      : insight.severity === "warning"
                        ? "default"
                        : insight.severity === "success"
                          ? "success"
                          : "outline"
                  }
                >
                  {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.content}</p>
              <div className="mt-2 text-xs text-muted-foreground">Source: {insight.source}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

