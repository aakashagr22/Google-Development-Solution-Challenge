import { NextRequest, NextResponse } from "next/server"
import { getEnvironmentalData } from "@/lib/services/environmental-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const year = parseInt(searchParams.get("year") || "2023")
  const type = searchParams.get("type") as "carbon" | "deforestation"

  if (!location || !type) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    )
  }

  try {
    const data = await getEnvironmentalData(
      { name: location, lat: 0, lng: 0, type: "city" },
      year,
      type
    )
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch environmental data" },
      { status: 500 }
    )
  }
} 