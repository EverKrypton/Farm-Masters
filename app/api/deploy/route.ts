import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { websiteData, projectName, customDomain } = await request.json()

    if (!websiteData || !projectName) {
      return NextResponse.json({ error: "Website data and project name are required" }, { status: 400 })
    }

    const deploymentId = `genui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const sanitizedName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")

    // Simulate deployment process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate deployment URL
    const fallbackUrl = customDomain || `https://${sanitizedName}-${deploymentId.slice(-8)}.genui.app`

    return NextResponse.json({
      success: true,
      deploymentId,
      url: fallbackUrl,
      customDomain: customDomain || null,
      status: "deployed",
      platform: "genui-cloud",
      timestamp: new Date().toISOString(),
      files: Object.keys(websiteData.files || {}).length,
      cname: customDomain
        ? {
            record: "CNAME",
            name: customDomain.replace(/^https?:\/\//, ""),
            value: `${sanitizedName}-${deploymentId.slice(-8)}.genui.app`,
          }
        : null,
    })
  } catch (error) {
    console.error("Deployment error:", error)
    return NextResponse.json(
      {
        error: "Failed to deploy website",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
