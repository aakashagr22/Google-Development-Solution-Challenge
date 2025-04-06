import { type NextRequest, NextResponse } from "next/server"

// Simplified API route that doesn't depend on Firebase initialization
export async function GET(request: NextRequest) {
  try {
    // Mock data for initial deployment
    const mockInsights = [
      {
        id: "1",
        title: "Rapid Deforestation Detected",
        description:
          "Satellite imagery shows a 43% increase in deforestation in the Amazon basin over the past 3 months.",
        location: "Amazonas, Brazil",
        severity: "high",
        type: "alert",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Industrial Emissions Spike",
        description:
          "Carbon emissions from industrial facilities in Eastern Europe have increased by 28% compared to last quarter.",
        location: "Multiple Regions",
        severity: "medium",
        type: "alert",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Reforestation Efforts Showing Results",
        description:
          "Satellite imagery confirms a 12% increase in forest cover in previously degraded areas following restoration projects.",
        location: "Central Africa",
        severity: "positive",
        type: "trend",
        createdAt: new Date().toISOString(),
      },
    ]

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "all"

    let insights = mockInsights

    // Apply filters
    if (type !== "all") {
      insights = insights.filter((insight) => insight.type === type)
    }

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error fetching insights:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Failed to fetch insights", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock successful response
    return NextResponse.json({
      success: true,
      id: "new-insight-" + Date.now(),
    })
  } catch (error) {
    console.error("Error creating insight:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ error: "Failed to create insight", details: errorMessage }, { status: 500 })
  }
}

