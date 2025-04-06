import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      message: "This endpoint requires a POST request with an image file",
      usage: {
        method: "POST",
        contentType: "multipart/form-data",
        body: {
          image: "File (required)",
          location: "String (optional)",
        },
      },
    },
    { status: 200 },
  )
}

export async function POST(request: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await request.formData()
    const imageFile = formData.get("image") as File
    const location = formData.get("location") as string

    if (!imageFile) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Mock analysis results instead of using TensorFlow
    const mockResults = {
      deforestation: {
        probability: 0.75,
        severity: "high",
      },
      urbanization: {
        probability: 0.45,
        severity: "medium",
      },
      emissions: {
        probability: 0.62,
        severity: "medium",
      },
    }

    // Mock successful response
    return NextResponse.json({
      success: true,
      id: "analysis-" + Date.now(),
      results: mockResults,
    })
  } catch (error) {
    console.error("Error processing analysis request:", error)
    return NextResponse.json({ error: "Failed to process image analysis", details: error.message }, { status: 500 })
  }
}

