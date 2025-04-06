import { NextResponse } from "next/server"

// Create a server-side API route that returns the API key securely
export async function GET() {
  // Get the API key from environment variables
  const apiKey = process.env.GOOGLE_MAPS_API_KEY // Note: Changed from NEXT_PUBLIC_ prefix

  if (!apiKey) {
    // If no API key is available, return a clear message
    return NextResponse.json(
      {
        error: "Maps configuration not available",
        message: "Please set up the required environment variables for maps functionality.",
      },
      { status: 404 },
    )
  }

  // Return the API key from the server
  return NextResponse.json({
    apiKey,
  })
}

